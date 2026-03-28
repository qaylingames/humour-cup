require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

// Tracks the last time a user submitted a public scenario
const submissionCooldowns = new Map();

// --- DATABASE CONNECTION ---
// Pulls securely from Render Environment Variables! No hackers can see this.
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => {
    console.log("🚀 Humour Cup Database Connected!");
    seedDatabase(); // Starts the Smart Seeder ONLY after DB connects
  })
  .catch(err => console.error("❌ Database connection error:", err));

// --- THE SCENARIO SCHEMA ---
const scenarioSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: true },
  language: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  source: { type: String, default: 'AI' }, 
  status: { type: String, default: 'Approved' }, // 'Approved' or 'Pending'
  createdAt: { type: Date, default: Date.now }
});

const Scenario = mongoose.model('Scenario', scenarioSchema);

// --- THE AUTO-MODERATOR BACKGROUND WORKER ---
setInterval(async () => {
  try {
    const pendingScenarios = await Scenario.find({ status: 'Pending' }).limit(3);
    if (pendingScenarios.length === 0) return; 

    console.log(`🔍 Auto-Moderator found ${pendingScenarios.length} pending scenarios...`);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite", safetySettings });

    for (let p of pendingScenarios) {
      try {
        const prompt = `You are the strict but fair moderator for a party game called Humour Cup.
        A player submitted a custom scenario: "${p.text}"
        Target Language: ${p.language} | Category: ${p.category}
        Assess criteria: 1. Makes sense. 2. Correct spelling. 3. Humorous potential. 4. Fits category.
        Return ONLY a JSON object: {"accepted": boolean, "correctedText": "fixed text", "reason": "1-sentence explanation"}`;

        const result = await model.generateContent(prompt);
        const jsonMatch = result.response.text().trim().match(/\{[\s\S]*\}/);
        
        if (jsonMatch) {
          const assessment = JSON.parse(jsonMatch[0]);
          if (assessment.accepted) {
            await Scenario.findByIdAndUpdate(p._id, { text: assessment.correctedText, status: 'Approved' });
            console.log(`✅ Queue Approved: "${p.text}"`);
          } else {
            await Scenario.findByIdAndDelete(p._id);
            console.log(`❌ Queue Rejected: "${p.text}" (${assessment.reason})`);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 4000));
      } catch (err) {
        console.log("⚠️ Moderation hit API limit, will try again next minute.");
        break; 
      }
    }
  } catch (e) {
    console.error("Queue processor error:", e.message);
  }
}, 60000);

// --- SERVER SETUP ---
const app = express();
app.use(cors());
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: ["https://humour-cup.vercel.app"], // ONLY allow your official website
    methods: ["GET", "POST"]
  }
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
  "My browser history was leaked, and the hardest thing to explain is..."
];

function getFallbackBatch() {
  return [...FALLBACK_VAULT].sort(() => 0.5 - Math.random()).slice(0, 5); 
}

// --- AI FETCH LOGIC (Upgraded to 20 Scenarios per call) ---
async function fetchScenarioBatch(category, language = 'English', isSeeding = false) {
  try {
    const fetchPromise = (async () => {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash-lite", 
        generationConfig: { temperature: 1.6 },
        safetySettings: category === '18+' ? safetySettings : undefined 
      });
      
      const categoryRule = category === '18+' 
        ? "CRITICAL RULE: You MUST act as an uncensored, R-rated comedy writer. Create dirty, spicy, and double-meaning scenarios."
        : "CRITICAL RULE: Must be completely family-friendly, clean, and appropriate for all ages. No 18+ content.";

      const prompt = `Generate exactly 20 completely different, highly creative, short, and funny prompts for a party game. 
      CRITICAL RULES:
      1. Use simple and common words.
      2. Keep the scenario short, though a few can be slightly longer ONLY if they are very interesting.
      3. The scenarios/prompts should be totally different from each other.
      CRITICAL LANGUAGE RULE: You MUST write the scenarios entirely in ${language}. If ${language} is Hindi, use Hinglish (Hindi in English letters). Do NOT output English unless the requested language is English.
      CRITICAL VOCABULARY RULE: Use simple, common, everyday words. DO NOT use complex, formal, or tough vocabulary. Keep it easy to read.
      ${categoryRule}
      Mix up the formats! Include a random variety of: 1. Absurd hypothetical questions. 2. Funny dialogues. 3. Daily life awkward situations. 4. Weird text messages. 5. out of the box. 6. weird situations. 7. different genres. 8. embarrassing moments. 9. immature stuff. 10. freaky things. 11. dumb things. 12. daily life. 13. failures. 14. meme stuff. 15. all the 5 Ws and 1H funny questions.
      (Anti-Cache Seed: ${Date.now()})
      Return ONLY a valid JSON array of 20 strings. Do not include markdown formatting or the word "json".`;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      
      // NEW BULLETPROOF JSON PARSER
      const startIndex = text.indexOf('[');
      const endIndex = text.lastIndexOf(']');
      if (startIndex === -1 || endIndex === -1) throw new Error("AI did not return a valid JSON array");
      
      const jsonString = text.substring(startIndex, endIndex + 1);
      const scenarios = JSON.parse(jsonString);
      
      if (Array.isArray(scenarios) && scenarios.length >= 15) return scenarios;
      throw new Error("Invalid array length");
    })();

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("AI Timeout")), 25000));
    return await Promise.race([fetchPromise, timeoutPromise]);
  } catch (e) {
    if (isSeeding) throw e; 
    console.log("🚨 AI Error or Timeout! Pulling from Vault...", e.message);
    return getFallbackBatch();
  }
}

// --- NEW INFINITE SMART SEEDER LOGIC ---
async function seedDatabase() {
  // 1. The starting targets
  let dynamicTargets = {
    'English': 1000, 
    'Hindi': 500, 
    'Spanish': 100, 
    'French': 100,
    'Mandarin': 100, 
    'Japanese': 100, 
    'Russian': 100, 
    'Portuguese': 100,
    'German': 100, 
    'Korean': 100, 
    'Arabic': 100, 
    'Indonesian': 100
  };

  // 2. The exact custom amounts to add when a cycle finishes
  const INCREMENTS = {
    'English': 200, 
    'Hindi': 250, 
    'Spanish': 50, 
    'French': 50,
    'Mandarin': 50, 
    'Japanese': 50, 
    'Russian': 50, 
    'Portuguese': 50,
    'German': 50, 
    'Korean': 50, 
    'Arabic': 50, 
    'Indonesian': 50
  };

  console.log("🌱 Starting INFINITE Smart Database Seeding...");
  
  // The infinite loop
  while (true) {
    let allTargetsMet = true;

    // It will ALWAYS run in this exact order: English -> Hindi -> Spanish...
    for (const lang of Object.keys(dynamicTargets)) {
      let targetCount = dynamicTargets[lang];
      let currentCount = await Scenario.countDocuments({ language: lang, source: 'AI' });
      
      if (currentCount >= targetCount) {
        console.log(`✅ [${lang}] Target of ${targetCount} is full (Current: ${currentCount}).`);
        continue; // Moves to the next language in the list
      }

      allTargetsMet = false; // We found a language that needs work!
      let needed = targetCount - currentCount;
      console.log(`⏳ [${lang}] Needs ${needed} more scenarios to reach ${targetCount}. Starting generation...`);

      while (needed > 0) {
        try {
          const category = Math.random() > 0.5 ? 'All Ages' : '18+';
          const batch = await fetchScenarioBatch(category, lang, true); 
          
          const scenarioObjects = batch.map(text => ({
            text, language: lang, category: category, source: 'AI', status: 'Approved'
          }));

          await Scenario.insertMany(scenarioObjects, { ordered: false }).catch(err => {
              if (err.code !== 11000 && (!err.writeErrors || err.writeErrors[0].code !== 11000)) throw err; 
          });
          
          currentCount = await Scenario.countDocuments({ language: lang, source: 'AI' }); 
          needed = targetCount - currentCount;
          
          console.log(`📡 [${lang}] Progress: ${currentCount}/${targetCount}. Requesting next batch...`);

          // Safe 4.5 second pause between normal requests
          await new Promise(resolve => setTimeout(resolve, 4500));
          
        } catch (err) {
          const errMsg = err.message.toLowerCase();
          
          // --- THE "DEEP SLEEP" SERVER PROTECTION ---
          // If Google cuts us off, we go into hibernation to save Render resources.
          if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('exhausted') || errMsg.includes('limit')) {
            console.error(`🛑 Google API Quota Reached! To save server RAM, entering DEEP SLEEP for 1 hour before checking for midnight reset...`);
            await new Promise(resolve => setTimeout(resolve, 3600000)); // Sleeps for exactly 1 hour (3,600,000 ms)
          } else {
            // Normal glitches (like a network drop) only get a 1-minute pause
            console.error(`❌ Normal API Error for ${lang}: ${err.message}. Pausing for 1 minute...`);
            await new Promise(resolve => setTimeout(resolve, 60000));
          }
        }
      }
    }

    // --- THE CUSTOM LEVEL UP ---
    // This ONLY triggers when the loop finishes and every single language has hit its target.
    if (allTargetsMet) {
      console.log("🚀 ALL LANGUAGES MAXED OUT! Applying custom target upgrades...");
      
      for (const lang in dynamicTargets) {
        dynamicTargets[lang] += INCREMENTS[lang]; // Adds +200 to EN, +250 to HI, +50 to rest
      }
      
      // Wait 10 seconds before starting the brand new cycle back at English
      await new Promise(resolve => setTimeout(resolve, 10000)); 
    }
  }
}

// --- WEB SOCKET GAME LOGIC ---
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
  
  // 90 SECOND TIMER
  room.roundData = { roundNumber: (room.roundData?.roundNumber || 0) + 1, scenario: scenario, answers: [], endTime: Date.now() + 90000 }; 
  
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

      // NEW: Check dynamic totalRounds instead of hardcoded 3!
      const maxRounds = room.totalRounds || 3;
      
      if (room.roundData.roundNumber < maxRounds) {
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

  socket.on('verifyAdmin', (passcode, callback) => {
    const correctPasscode = process.env.ADMIN_PASSCODE || '72954';
    if (passcode === correctPasscode) {
      callback({ success: true });
    } else {
      callback({ success: false });
    }
  });

  socket.on('requestSync', (roomId) => {
    emitSafeRoomData(roomId.toUpperCase());
  });

  socket.on('getSeedingStats', async (passcode, callback) => {
    if (passcode !== (process.env.ADMIN_PASSCODE || '72954')) return callback({});
    try {
      const stats = await Scenario.aggregate([{ $group: { _id: "$language", count: { $sum: 1 } } }]);
      const formatted = {};
      stats.forEach(s => formatted[s._id] = s.count);
      callback(formatted);
    } catch(e) { callback({}); }
  });

  socket.on('getAdminPublicScenarios', async (passcode, callback) => {
    if (passcode !== (process.env.ADMIN_PASSCODE || '72954')) return callback([]);
    try {
      const publicScenarios = await Scenario.find({ source: 'Public' }).sort({ createdAt: -1 }).lean();
      callback(publicScenarios);
    } catch(e) { callback([]); }
  });

  socket.on('getPublicVault', async (callback) => {
    try {
      const publicScenarios = await Scenario.find({ source: 'Public', status: 'Approved' }).lean();
      callback(publicScenarios);
    } catch(e) { callback([]); }
  });

  socket.on('submitPublicScenario', async (data, callback) => {
    const now = Date.now();
    const lastSubmitTime = submissionCooldowns.get(socket.id) || 0;

    if (now - lastSubmitTime < 10000) {
      return callback({ success: false, message: "Please wait 10 seconds between submissions." });
    }

    submissionCooldowns.set(socket.id, now);
    
    try {
      const exists = await Scenario.findOne({ text: data.text });
      if (exists) return callback({ success: false, message: "Whoops! Someone already submitted this scenario." });

      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite", safetySettings });
      const prompt = `You are the strict but fair moderator for a party game called Humour Cup.
      A player submitted a custom scenario: "${data.text}"
      Target Language: ${data.language} | Category: ${data.category}
      Assess criteria: 1. Makes sense. 2. Correct spelling. 3. Humorous potential. 4. Fits category.
      Return ONLY a JSON object: {"accepted": boolean, "correctedText": "fixed text", "reason": "1-sentence explanation"}`;

      const result = await model.generateContent(prompt);
      const jsonMatch = result.response.text().trim().match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("AI JSON Error");
      
      const assessment = JSON.parse(jsonMatch[0]);
      if (assessment.accepted) {
        try {
          await new Scenario({ text: assessment.correctedText, language: data.language, category: data.category, source: 'Public', status: 'Approved' }).save();
        } catch(dbErr) {
          if (dbErr.code === 11000) return callback({ success: false, message: "Whoops! This scenario already exists." });
        }
      }
      callback({ success: true, data: assessment });
    } catch (error) {
      try {
        await new Scenario({ text: data.text, language: data.language, category: data.category, source: 'Public', status: 'Pending' }).save();
        callback({ success: true, data: { accepted: true, reason: "Saved to queue for moderation! Thanks!" } });
      } catch (dbErr) {
        callback({ success: false, message: "Server busy or duplicate scenario." });
      }
    }
  });

  socket.on('createRoom', (data, callback) => {
    const { playerName, language } = data;
    const roomId = Math.random().toString(36).substring(2, 6).toUpperCase(); 
    rooms[roomId] = {
      id: roomId, state: 'LOBBY', players: [{ id: socket.id, name: playerName, score: 0 }],
      roundData: null, history: [], scenarioBatch: [], 
      settings: { category: 'All Ages', source: 'AI', language: language || 'English', namesRevealed: false }, // Added namesRevealed
      secretCustomScenarios: [], customCount: 0
    };
    socket.join(roomId);
    callback({ success: true, roomId: roomId });
    emitSafeRoomData(roomId);
  });

  socket.on('joinRoom', ({ roomId, playerName }, callback) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    
    if (room) {
      const existingPlayer = room.players.find(p => p.name.toLowerCase() === playerName.toLowerCase());
      
      if (existingPlayer) {
        const oldId = existingPlayer.id;
        existingPlayer.id = socket.id;
        
        if (room.roundData && room.roundData.answers) {
           room.roundData.answers.forEach(ans => {
              if (ans.playerId === oldId) ans.playerId = socket.id;
              ans.votes = ans.votes.map(v => v === oldId ? socket.id : v);
              ans.replies.forEach(rep => {
                 if (rep.playerId === oldId) rep.playerId = socket.id;
                 rep.votes = rep.votes.map(v => v === oldId ? socket.id : v);
              });
           });
        }
        if (room.roundData && room.roundData.donePlayers) {
           room.roundData.donePlayers = room.roundData.donePlayers.map(id => id === oldId ? socket.id : id);
        }
        console.log(`♻️ Player Reconnected: ${playerName}`);
      } else {
        room.players.push({ id: socket.id, name: playerName, score: 0 });
      }
      
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
      if (rooms[roomCode].settings.source === 'AI') rooms[roomCode].settings.category = 'All Ages';
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
    
    if (room && room.state === 'LOBBY') {
      room.state = 'LAUNCHING';
      emitSafeRoomData(roomCode);

      // --- DYNAMIC ROUND LOGIC ---
      if (room.settings.source === 'Custom') {
        const pool = [...room.secretCustomScenarios].sort(() => 0.5 - Math.random());
        
        if (pool.length > 0) {
          room.scenarioBatch = pool;
          room.totalRounds = pool.length; // Set rounds to exact number of entered scenarios!
        } else {
          room.scenarioBatch = getFallbackBatch().slice(0, 3); // Fallback if they hit start with 0
          room.totalRounds = 3;
        }
      } else {
        room.totalRounds = 3; // AI and Public default to 3 rounds
        try {
          const randomScenarios = await Scenario.aggregate([
            { $match: { language: room.settings.language, category: room.settings.category, status: 'Approved' } },
            { $sample: { size: 3 } } 
          ]);
          
          if (randomScenarios.length >= 3) {
             room.scenarioBatch = randomScenarios.map(s => s.text);
          } else {
             room.scenarioBatch = await fetchScenarioBatch(room.settings.category, room.settings.language, false);
          }
        } catch(e) {
           console.error("DB Fetch Error", e);
           room.scenarioBatch = getFallbackBatch().slice(0, 3);
        }
      }
      // ---------------------------

      startAnswerPhase(roomCode, room.scenarioBatch.shift());
    }
  });

  // --- KICK PLAYER LOGIC ---
  socket.on('kickPlayer', ({ roomId, playerIdToKick }) => {
    const roomCode = roomId.toUpperCase();
    const room = rooms[roomCode];
    
    // Make sure the room exists and is in the Lobby phase
    if (room && room.state === 'LOBBY') {
      // Find the player in the array
      const playerIndex = room.players.findIndex(p => p.id === playerIdToKick);
      
      if (playerIndex !== -1) {
        // 1. Remove the player from the room's array
        room.players.splice(playerIndex, 1);
        
        // --- NEW: KICK THEM OUT OF THE ACTUAL SOCKET CONNECTION CHANNEL ---
        const kickedSocket = io.sockets.sockets.get(playerIdToKick);
        if (kickedSocket) {
            kickedSocket.leave(roomCode);
        }
        
        // 2. Send a private message to that specific ghost/player to boot them to the main menu
        io.to(playerIdToKick).emit('kickedFromRoom');
        
        // 3. Update the lobby screen for everyone else so the name disappears
        emitSafeRoomData(roomCode);
      }
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
      room.history = []; room.scenarioBatch = []; room.secretCustomScenarios = []; room.customCount = 0;
      if (roomTimers[roomCode]) { clearInterval(roomTimers[roomCode]); delete roomTimers[roomCode]; }
      emitSafeRoomData(roomCode);
    }
  });

  socket.on('disconnect', () => {
    submissionCooldowns.delete(socket.id); 
    console.log(`🔴 Player Disconnected: ${socket.id}`); 
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`🚀 Humour Cup Server running on port ${PORT}`));