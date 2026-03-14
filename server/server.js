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
  "You are stuck in an elevator for 10 hours with a mime. What is your opening line?",
  "If my bank account could speak, right now it would aggressively yell...",
  "Date: 'I only date people who are highly cultured.'\nYou: 'Oh yeah? Well I...'",
  "What is the worst possible name for a brand new retirement home?",
  "Your dog suddenly speaks perfect English, looks you dead in the eye, and says...",
  "I knew the job interview was over when the CEO pulled out a ______."
];

function getFallbackBatch() {
  const shuffled = [...FALLBACK_VAULT].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5); 
}

async function fetchScenarioBatch() {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 1.5 } // High temperature for maximum creativity!
    });

    const prompt = `Generate exactly 5 completely different, highly creative, short, and funny prompts for an adult party game. 
    CRITICAL RULE: Mix up the formats! Do NOT just use fill-in-the-blanks. Include a random, unpredictable variety of:
    1. Absurd hypothetical questions (e.g., "What would you do if you left the stove on and you're 2 hours away?")
    2. Funny dialogues to complete (e.g., "John: My work life sucks! \\nDaisy: ____")
    3. Daily life awkward situations to comment on.
    4. Weird text messages or emails to reply to.
    5. A classic fill-in-the-blank (if you use a blank, use a line like ______ never the word [BLANK]).
    
    Make them casual, unexpected, sometimes formal but completely unhinged, and open-ended so players can write hilarious answers.
    (Anti-Cache Seed: ${Date.now()})
    Return ONLY a valid JSON array of 5 strings. Do not include markdown formatting or the word "json".`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const scenarios = JSON.parse(text);
    
    if (Array.isArray(scenarios) && scenarios.length >= 3) {
      return scenarios;
    } else {
      throw new Error("Invalid array format from AI");
    }
  } catch (e) {
    console.log("🚨 AI LIMIT HIT OR ERROR! Silently pulling from The Vault...", e.message);
    return getFallbackBatch();
  }
}

const rooms = {};
const roomTimers = {}; 

io.on('connection', (socket) => {
  console.log(`🟢 Player Connected: ${socket.id}`);

  socket.on('createRoom', (playerName, callback) => {
    const roomId = Math.random().toString(36).substring(2, 6).toUpperCase(); 
    rooms[roomId] = {
      id: roomId,
      state: 'LOBBY',
      players: [{ id: socket.id, name: playerName, score: 0 }],
      roundData: null,
      scenarioBatch: [], 
      isFetching: true
    };
    socket.join(roomId);
    callback({ success: true, roomId: roomId });
    io.to(roomId).emit('roomData', rooms[roomId]);

    fetchScenarioBatch().then(batch => {
      if (rooms[roomId]) {
        rooms[roomId].scenarioBatch = batch;
        rooms[roomId].isFetching = false;
        
        if (rooms[roomId].state === 'LAUNCHING') {
           rooms[roomId].state = 'ANSWER_PHASE';
           rooms[roomId].roundData = { roundNumber: 1, scenario: rooms[roomId].scenarioBatch.shift(), answers: [] };
           io.to(roomId).emit('roomData', rooms[roomId]);
        }
      }
    });
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

  socket.on('startGame', (roomId) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    if (room && room.players.length >= 2) {
      if (room.isFetching) {
        room.state = 'LAUNCHING'; 
        io.to(roomCode).emit('roomData', room);
      } else {
        room.state = 'ANSWER_PHASE'; 
        room.roundData = {
          roundNumber: 1,
          scenario: room.scenarioBatch.shift(), 
          answers: []
        };
        io.to(roomCode).emit('roomData', room);
      }
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
        votes: [],
        replies: []
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
        answer.replies.push({
          id: 'rep_' + Math.random().toString(36).substring(2,9),
          playerId: socket.id,
          text: text,
          votes: []
        });

        // THE TIMER FIX: Always adds 15 seconds, capped at 45 seconds from RIGHT NOW!
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
      room.isFetching = true;
      room.scenarioBatch = []; 
      io.to(roomCode).emit('roomData', room);

      fetchScenarioBatch().then(batch => {
        if (rooms[roomCode]) {
          rooms[roomCode].scenarioBatch = batch;
          rooms[roomCode].isFetching = false;
        }
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Player Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 Humour Cup Server running on port ${PORT}`));