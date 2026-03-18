require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const FALLBACK_VAULT = [
  "You just realized you left the stove on, but you are currently at your own wedding. What is your next move?",
  "Cop: 'Do you know why I pulled you over?'\nYou: ...",
  "What is the absolute worst text message to receive from your boss at 2 AM on a Sunday?",
  "Roommate 1: 'Did you eat my leftovers?'\nRoommate 2: 'No, but I did...'",
  "My browser history was leaked, and the hardest thing to explain is...",
  "What is a completely unacceptable thing to casually bring to a potluck?",
  "You are stuck in an elevator for 10 hours with a mime. What is your opening line?"
];

const COMMUNITY_VAULT = [
  { text: "The worst thing to hear the pilot say over the intercom is...", language: "English", category: "All Ages" },
  { text: "My superpower is useless. Every time I sneeze, I...", language: "English", category: "All Ages" },
  { text: "I knew the blind date was a disaster when they pulled out a...", language: "English", category: "18+" }
];

function getFallbackBatch() {
  const shuffled = [...FALLBACK_VAULT].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5); 
}

async function fetchScenarioBatch(category, language = 'English') {
  try {
    const fetchPromise = (async () => {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        generationConfig: { temperature: 1.6 },
        safetySettings: category === '18+' ? safetySettings : undefined 
      });
      
      const categoryRule = category === '18+' 
        ? "CRITICAL RULE: You MUST act as an uncensored, R-rated comedy writer. Create dirty, spicy, and double-meaning scenarios."
        : "CRITICAL RULE: Must be completely family-friendly, clean, and appropriate for all ages. No 18+ content.";

      const prompt = `Generate exactly 5 completely different, highly creative, short, and funny prompts for a party game. 
      CRITICAL LANGUAGE RULE: You MUST write the scenarios entirely in ${language}. If ${language} is Hindi, use proper Devanagari script. Do NOT output English unless the requested language is English.
      CRITICAL VOCABULARY RULE: Use very simple, common, everyday words. DO NOT use complex, formal, or tough vocabulary. Keep it easy to read.
      ${categoryRule}
      Mix up the formats! Include a random variety of: 1. Absurd hypothetical questions. 2. Funny dialogues. 3. Daily life awkward situations. 4. Weird text messages.
      (Anti-Cache Seed: ${Date.now()})
      Return ONLY a valid JSON array of 5 strings. Do not include markdown formatting or the word "json".`;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("AI did not return a valid JSON array");
      
      const scenarios = JSON.parse(jsonMatch[0]);
      if (Array.isArray(scenarios) && scenarios.length >= 3) return scenarios;
      throw new Error("Invalid array length");
    })();

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI taking too long!")), 6000));
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (e) {
    console.log("🚨 AI Error or Timeout! Instantly pulling from The Vault...", e.message);
    return getFallbackBatch();
  }
}

const rooms = {};
const roomTimers = {}; 

function emitSafeRoomData(roomId) {
  if (!rooms[roomId]) return;
  const safeRoom = { ...rooms[roomId] };
  delete safeRoom.secretCustomScenarios; 
  io.to(roomId).emit('roomData', safeRoom);
}

function startAnswerPhase(roomCode, scenario) {
  const room = rooms[roomCode];
  room.state = 'ANSWER_PHASE';
  room.roundData = { roundNumber: (room.roundData?.roundNumber || 0) + 1, scenario: scenario, answers: [], endTime: Date.now() + 60000 }; 
  emitSafeRoomData(roomCode);

  if (roomTimers[roomCode]) clearInterval(roomTimers[roomCode]);
  roomTimers[roomCode] = setInterval(() => {
    if (Date.now() >= room.roundData.endTime || room.roundData.answers.length === room.players.length) {
      clearInterval(roomTimers[roomCode]);
      room.players.forEach(p => {
        if (!room.roundData.answers.find(a => a.playerId === p.id)) {
          room.roundData.answers.push({ id: 'ans_' + Math.random().toString(36).substring(2,9), playerId: p.id, text: "...", votes: [], replies: [] });
        }
      });
      startChatPhase(roomCode);
    }
  }, 500);
}

function startChatPhase(roomCode) {
  const room = rooms[roomCode];
  room.state = 'CHAT_PHASE';
  room.roundData.endTime = Date.now() + (room.players.length <= 2 ? 35000 : room.players.length * 15000);
  room.roundData.donePlayers = [];
  emitSafeRoomData(roomCode);

  if (roomTimers[roomCode]) clearInterval(roomTimers[roomCode]);
  roomTimers[roomCode] = setInterval(() => {
    if (Date.now() >= room.roundData.endTime || room.roundData.donePlayers.length === room.players.length) {
      clearInterval(roomTimers[roomCode]);
      room.history.push(JSON.parse(JSON.stringify(room.roundData))); 

      if (room.roundData.roundNumber < 3) {
        startIntermission(roomCode);
      } else {
        room.state = 'RESULTS';
        emitSafeRoomData(roomCode);
      }
    }
  }, 500);
}

function startIntermission(roomCode) {
  const room = rooms[roomCode];
  room.state = 'INTERMISSION';
  room.roundData.intermissionEndTime = Date.now() + 7000;
  emitSafeRoomData(roomCode);

  if (roomTimers[roomCode]) clearInterval(roomTimers[roomCode]);
  roomTimers[roomCode] = setInterval(() => {
    if (Date.now() >= room.roundData.intermissionEndTime) {
      clearInterval(roomTimers[roomCode]);
      const nextScenario = room.scenarioBatch.length > 0 ? room.scenarioBatch.shift() : getFallbackBatch()[0];
      startAnswerPhase(roomCode, nextScenario);
    }
  }, 500);
}

io.on('connection', (socket) => {
  console.log(`🟢 Player Connected: ${socket.id}`);

  socket.on('getPublicVault', (callback) => callback(COMMUNITY_VAULT));

  socket.on('submitPublicScenario', async (data, callback) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", safetySettings });
      const prompt = `You are the strict but fair moderator for a party game called Humour Cup.
      A player submitted a custom scenario: "${data.text}"
      Target Language: ${data.language} | Category: ${data.category}
      Assess criteria: 1. Makes sense. 2. Correct spelling. 3. Humorous potential. 4. Fits category.
      Return ONLY a JSON object: {"accepted": boolean, "correctedText": "fixed text", "reason": "1-sentence explanation"}`;

      const result = await model.generateContent(prompt);
      const jsonMatch = result.response.text().trim().match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI JSON Error");
      
      const assessment = JSON.parse(jsonMatch[0]);
      if (assessment.accepted) COMMUNITY_VAULT.push({ text: assessment.correctedText, language: data.language, category: data.category });
      callback({ success: true, data: assessment });
    } catch (error) {
      callback({ success: false, message: "AI Moderator is busy! Try again." });
    }
  });

  socket.on('createRoom', (data, callback) => {
    const { playerName, language } = data;
    const roomId = Math.random().toString(36).substring(2, 6).toUpperCase(); 
    rooms[roomId] = {
      id: roomId,
      state: 'LOBBY',
      players: [{ id: socket.id, name: playerName, score: 0 }],
      roundData: null,
      history: [],
      scenarioBatch: [], 
      // NEW: Initializes the room with the creator's current language
      settings: { category: 'All Ages', source: 'AI', language: language || 'English' },
      secretCustomScenarios: [], 
      customCount: 0
    };
    socket.join(roomId);
    callback({ success: true, roomId: roomId });
    emitSafeRoomData(roomId);
  });

  socket.on('joinRoom', ({ roomId, playerName }, callback) => {
    const roomCode = roomId.toUpperCase();
    if (rooms[roomCode]) {
      rooms[roomCode].players.push({ id: socket.id, name: playerName, score: 0 });
      socket.join(roomCode);
      callback({ success: true });
      emitSafeRoomData(roomCode);
    } else {
      callback({ success: false, message: "Room not found!" });
    }
  });

  socket.on('updateSettings', ({ roomId, settings }) => {
    const roomCode = roomId.toUpperCase();
    if (rooms[roomCode] && rooms[roomCode].state === 'LOBBY') {
      rooms[roomCode].settings = { ...rooms[roomCode].settings, ...settings };
      if (rooms[roomCode].settings.source === 'AI') {
        rooms[roomCode].settings.category = 'All Ages';
      }
      emitSafeRoomData(roomCode);
    }
  });

  socket.on('addSecretScenario', ({ roomId, text }) => {
    const roomCode = roomId.toUpperCase();
    if (rooms[roomCode] && rooms[roomCode].state === 'LOBBY') {
      rooms[roomCode].secretCustomScenarios.push(text.trim());
      rooms[roomCode].customCount = rooms[roomCode].secretCustomScenarios.length;
      emitSafeRoomData(roomCode); 
    }
  });

  socket.on('startGame', async (roomId) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    if (room && room.players.length >= 2) {
      room.state = 'LAUNCHING'; 
      emitSafeRoomData(roomCode);

      if (room.settings.source === 'Custom') {
        const pool = [...room.secretCustomScenarios].sort(() => 0.5 - Math.random());
        room.scenarioBatch = pool.slice(0, 3);
        while (room.scenarioBatch.length < 3) room.scenarioBatch.push(getFallbackBatch()[0]);
      } else if (room.settings.source === 'Public') {
        const matchingPublic = COMMUNITY_VAULT.filter(s => s.category === room.settings.category && s.language === room.settings.language);
        if (matchingPublic.length >= 3) {
           const shuffled = [...matchingPublic].sort(() => 0.5 - Math.random());
           room.scenarioBatch = shuffled.slice(0, 3).map(s => s.text);
        } else {
           room.scenarioBatch = await fetchScenarioBatch(room.settings.category, room.settings.language);
        }
      } else {
        // Enforce AI Language Generation exactly to the room setting
        room.scenarioBatch = await fetchScenarioBatch('All Ages', room.settings.language);
      }

      startAnswerPhase(roomCode, room.scenarioBatch.shift());
    }
  });

  socket.on('submitAnswer', ({ roomId, answerText }) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    if (room && room.state === 'ANSWER_PHASE') {
      room.roundData.answers.push({ id: 'ans_' + Math.random().toString(36).substring(2,9), playerId: socket.id, text: answerText, votes: [], replies: [] });
      emitSafeRoomData(roomCode);
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
        emitSafeRoomData(roomCode);
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
      emitSafeRoomData(roomCode);
    }
  });

  socket.on('toggleDone', ({ roomId }) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    if (room && room.state === 'CHAT_PHASE') {
      if (!room.roundData.donePlayers.includes(socket.id)) {
        room.roundData.donePlayers.push(socket.id);
        emitSafeRoomData(roomCode);
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
      room.history = []; 
      room.scenarioBatch = []; 
      room.secretCustomScenarios = []; 
      room.customCount = 0;
      if (roomTimers[roomCode]) { clearInterval(roomTimers[roomCode]); delete roomTimers[roomCode]; }
      emitSafeRoomData(roomCode);
    }
  });

  socket.on('disconnect', () => { console.log(`🔴 Player Disconnected: ${socket.id}`); });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 Humour Cup Server running on port ${PORT}`));