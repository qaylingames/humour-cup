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
  cors: { origin: "*", methods: ["GET", "POST"] } // Changed from localhost!
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// THE FIX: We now pass the 'usedScenarios' array into the AI's brain!
async function fetchNewScenario(usedScenarios = []) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { temperature: 1.4 } 
    });

    const themes = [
      'awkward dates', 'terrible superpowers', 'bad job interviews', 
      'weird family secrets', 'bizarre crimes', 'time travel mistakes', 
      'alien abductions', 'roommate horror stories', 'getting caught', 
      'medical anomalies', 'wild conspiracy theories', 'ruined weddings',
      'pet confessions', 'embarrassing internet searches', 'worst advice'
    ];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    // If we have played rounds already, strictly forbid those past topics!
    let exclusionRule = "";
    if (usedScenarios.length > 0) {
      exclusionRule = `\nCRITICAL RULE: You MUST NOT generate anything similar to these past scenarios:\n"${usedScenarios.join('"\n"')}"\n`;
    }

    const prompt = `Generate a single, short, funny, slightly edgy, open-ended fill-in-the-blank scenario for a party game. 
    The theme MUST involve: ${randomTheme}.${exclusionRule}
    (Anti-Cache Seed: ${Date.now()})
    Return ONLY the text of the scenario, no quotes or extra words. 
    Example: I woke up as a different gender and the first thing I did was...`;

    const result = await model.generateContent(prompt);
    const finalScenario = result.response.text().trim().replace(/^"|"$/g, '');
    
    console.log(`🤖 AI Generated Scenario: "${finalScenario}"`);
    return finalScenario;
  } catch (e) {
    console.error("🚨 AI ERROR DETECTED:", e.message);
    // Added a random number so even the fallback error doesn't look identical twice!
    return `My browser history was just leaked, and the hardest thing to explain is... (Fallback ${Math.floor(Math.random() * 100)})`;
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
      prefetchedScenario: null, 
      isFetching: true,
      usedScenarios: [] // THE MEMORY BANK!
    };
    socket.join(roomId);
    callback({ success: true, roomId: roomId });
    io.to(roomId).emit('roomData', rooms[roomId]);

    fetchNewScenario().then(scenario => {
      if (rooms[roomId]) {
        rooms[roomId].prefetchedScenario = scenario;
        rooms[roomId].usedScenarios.push(scenario); // Save it to memory!
        rooms[roomId].isFetching = false;
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
      room.state = 'LAUNCHING';
      io.to(roomCode).emit('roomData', room);

      const checkReady = setInterval(() => {
        if (!room.isFetching) {
          clearInterval(checkReady);
          setTimeout(() => {
            room.state = 'ANSWER_PHASE';
            room.roundData = {
              roundNumber: 1,
              scenario: room.prefetchedScenario,
              answers: []
            };
            io.to(roomCode).emit('roomData', room);
          }, 1500); 
        }
      }, 200);
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
        room.roundData.maxTime = Date.now() + 60000; 
        room.roundData.donePlayers = [];

        if (roomTimers[roomCode]) clearInterval(roomTimers[roomCode]);
        roomTimers[roomCode] = setInterval(async () => {
          if (Date.now() >= room.roundData.endTime || room.roundData.donePlayers.length === room.players.length) {
            clearInterval(roomTimers[roomCode]);
            
            if (room.roundData.roundNumber < 3) {
              room.state = 'INTERMISSION';
              room.roundData.intermissionEndTime = Date.now() + 7000; 
              io.to(roomCode).emit('roomData', room);

              // Pass the memory bank to the AI for the next round!
              const nextScenarioPromise = fetchNewScenario(room.usedScenarios);

              roomTimers[roomCode] = setInterval(async () => {
                if (Date.now() >= room.roundData.intermissionEndTime) {
                  clearInterval(roomTimers[roomCode]);
                  const nextScenario = await nextScenarioPromise;
                  room.usedScenarios.push(nextScenario); // Add the new one to memory!
                  
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

        room.roundData.endTime = Math.min(room.roundData.endTime + 15000, room.roundData.maxTime);
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
      room.prefetchedScenario = null;
      room.usedScenarios = []; // Wipe the memory bank clean for the new game!
      io.to(roomCode).emit('roomData', room);

      fetchNewScenario().then(scenario => {
        if (rooms[roomCode]) {
          rooms[roomCode].prefetchedScenario = scenario;
          rooms[roomCode].usedScenarios.push(scenario);
          rooms[roomCode].isFetching = false;
        }
      });
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Player Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001; // Render will inject its own port here!
server.listen(PORT, () => console.log(`🚀 Humour Cup Server running on port ${PORT}`));