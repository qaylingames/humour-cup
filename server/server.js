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
  "My browser history was leaked, and the hardest thing to explain is...",
  "I was fired from the morgue today because I accidentally...",
  "The worst possible thing to say right after a kiss is...",
  "My dog finally learned to talk, and his first words to me were...",
  "I got kicked out of the family group chat because I...",
  "The real reason aliens lock their doors when flying past Earth is...",
  "The doctor looked at my X-ray, sighed, and said...",
  "I knew the blind date was over when they pulled out a...",
  "The secret ingredient in my grandma's famous stew is...",
  "The worst thing to accidentally text your boss is...",
  "I won the lottery, but I spent it all in one day on...",
  "My superpower is useless. Every time I sneeze, I..."
];

function getFallbackBatch() {
  const shuffled = [...FALLBACK_VAULT].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5); 
}

async function fetchScenarioBatch() {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 1.4 } 
    });

    const prompt = `Generate exactly 5 completely different, highly creative, short, funny, slightly edgy, open-ended fill-in-the-blank scenarios for an adult party game. 
    (Anti-Cache Seed: ${Date.now()})
    Return ONLY a valid JSON array of strings. Do not include markdown formatting or the word "json".
    Example: ["scenario 1...", "scenario 2...", "scenario 3...", "scenario 4...", "scenario 5..."]`;

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