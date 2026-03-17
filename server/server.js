require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const FALLBACK_VAULT = [
  "You just realized you left the stove on, but you are currently at your own wedding. What is your next move?",
  "Cop: 'Do you know why I pulled you over?'\nYou: ...",
  "What is the absolute worst text message to receive from your boss at 2 AM on a Sunday?",
  "Roommate 1: 'Did you eat my leftovers?'\nRoommate 2: 'No, but I did...'",
  "My browser history was leaked, and the hardest thing to explain is...",
  "What is a completely unacceptable thing to casually bring to a potluck?",
  "You are stuck in an elevator for 10 hours with a mime. What is your opening line?"
];

// The live database of public community scenarios!
const COMMUNITY_VAULT = [
  // A few starter examples so it's not empty!
  { text: "The worst thing to hear the pilot say over the intercom is...", language: "English", category: "All Ages" },
  { text: "My superpower is useless. Every time I sneeze, I...", language: "English", category: "All Ages" },
  { text: "I knew the blind date was a disaster when they pulled out a...", language: "English", category: "18+" }
];

function getFallbackBatch() {
  const shuffled = [...FALLBACK_VAULT].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5); 
}

async function fetchScenarioBatch(category) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 1.5 } 
    });

    const categoryRule = category === '18+' 
      ? "CRITICAL: Make them edgy, adult-oriented, 18+ party game style."
      : "CRITICAL: Must be completely family-friendly, clean, and appropriate for all ages. No 18+ content.";

    const prompt = `Generate exactly 5 completely different, highly creative, short, and funny prompts for a party game. 
    ${categoryRule}
    Mix up the formats! Do NOT just use fill-in-the-blanks. Include a random variety of:
    1. Absurd hypothetical questions.
    2. Funny dialogues to complete (e.g., "John: ... \\nDaisy: ____")
    3. Daily life awkward situations to comment on.
    4. Weird text messages or emails to reply to.
    
    (Anti-Cache Seed: ${Date.now()})
    Return ONLY a valid JSON array of 5 strings. Do not include markdown formatting or the word "json".`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("AI did not return a valid JSON array");
    
    const scenarios = JSON.parse(jsonMatch[0]);
    if (Array.isArray(scenarios) && scenarios.length >= 3) return scenarios;
    throw new Error("Invalid array length");
  } catch (e) {
    console.log("🚨 AI Error! Pulling from The Vault...", e.message);
    return getFallbackBatch();
  }
}

const rooms = {};
const roomTimers = {}; 

io.on('connection', (socket) => {
  console.log(`🟢 Player Connected: ${socket.id}`);

  // Fetch all public scenarios for the home screen library
  socket.on('getPublicVault', (callback) => {
    callback(COMMUNITY_VAULT);
  });

  // Moderation for public submissions
  socket.on('submitPublicScenario', async (data, callback) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const prompt = `You are the strict but fair moderator for a party game called Humour Cup.
      A player submitted a custom scenario: "${data.text}"
      Target Language: ${data.language}
      Category: ${data.category}

      Assess if this scenario is good for the game.
      Criteria: 1. Makes sense and uses relatively simple words. 2. Has correct spelling/grammar. 3. Can be humorously responded to. 4. Fits the selected language and category.
      Return ONLY a JSON object: {"accepted": boolean, "correctedText": "fixed text", "reason": "1-sentence explanation"}`;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI JSON Error");
      
      const assessment = JSON.parse(jsonMatch[0]);

      if (assessment.accepted) {
        COMMUNITY_VAULT.push({ text: assessment.correctedText, language: data.language, category: data.category });
      }
      callback({ success: true, data: assessment });
    } catch (error) {
      console.error("Moderation Error:", error);
      callback({ success: false, message: "AI Moderator is overwhelmed! Try again later." });
    }
  });

  socket.on('createRoom', (playerName, callback) => {
    const roomId = Math.random().toString(36).substring(2, 6).toUpperCase(); 
    rooms[roomId] = {
      id: roomId,
      state: 'LOBBY',
      players: [{ id: socket.id, name: playerName, score: 0 }],
      roundData: null,
      scenarioBatch: [], 
      settings: { category: 'All Ages', source: 'AI', language: 'English' },
      customScenarios: ['', '', ''] // 3 empty slots for Custom Mode
    };
    socket.join(roomId);
    callback({ success: true, roomId: roomId });
    io.to(roomId).emit('roomData', rooms[roomId]);
  });

  socket.on('joinRoom', ({ roomId, playerName }, callback) => {
    const roomCode = roomId.toUpperCase();
    if (rooms[roomCode]) {
      rooms[roomCode].players.push({ id: socket.id, name: playerName, score: 0 });
      socket.join(roomCode);
      callback({ success: true });
      io.to(roomCode).emit('roomData', rooms[roomCode]);
    } else {
      callback({ success: false, message: "Room not found!" });
    }
  });

  // Real-time Settings Updates in Lobby
  socket.on('updateSettings', ({ roomId, settings }) => {
    const roomCode = roomId.toUpperCase();
    if (rooms[roomCode] && rooms[roomCode].state === 'LOBBY') {
      rooms[roomCode].settings = { ...rooms[roomCode].settings, ...settings };
      io.to(roomCode).emit('roomData', rooms[roomCode]);
    }
  });

  // Real-time Custom Scenario Typing in Lobby
  socket.on('updateCustomScenario', ({ roomId, index, text }) => {
    const roomCode = roomId.toUpperCase();
    if (rooms[roomCode] && rooms[roomCode].state === 'LOBBY') {
      rooms[roomCode].customScenarios[index] = text;
      io.to(roomCode).emit('roomData', rooms[roomCode]);
    }
  });

  socket.on('startGame', async (roomId) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    if (room && room.players.length >= 2) {
      room.state = 'LAUNCHING'; 
      io.to(roomCode).emit('roomData', room);

      // Branch logic based on Lobby Settings!
      if (room.settings.source === 'Custom') {
        room.scenarioBatch = room.customScenarios.map((s, i) => s.trim() ? s : `[Someone forgot to write Custom Scenario ${i+1}!]`);
      } else if (room.settings.source === 'Public') {
        const matchingPublic = COMMUNITY_VAULT.filter(s => s.category === room.settings.category && s.language === room.settings.language);
        if (matchingPublic.length >= 3) {
           const shuffled = [...matchingPublic].sort(() => 0.5 - Math.random());
           room.scenarioBatch = shuffled.slice(0, 3).map(s => s.text);
        } else {
           // Not enough public scenarios yet, fallback to AI safely
           room.scenarioBatch = await fetchScenarioBatch(room.settings.category);
        }
      } else {
        // AI Mode
        room.scenarioBatch = await fetchScenarioBatch(room.settings.category);
      }

      room.state = 'ANSWER_PHASE'; 
      room.roundData = {
        roundNumber: 1,
        scenario: room.scenarioBatch.shift(), 
        answers: []
      };
      io.to(roomCode).emit('roomData', room);
    }
  });

  socket.on('submitAnswer', ({ roomId, answerText }) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    if (room && room.state === 'ANSWER_PHASE') {
      room.roundData.answers.push({
        id: 'ans_' + Math.random().toString(36).substring(2,9),
        playerId: socket.id,
        text: answerText,
        votes: [], replies: []
      });

      if (room.roundData.answers.length === room.players.length) {
        room.state = 'CHAT_PHASE';
        const baseTime = room.players.length <= 2 ? 35000 : room.players.length * 15000;
        room.roundData.endTime = Date.now() + baseTime;
        room.roundData.donePlayers = [];

        if (roomTimers[roomCode]) clearInterval(roomTimers[roomCode]);
        roomTimers[roomCode] = setInterval(() => {
          if (Date.now() >= room.roundData.endTime || room.roundData.donePlayers.length === room.players.length) {
            clearInterval(roomTimers[roomCode]);
            
            if (room.roundData.roundNumber < 3) {
              room.state = 'INTERMISSION';
              room.roundData.intermissionEndTime = Date.now() + 7000; 
              io.to(roomCode).emit('roomData', room);

              roomTimers[roomCode] = setInterval(() => {
                if (Date.now() >= room.roundData.intermissionEndTime) {
                  clearInterval(roomTimers[roomCode]);
                  const nextScenario = room.scenarioBatch.length > 0 ? room.scenarioBatch.shift() : getFallbackBatch()[0];
                  room.state = 'ANSWER_PHASE';
                  room.roundData.roundNumber++;
                  room.roundData.scenario = nextScenario;
                  room.roundData.answers = [];
                  io.to(roomCode).emit('roomData', room);
                }
              }, 500);
            } else {
              room.state = 'RESULTS';
              io.to(roomCode).emit('roomData', room);
            }
          }
        }, 500);
      }
      io.to(roomCode).emit('roomData', room);
    }
  });

  socket.on('submitChatReply', ({ roomId, answerId, text }) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    if (room && room.state === 'CHAT_PHASE') {
      const answer = room.roundData.answers.find(a => a.id === answerId);
      if (answer) {
        answer.replies.push({ id: 'rep_' + Math.random().toString(36).substring(2,9), playerId: socket.id, text: text, votes: [] });
        room.roundData.endTime = Math.min(room.roundData.endTime + 15000, Date.now() + 45000);
        room.roundData.donePlayers = []; 
        io.to(roomCode).emit('newReplyAlert');
        io.to(roomCode).emit('roomData', room);
      }
    }
  });

  socket.on('submitChatVote', ({ roomId, itemId }) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    if (room && room.state === 'CHAT_PHASE') {
      for (let ans of room.roundData.answers) {
        if (ans.id === itemId && ans.playerId !== socket.id && !ans.votes.includes(socket.id)) {
          ans.votes.push(socket.id);
          room.players.find(p => p.id === ans.playerId).score += 10;
        }
        for (let rep of ans.replies) {
          if (rep.id === itemId && rep.playerId !== socket.id && !rep.votes.includes(socket.id)) {
            rep.votes.push(socket.id);
            room.players.find(p => p.id === rep.playerId).score += 10;
          }
        }
      }
      io.to(roomCode).emit('roomData', room);
    }
  });

  socket.on('toggleDone', ({ roomId }) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    if (room && room.state === 'CHAT_PHASE') {
      if (!room.roundData.donePlayers.includes(socket.id)) {
        room.roundData.donePlayers.push(socket.id);
        io.to(roomCode).emit('roomData', room);
      }
    }
  });

  socket.on('playAgain', ({ roomId }) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    if (room && room.state === 'RESULTS') {
      room.state = 'LOBBY';
      room.roundData = null; 
      room.players.forEach(p => p.score = 0); 
      room.scenarioBatch = []; 
      room.customScenarios = ['', '', '']; // Reset custom inputs
      io.to(roomCode).emit('roomData', room);
    }
  });

  socket.on('disconnect', () => { console.log(`🔴 Player Disconnected: ${socket.id}`); });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 Humour Cup Server running on port ${PORT}`));