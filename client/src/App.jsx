import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://humour-cup-server.onrender.com');

// ... (Keep your exact uiTranslations object here!) ...
const uiTranslations = {
  // [PASTE YOUR FULL uiTranslations OBJECT HERE SO I DON'T OVERWRITE IT]
  'English': { name: "Your Funny Name", create: "Create Room", orJoin: "OR JOIN A FRIEND", code: "CODE", join: "Join", rulebook: "👑 How to Play 👑", rule1: "Write your humorous response on each scenario.", rule2: "Reply with your humour punches in the chat round after each scenario.", rule3: "Vote the ones you find humorous.", rule4: "The player with the maximum Humour XP gets the Humour Cup.", submitPub: "🌍 Submit a Public Scenario 🌍", pubDesc: "Add your own scenario for humour cup. These come randomly to players opting for Public scenarios in the lobby.", pubPlace: "Type your custom scenario here...", submit: "Submit", lobby: "Lobby", roomCode: "ROOM CODE:", cat: "Category:", scen: "Scenarios:", lang: "Language:", secret: "🤫 Secretly Add to the Game Mix!", secPlace: "Write a surprise scenario...", addPool: "Add to Pool", totPool: "Total Custom Scenarios in Pool:", waitSquad: "Waiting for the squad...", host: "(Host)", launch: "Launch Game 🚀", waitMore: "Waiting for at least 1 more player...", waitHost: "Waiting for the host to start...", fetch: "Fetching Scenarios...", scenTitle: "Scenario", secLeft: "Seconds Left", typeHumour: "Type your humour...", subHumour: "Submit Humour", waitSlow: "Waiting for slower humans...", chatVote: "Chat & Vote Round", humourBtn: "Humorous!", replyBtn: "Reply", repPlace: "Reply...", send: "Send", cancel: "Cancel", done: "I'm Done Reading!", waiting: "Waiting...", upcoming: "Upcoming", enterRound: "Entering Round-", in: "in", seconds: "seconds", load: "Loading...", results: "Final Results", winners: "Winners", winner: "Winner", scoreboard: "Final Scoreboard", receipt: "🧾 MATCH RECEIPT", thanks: "Thanks for playing Humour Cup! 🏆", saveRec: "📸 Save this Match Receipt", playAgain: "Play Again (Host)", waitRes: "Waiting for Host to Restart...", adminVault: "Admin Vault View", backHome: "⬅ Back to Home", noScen: "No scenarios yet!" }
  // (Include your other languages...)
};

const sfxCache = {
  click: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg'), 
  create: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'),
  join: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg'), 
  vote: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg'), 
  win: new Audio('https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg'),
  alert: new Audio('https://actions.google.com/sounds/v1/water/water_drop.ogg'),
  // NEW: A sharp, urgent ticking sound
  tick: new Audio('https://actions.google.com/sounds/v1/tools/ratchet_wrench.ogg') 
};

const BGM_TRACKS = [
  'https://ia903204.us.archive.org/16/items/MonkeysSpinningMonkeys/Monkeys%20Spinning%20Monkeys.mp3',
  'https://ia800305.us.archive.org/30/items/SneakySnitch/Sneaky%20Snitch.mp3',
  'https://ia903107.us.archive.org/15/items/FluffingADuck/Fluffing%20a%20Duck.mp3',
  'https://ia801402.us.archive.org/27/items/TheBuilder_201511/The%20Builder.mp3',
  'https://ia800201.us.archive.org/5/items/MerryGo/Merry%20Go.mp3'
];

function App() {
  const [appLang, setAppLang] = useState('English'); 
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [room, setRoom] = useState(null);
  
  const [pubScenario, setPubScenario] = useState('');
  const [pubLang, setPubLang] = useState('English');
  const [pubCategory, setPubCategory] = useState('All Ages');
  const [pubStatus, setPubStatus] = useState(null); 
  const [secretInput, setSecretInput] = useState(''); 
  
  const [showVault, setShowVault] = useState(false);
  const [vaultData, setVaultData] = useState([]);
  const [logoClicks, setLogoClicks] = useState(0); 

  // Admin Dashboard State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [seedingStats, setSeedingStats] = useState({});
  const [adminPublicScenarios, setAdminPublicScenarios] = useState([]); // NEW STATE

  const [myAnswer, setMyAnswer] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingToAnsId, setReplyingToAnsId] = useState(null);
  const [seenReplies, setSeenReplies] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);

  const [bgmIndex, setBgmIndex] = useState(() => Math.floor(Math.random() * BGM_TRACKS.length));
  const audioRef = useRef(null);
  const receiptRef = useRef(null);
  const prevPlayersCount = useRef(0);
  const prevGameState = useRef('');
  const prevRoundNumber = useRef(1);

  const targets = { 'English': 10000, 'Hindi': 1000, 'Spanish': 1000, 'French': 1000, 'Mandarin': 1000, 'Japanese': 1000, 'Russian': 1000, 'Portuguese': 1000, 'German': 1000, 'Korean': 1000, 'Arabic': 1000, 'Indonesian': 1000 };

  const t = (key) => uiTranslations[appLang]?.[key] || uiTranslations['English'][key] || key;

  useEffect(() => { setPubLang(appLang); }, [appLang]);

  const playSound = (soundName, vol = 1.0) => {
    try {
      const sound = sfxCache[soundName];
      if (sound) { sound.volume = vol; sound.currentTime = 0; sound.play().catch(() => {}); }
    } catch(e) {}
  };

  const unlockAudio = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.volume = 0.05; 
      audioRef.current.play().catch(() => {});
    }
  };

  useEffect(() => { if (audioRef.current) { audioRef.current.volume = 0.05; audioRef.current.play().catch(() => {}); } }, [bgmIndex]);

  // THE RECONNECT FIX
  useEffect(() => {
    const handleReconnect = () => {
      if (room && playerName) {
        socket.emit('joinRoom', { roomId: room.id, playerName }, (res) => {
          if (res.success) socket.emit('requestSync', room.id);
        });
      }
    };
    socket.on('connect', handleReconnect);
    return () => socket.off('connect', handleReconnect);
  }, [room, playerName]);

  useEffect(() => {
    socket.on('roomData', (updatedRoom) => {
      if (updatedRoom.state === 'LOBBY' && updatedRoom.players.length > prevPlayersCount.current) {
        if (prevPlayersCount.current > 0) playSound('join', 1.0); 
      }
      prevPlayersCount.current = updatedRoom.players.length;

      if (updatedRoom.state === 'ANSWER_PHASE' && updatedRoom.roundData?.roundNumber !== prevRoundNumber.current) {
        setBgmIndex(Math.floor(Math.random() * BGM_TRACKS.length));
        prevRoundNumber.current = updatedRoom.roundData.roundNumber;
      }

      if (updatedRoom.state === 'RESULTS' && prevGameState.current !== 'RESULTS') playSound('win', 1.0);
      
      if (updatedRoom.settings?.language && updatedRoom.settings.language !== appLang) {
        setAppLang(updatedRoom.settings.language);
      }

      prevGameState.current = updatedRoom.state;
      setRoom(updatedRoom);
    });

    socket.on('newReplyAlert', () => playSound('alert', 0.5));
    return () => { socket.off('roomData'); socket.off('newReplyAlert'); };
  }, [appLang]);

  useEffect(() => {
    if (room?.state === 'RESULTS') { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }, [room?.state]);

  // TIMER LOGIC
  useEffect(() => {
    if (room?.state === 'CHAT_PHASE' || room?.state === 'ANSWER_PHASE') {
      const interval = setInterval(() => setTimeLeft(Math.max(0, Math.ceil(((room.roundData?.endTime || Date.now()) - Date.now()) / 1000))), 200);
      return () => clearInterval(interval);
    } else if (room?.state === 'INTERMISSION') {
      const interval = setInterval(() => setTimeLeft(Math.max(0, Math.ceil(((room.roundData?.intermissionEndTime || Date.now()) - Date.now()) / 1000))), 200);
      return () => clearInterval(interval);
    }
  }, [room]);

  // NEW: 20-SECOND TICKING SOUND LOGIC
  useEffect(() => {
    // Only tick during active game phases, not intermission or lobby
    if ((room?.state === 'ANSWER_PHASE' || room?.state === 'CHAT_PHASE') && timeLeft > 0 && timeLeft <= 20) {
      playSound('tick', 0.6); // Adjust volume here if it's too loud
    }
  }, [timeLeft, room?.state]);

  // UPDATED: Fetches both Seeding Stats AND Public Scenario list
  const refreshStats = () => { 
    socket.emit('getSeedingStats', (data) => setSeedingStats(data)); 
    socket.emit('getAdminPublicScenarios', (data) => setAdminPublicScenarios(data));
  };

  const handleCreateRoom = () => { playSound('create'); if (!playerName) return alert("Please enter your funny name!"); socket.emit('createRoom', { playerName, language: appLang }, () => {}); };
  const handleJoinRoom = () => { playSound('click'); if (!playerName) return alert("Please enter your funny name!"); if (!joinCode) return alert("Please enter a room code!"); socket.emit('joinRoom', { roomId: joinCode, playerName }, (res) => !res.success && alert(res.message)); };
  const handleStartGame = () => { playSound('click'); socket.emit('startGame', room.id); };
  const handleSettingChange = (key, value) => { socket.emit('updateSettings', { roomId: room.id, settings: { [key]: value } }); };
  const handleSecretSubmit = () => { if (!secretInput.trim()) return; playSound('vote'); socket.emit('addSecretScenario', { roomId: room.id, text: secretInput }); setSecretInput(''); };

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 5) {
      setLogoClicks(0);
      const pwd = prompt("Admin Passcode:");
      if (pwd === "72954") { 
        playSound('win');
        refreshStats();
        setIsAdminMode(true);
      } else {
        playSound('alert');
      }
    }
  };

  const handlePublicSubmit = () => {
    if (!pubScenario.trim()) return;
    playSound('click');
    setPubStatus({ type: 'loading', msg: '⏳' });
    socket.emit('submitPublicScenario', { text: pubScenario, language: pubLang, category: pubCategory }, (res) => {
      if (res.success) {
        playSound('vote'); 
        setPubStatus({ type: 'success', msg: `✅ ${res.data.reason}` });
        setPubScenario(''); 
        setTimeout(() => setPubStatus(null), 6000); 
      } else {
        playSound('alert'); 
        setPubStatus({ type: 'error', msg: `❌ ${res.message}` });
      }
    });
  };

  const handleSubmitAnswer = (e) => { e.preventDefault(); playSound('click'); if (myAnswer) socket.emit('submitAnswer', { roomId: room.id, answerText: myAnswer }); setMyAnswer(''); };
  const handleSendReply = (answerId) => { playSound('click'); if (replyText) socket.emit('submitChatReply', { roomId: room.id, answerId: answerId, text: replyText }); setReplyText(''); setReplyingToAnsId(null); };
  const handleVote = (itemId) => { playSound('vote', 1.0); socket.emit('submitChatVote', { roomId: room.id, itemId: itemId }); };
  const handleDone = () => { playSound('click'); socket.emit('toggleDone', { roomId: room.id }); };
  const handleInitReply = (ansId, prefix = "") => { playSound('click'); setReplyingToAnsId(ansId); setReplyText(prefix); };
  const handlePlayAgain = () => { playSound('click'); socket.emit('playAgain', { roomId: room.id }); };

  const handleSaveReceipt = async () => {
    playSound('click');
    if (receiptRef.current) {
      try {
        const html2canvasModule = await import('html2canvas');
        const html2canvas = html2canvasModule.default || html2canvasModule;
        const canvas = await html2canvas(receiptRef.current, { backgroundColor: '#FFC200', scale: 2 });
        const link = document.createElement('a');
        link.download = `HumourCup_Receipt_${room.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {}
    }
  };

  const isHost = room?.players[0]?.id === socket.id;
  const rainEmojis = ['😂', '🤣', '💀', '🏆', '🔥', '🌶️', '👽', '🦄', '🍻', '😆', '😁', '🫠', '😭', '🤟'];

  return (
    <div onClick={unlockAudio} style={styles.appWrapper}>
      <style>{`
        .btn-3d { transition: transform 0.1s ease, box-shadow 0.1s ease; }
        .btn-3d:active:not(:disabled) { transform: translateY(6px); box-shadow: 0px 0px 0px #1a1a1a !important; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        .animate-bounce { animation: bounce 1.5s infinite ease-in-out; }
        .loading-container { width: 100%; height: 30px; background: #fff; border: 4px solid #1a1a1a; border-radius: 15px; overflow: hidden; position: relative; box-shadow: 4px 4px 0px #1a1a1a; margin-top: 20px;}
        .loading-fill { height: 100%; background: #10b981; width: 0%; animation: loadBar 1.5s ease-in-out forwards; }
        @keyframes loadBar { 0% { width: 0%; } 100% { width: 100%; } }
        .emoji-rain { position: fixed; top: -50px; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 9999; overflow: hidden; }
        .falling-emoji { position: absolute; font-size: 40px; animation: fall linear forwards; opacity: 0.95; }
        @keyframes fall { to { transform: translateY(115vh) rotate(360deg); } }
        @keyframes unified-wobble-breathe { 
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.03) rotate(-3deg); }
          50% { transform: scale(1) rotate(2deg); }
          75% { transform: scale(1.03) rotate(-1deg); }
        }
        .animated-logo-main {
           animation: unified-wobble-breathe 5s infinite ease-in-out;
           max-width: 100%; width: 450px; height: auto; cursor: pointer; user-select: none;
           margin-bottom: 20px; margin-top: 30px; 
        }
      `}</style>

      {/* ... [REST OF YOUR EXISTING RENDER LOGIC] ... */}
      
      {!room && !showVault && !isAdminMode && (
        <div style={styles.translateWrapper}>
          <span style={{fontSize: '16px'}}>🌐</span>
          <select value={appLang} onChange={(e) => setAppLang(e.target.value)} style={styles.translateSelect}>
            <option value="English">EN</option><option value="Mandarin">ZH</option><option value="Hindi">HI</option><option value="Spanish">ES</option><option value="French">FR</option><option value="Arabic">AR</option><option value="Portuguese">PT</option><option value="Russian">RU</option><option value="German">DE</option><option value="Japanese">JA</option><option value="Korean">KO</option><option value="Indonesian">ID</option>
          </select>
        </div>
      )}

      <div style={styles.container}>
         <img src="/finale-logo.png" alt="Humour Cup Logo" className="animated-logo-main" onClick={handleLogoClick} />

        {/* --- VIEW: UPDATED ADMIN DASHBOARD --- */}
        {isAdminMode && !room && (
          <div style={{width: '100%', maxWidth: '600px', backgroundColor: '#fff', padding: '30px', borderRadius: '16px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a', marginBottom: '40px'}}>
            <h2 style={styles.phaseTitle}>🌱 SEEDING DATA</h2>
            <div style={{display: 'flex', gap: '10px', marginBottom: '30px'}}>
               <button onClick={refreshStats} className="btn-3d" style={{...styles.secondaryBtn, flex: 1, backgroundColor: '#10b981', color: '#fff'}}>🔄 REFRESH</button>
               <button onClick={() => setIsAdminMode(false)} className="btn-3d" style={{...styles.secondaryBtn, flex: 1}}>❌ CLOSE</button>
            </div>
            
            <div style={{marginBottom: '40px'}}>
              {Object.entries(targets).map(([lang, target]) => {
                const current = seedingStats[lang] || 0;
                const percent = Math.min(100, (current / target) * 100);
                return (
                  <div key={lang} style={{marginBottom: '20px', textAlign: 'left'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '14px', marginBottom: '5px'}}>
                      <span>{lang}</span><span>{current.toLocaleString()} / {target.toLocaleString()}</span>
                    </div>
                    <div style={{width: '100%', height: '12px', background: '#eee', borderRadius: '10px', overflow: 'hidden', border: '2px solid #1a1a1a'}}>
                      <div style={{width: `${percent}%`, height: '100%', background: percent === 100 ? '#10b981' : '#fbbf24', transition: 'width 0.5s ease'}}></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* NEW: PUBLIC SCENARIOS LIST */}
            <div style={{ borderTop: '4px solid #1a1a1a', paddingTop: '30px' }}>
              <h2 style={{...styles.phaseTitle, fontSize: '24px'}}>🌍 USER SUBMISSIONS ({adminPublicScenarios.length})</h2>
              <div style={{maxHeight: '400px', overflowY: 'auto', background: '#fef3c7', padding: '15px', borderRadius: '12px', border: '3px solid #1a1a1a'}}>
                {adminPublicScenarios.length === 0 ? <p style={{fontWeight: 'bold'}}>No public scenarios submitted yet.</p> :
                  adminPublicScenarios.map((s, i) => (
                    <div key={i} style={{textAlign: 'left', padding: '10px', borderBottom: '2px dashed #ccc'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px'}}>
                         <span style={{fontSize: '12px', fontWeight: '900', color: '#1a1a1a'}}>[{s.language} - {s.category}]</span>
                         <span style={{fontSize: '12px', fontWeight: '900', color: s.status === 'Approved' ? '#10b981' : '#ef4444'}}>
                           {s.status.toUpperCase()}
                         </span>
                      </div>
                      <p style={{margin: '0', fontWeight: 'bold'}}>{s.text}</p>
                    </div>
                  ))
                }
              </div>
            </div>

          </div>
        )}

        {/* ... [REST OF YOUR EXISTING VIEWS (Home, Lobby, Game, etc.)] ... */}
        
        {/* --- VIEW: HOME SCREEN --- */}
        {!room && !showVault && !isAdminMode && (
          <>
            <div style={styles.mainCard}>
              <input placeholder={t('name')} value={playerName} onChange={(e) => setPlayerName(e.target.value)} style={styles.input} />
              <button onClick={handleCreateRoom} className="btn-3d" style={styles.primaryBtn}>{t('create')}</button>
              <div style={styles.divider}>{t('orJoin')}</div>
              <div style={{display:'flex', gap:'10px', width: '100%'}}>
                <input placeholder={t('code')} value={joinCode} onChange={(e) => setJoinCode(e.target.value)} style={styles.smallInput} maxLength={4} />
                <button onClick={handleJoinRoom} className="btn-3d" style={styles.secondaryBtn}>{t('join')}</button>
              </div>
            </div>

            <div style={styles.howToPlayBox}>
              <div style={styles.howToPlayHeader}>{t('rulebook')}</div>
              <div style={styles.howToPlayContent}>
                <p style={styles.howToPlayText}><span style={styles.bullet}>♦</span> {t('rule1')}</p>
                <p style={styles.howToPlayText}><span style={styles.bullet}>♦</span> {t('rule2')}</p>
                <p style={styles.howToPlayText}><span style={styles.bullet}>♦</span> {t('rule3')}</p>
                <p style={styles.howToPlayText}><span style={styles.bullet}>♦</span> {t('rule4')}</p>
              </div>
            </div>

            <div style={{...styles.howToPlayBox, marginTop: '40px', transform: 'rotate(0deg)'}}>
              <div style={{...styles.howToPlayHeader, backgroundColor: '#10b981', color: '#fff'}}>{t('submitPub')}</div>
              <div style={{...styles.howToPlayContent, textAlign: 'center'}}>
                <p style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '15px'}}>{t('pubDesc')}</p>
                <textarea value={pubScenario} onChange={(e) => setPubScenario(e.target.value)} placeholder={t('pubPlace')} style={{...styles.textarea, height: '120px', marginBottom: '10px'}} />
                
                <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                  <select value={pubLang} onChange={(e) => setPubLang(e.target.value)} style={styles.dropdown}>
                    <option value="English">English</option><option value="Mandarin">Mandarin</option><option value="Hindi">Hindi</option><option value="Spanish">Spanish</option><option value="French">French</option><option value="Arabic">Arabic</option><option value="Portuguese">Portuguese</option><option value="Russian">Russian</option><option value="German">German</option><option value="Japanese">Japanese</option><option value="Korean">Korean</option><option value="Indonesian">Indonesian</option>
                  </select>
                  <select value={pubCategory} onChange={(e) => setPubCategory(e.target.value)} style={styles.dropdown}>
                    <option value="All Ages">All Ages</option><option value="18+">18+</option>
                  </select>
                </div>

                <button onClick={handlePublicSubmit} disabled={pubStatus?.type === 'loading'} className="btn-3d" style={{...styles.primaryBtn, padding: '18px', fontSize: '16px'}}>{t('submit')}</button>

                {pubStatus && (
                  <div style={styles.checklistWrapper}>
                    <div style={styles.checklistItem}>{pubStatus.type === 'loading' ? '⏳' : '✅'} Language & Category</div>
                    <div style={styles.checklistItem}>{pubStatus.type === 'loading' ? '⏳' : pubStatus.type === 'success' ? '✅' : '❌'} Simple Words & Grammar</div>
                    <div style={styles.checklistItem}>{pubStatus.type === 'loading' ? '⏳' : pubStatus.type === 'success' ? '✅' : '❌'} Humour Potential</div>
                    <div style={{ marginTop: '12px', fontWeight: '900', fontSize: '14px', color: pubStatus.type === 'success' ? '#10b981' : pubStatus.type === 'error' ? '#ef4444' : '#fbbf24' }}>
                      {pubStatus.msg}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* --- VIEW: LOBBY --- */}
        {room?.state === 'LOBBY' && (
          <>
            <h2 style={styles.phaseTitle}>{t('lobby')}</h2>
            <div style={styles.roomBadge}>{t('roomCode')} {room.id}</div>
            
            <div style={{...styles.mainCard, marginBottom: '30px', textAlign: 'left', paddingTop: '20px'}}>
               <div style={{display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap'}}>
                 
                 <div style={{flex: 1}}>
                   <label style={{fontWeight: '900', fontSize: '14px'}}>{t('scen')}</label>
                   <select disabled={!isHost} value={room.settings.source} onChange={(e) => handleSettingChange('source', e.target.value)} style={{...styles.dropdown, width: '100%', marginTop: '5px'}}>
                     <option>AI</option><option>Public</option><option>Custom</option>
                   </select>
                 </div>

                 {room.settings.source !== 'AI' && (
                   <div style={{flex: 1}}>
                     <label style={{fontWeight: '900', fontSize: '14px'}}>{t('cat')}</label>
                     <select disabled={!isHost} value={room.settings.category} onChange={(e) => handleSettingChange('category', e.target.value)} style={{...styles.dropdown, width: '100%', marginTop: '5px'}}>
                       <option>All Ages</option><option>18+</option>
                     </select>
                   </div>
                 )}

                 {(room.settings.source === 'Public' || room.settings.source === 'AI') && (
                   <div style={{flex: '1 1 100%'}}>
                     <label style={{fontWeight: '900', fontSize: '14px'}}>{t('lang')}</label>
                     <select disabled={!isHost} value={room.settings.language} onChange={(e) => handleSettingChange('language', e.target.value)} style={{...styles.dropdown, width: '100%', marginTop: '5px'}}>
                        <option value="English">English</option><option value="Mandarin">Mandarin</option><option value="Hindi">Hindi</option><option value="Spanish">Spanish</option><option value="French">French</option><option value="Arabic">Arabic</option><option value="Portuguese">Portuguese</option><option value="Russian">Russian</option><option value="German">German</option><option value="Japanese">Japanese</option><option value="Korean">Korean</option><option value="Indonesian">Indonesian</option>
                     </select>
                   </div>
                 )}
               </div>

               {room.settings.source === 'Custom' && (
                 <div style={{backgroundColor: '#e5e7eb', padding: '15px', borderRadius: '12px', border: '3px dashed #1a1a1a', textAlign: 'center'}}>
                   <h4 style={{marginBottom: '10px', fontWeight: '900'}}>{t('secret')}</h4>
                   <input placeholder={t('secPlace')} value={secretInput} onChange={(e) => setSecretInput(e.target.value)} style={{...styles.input, marginBottom: '10px', padding: '10px', fontSize: '14px'}} />
                   <button onClick={handleSecretSubmit} className="btn-3d" style={{...styles.primaryBtn, fontSize: '14px', padding: '10px'}}>{t('addPool')}</button>
                   <p style={{marginTop: '10px', fontWeight: 'bold', color: '#10b981'}}>{t('totPool')} {room.customCount || 0}</p>
                 </div>
               )}
            </div>

            <h3 style={{color: '#1a1a1a', fontWeight: '900', marginBottom: '20px'}}>{t('waitSquad')}</h3>
            <div style={styles.playerGrid}>
              {room.players.map((p, i) => (
                <div key={i} className="animate-bounce" style={{...styles.playerTag, animationDelay: `${i * 0.2}s`}}>
                  🎭 {p.name} {i === 0 && <span style={{opacity: 0.5, fontSize: '14px'}}> {t('host')}</span>}
                </div>
              ))}
            </div>
            {isHost ? (room.players.length >= 2 ? <button onClick={handleStartGame} className="btn-3d" style={styles.startBtn}>{t('launch')}</button> : <h3 className="animate-bounce" style={{color: '#ef4444', marginTop: '30px', fontWeight: '900', fontSize: '20px'}}>{t('waitMore')}</h3>) : <h3 className="animate-bounce" style={styles.loadingText}>{t('waitHost')}</h3>}
          </>
        )}

        {/* --- VIEW: LAUNCHING --- */}
        {room?.state === 'LAUNCHING' && (
          <>
            <h2 style={styles.phaseTitle}>{t('fetch')}</h2>
            <h1 className="animate-bounce" style={{fontSize:'80px', margin:'20px 0'}}>🚀</h1>
            <div className="loading-container"><div className="loading-fill"></div></div>
          </>
        )}

        {/* --- VIEW: ANSWER PHASE --- */}
        {room?.state === 'ANSWER_PHASE' && (() => {
          const safeAnswers = room.roundData.answers || [];
          const hasSubmitted = safeAnswers.some(a => a.playerId === socket.id);
          const currentRound = room.roundData.roundNumber || 1; 
          return (
            <>
              <h2 style={styles.phaseTitle}>{t('scenTitle')} {currentRound}</h2>
              <div style={styles.timerBadge}>⏳ {timeLeft} {t('secLeft')}</div>
              <div style={styles.scenarioCard}>"{room.roundData.scenario}"</div>
              {!hasSubmitted ? (
                <form onSubmit={handleSubmitAnswer} style={styles.form}>
                  <textarea value={myAnswer} onChange={(e) => setMyAnswer(e.target.value)} placeholder={t('typeHumour')} style={styles.textarea} />
                  <button type="submit" className="btn-3d" style={styles.primaryBtn}>{t('subHumour')}</button>
                </form>
              ) : <h2 className="animate-bounce" style={styles.loadingText}>{t('waitSlow')} ({safeAnswers.length}/{room.players.length})</h2>}
            </>
          );
        })()}

        {/* --- VIEW: REAL-TIME CHAT & VOTE PHASE --- */}
        {room?.state === 'CHAT_PHASE' && (() => {
          const donePlayers = room.roundData.donePlayers || [];
          const safeAnswers = room.roundData.answers || [];
          const isDone = donePlayers.includes(socket.id);

          return (
            <>
              <h2 style={styles.phaseTitle}>{t('chatVote')}</h2>
              <h3 style={{ color: '#1a1a1a', marginTop: '-20px', marginBottom: '20px', fontSize: '18px', fontWeight: '800' }}>
                Reply with your humour punches and vote.
              </h3>
              <div style={styles.timerBadge}>⏳ {timeLeft} {t('secLeft')}</div>
              <div style={{...styles.scenarioCard, padding: '20px', fontSize: '22px', marginBottom: '20px'}}>"{room.roundData.scenario}"</div>
              <div style={styles.ansList}>
                {safeAnswers.map((ans) => {
                  const ansAuthor = room.players.find(p => p.id === ans.playerId)?.name || "Unknown";
                  const ansVotes = ans.votes || [];
                  const ansReplies = ans.replies || [];
                  return (
                    <div key={ans.id} style={styles.ansCard}>
                      <p style={{fontSize: '14px', color: '#666', margin: '0 0 5px 0', fontWeight: 'bold'}}>{ansAuthor}:</p>
                      <p style={styles.jokeText}>"{ans.text}"</p>
                      <div style={{display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap'}}>
                        <div style={styles.voteCountBadge}>⭐ {ansVotes.length}</div>
                        {ans.playerId !== socket.id && !ansVotes.includes(socket.id) && <button onClick={() => handleVote(ans.id)} className="btn-3d" style={styles.voteBtn}>{t('humourBtn')}</button>}
                        <button onClick={() => handleInitReply(ans.id)} className="btn-3d" style={styles.replyBtn}>{t('replyBtn')}</button>
                      </div>
                      {ansReplies.map((rep) => {
                        const repAuthor = room.players.find(p => p.id === rep.playerId)?.name || "Unknown";
                        const repVotes = rep.votes || [];
                        const isUnseen = !seenReplies.has(rep.id) && rep.playerId !== socket.id;
                        return (
                          <div key={rep.id} style={styles.replyBubble} onMouseEnter={() => { if (isUnseen) setSeenReplies(prev => new Set(prev).add(rep.id)); }}>
                            {isUnseen && <span style={styles.yellowDot}></span>}
                            <p style={{margin: 0, fontWeight: '800'}}>{repAuthor}:</p>
                            <p style={{margin: '5px 0'}}>{rep.text}</p>
                            <div style={{display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap'}}>
                              <div style={styles.voteCountBadge}>⭐ {repVotes.length}</div>
                              {rep.playerId !== socket.id && !repVotes.includes(socket.id) && <button onClick={() => handleVote(rep.id)} className="btn-3d" style={styles.voteBtn}>{t('humourBtn')}</button>}
                              <button onClick={() => handleInitReply(ans.id, `@${repAuthor} `)} className="btn-3d" style={styles.replyBtn}>{t('replyBtn')}</button>
                            </div>
                          </div>
                        );
                      })}
                      {replyingToAnsId === ans.id && (
                        <div style={{marginTop:'15px', display:'flex', flexDirection:'column', gap:'10px'}}>
                          <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={t('repPlace')} style={styles.input} autoFocus />
                          <div style={{display:'flex', gap:'10px'}}>
                             <button onClick={() => handleSendReply(ans.id)} className="btn-3d" style={styles.actionBtn}>{t('send')}</button>
                             <button onClick={() => { playSound('click'); setReplyingToAnsId(null); }} className="btn-3d" style={styles.cancelBtn}>{t('cancel')}</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: '30px', paddingBottom: '50px', width: '100%' }}>
                <button onClick={handleDone} disabled={isDone} className="btn-3d" style={isDone ? styles.doneBtnActive : styles.primaryBtn}>{isDone ? `${t('waiting')} (${donePlayers.length}/${room.players.length})` : t('done')}</button>
              </div>
            </>
          );
        })()}

        {/* --- VIEW: INTERMISSION --- */}
        {room?.state === 'INTERMISSION' && (() => {
          const sortedPlayers = [...room.players].sort((a,b) => b.score - a.score);
          const nextRound = (room.roundData?.roundNumber || 1) + 1;
          return (
            <>
              <h2 style={styles.phaseTitle}>{t('scenTitle')} {nextRound} {t('upcoming')}</h2>
              <div style={{width: '100%', marginBottom: '40px'}}>
                {sortedPlayers.map((p, i) => (
                  <div key={p.id} style={{display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#fff', border: '3px solid #1a1a1a', borderRadius: '12px', marginBottom: '10px', fontWeight: 'bold', boxShadow: '4px 4px 0px #1a1a1a'}}>
                    <span style={{fontSize: '18px'}}>#{i + 1} {p.name}</span><span style={{fontSize: '18px', color: '#10b981'}}>{p.score} XP</span>
                  </div>
                ))}
              </div>
              {timeLeft > 0 ? <h3 style={{color: '#1a1a1a', fontWeight: '900', fontSize: '24px', textTransform: 'uppercase'}}>{t('enterRound')}{nextRound} {t('in')} {timeLeft} {t('seconds')}...</h3> : <div style={{width: '100%', marginTop: '20px'}}><h3 className="animate-bounce" style={{color: '#1a1a1a', fontWeight: '900', fontSize: '20px', textTransform: 'uppercase'}}>{t('load')}</h3><div className="loading-container"><div className="loading-fill"></div></div></div>}
            </>
          );
        })()}

        {/* --- VIEW: RESULTS --- */}
        {room?.state === 'RESULTS' && (() => {
          const sortedPlayers = [...room.players].sort((a,b) => b.score - a.score);
          const highestScore = sortedPlayers[0].score;
          const winners = sortedPlayers.filter(p => p.score === highestScore);
          const isTie = winners.length > 1;

          return (
            <>
              <div className="emoji-rain">
                {Array.from({ length: 30 }).map((_, i) => (
                  <span key={i} className="falling-emoji" style={{
                    left: `${Math.random() * 100}vw`,
                    animationDuration: `${Math.random() * 4 + 3}s`,
                    animationDelay: `${Math.random() * 5}s`
                  }}>
                    {rainEmojis[Math.floor(Math.random() * rainEmojis.length)]}
                  </span>
                ))}
              </div>

              <div style={{marginTop: '20px'}}></div>
              
              <h3 style={{color: '#1a1a1a', textTransform: 'uppercase', fontWeight: '900', marginTop: '10px', marginBottom: '10px', fontSize: '24px'}}>{isTie ? t('winners') : t('winner')}</h3>
              <div style={styles.winnerCard}>
                {winners.map(w => <h1 key={w.id} style={{margin:'0 0 5px 0', color: '#1a1a1a', fontSize: '42px'}}>{w.name}</h1>)}
                <h3 style={{margin:'15px 0 0 0', color: '#1a1a1a', opacity: 0.8}}>{highestScore} XP</h3>
              </div>

              <div ref={receiptRef} style={styles.receiptBox}>
                <h2 style={styles.receiptTitle}>{t('receipt')}</h2>
                
                <h3 style={styles.receiptSectionTitle}>Final Scoreboard</h3>
                <div style={styles.receiptScoreboard}>
                  {sortedPlayers.map((p, i) => (
                    <div key={p.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontWeight: '900', color: '#1a1a1a', fontSize: '16px'}}>
                      <span>#{i + 1} {p.name}</span><span>{p.score} XP</span>
                    </div>
                  ))}
                </div>

                <h3 style={styles.receiptSectionTitle}>The Scenarios</h3>
                {room.history && room.history.map((round, i) => (
                  <div key={i} style={styles.receiptCard}>
                    <p style={{fontWeight: '900', fontSize: '16px', color: '#1a1a1a', margin: '0 0 10px 0'}}>Round {round.roundNumber}: "{round.scenario}"</p>
                    {round.answers.map(ans => {
                      const author = room.players.find(p => p.id === ans.playerId)?.name || "Unknown";
                      return (
                        <div key={ans.id}>
                          <p style={{fontSize: '14px', color: '#555', margin: '5px 0 0 0'}}>
                            <strong style={{color: '#777'}}>{author}:</strong> "{ans.text}" (⭐ {ans.votes.length})
                          </p>
                          {ans.replies.map(rep => {
                            const repAuthor = room.players.find(p => p.id === rep.playerId)?.name || "Unknown";
                            return <p key={rep.id} style={{fontSize: '13px', color: '#999', margin: '2px 0 0 15px'}}>↳ <b>{repAuthor}:</b> {rep.text}</p>
                          })}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              <button onClick={handleSaveReceipt} className="btn-3d" style={{...styles.secondaryBtn, width: '100%', marginBottom: '20px', backgroundColor: '#10b981', color: '#fff'}}>{t('saveRec')}</button>

              {isHost ? <button onClick={handlePlayAgain} className="btn-3d" style={styles.primaryBtn}>{t('playAgain')}</button> : <h3 className="animate-bounce" style={{color: '#1a1a1a', fontWeight: '900', fontSize: '20px'}}>{t('waitRes')}</h3>}
            </>
          );
        })()}
      </div>
    </div>
  );
}

const styles = {
  appWrapper: { minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', padding: '20px', position: 'relative', backgroundColor: '#FFC200' }, 
  howToPlayBox: { marginTop: '40px', width: '100%', backgroundColor: '#ffffff', border: '4px solid #1a1a1a', borderRadius: '16px', boxShadow: '6px 6px 0px #1a1a1a', overflow: 'hidden', transform: 'rotate(-1.5deg)' },
  howToPlayHeader: { backgroundColor: '#1a1a1a', color: '#FFC200', padding: '12px', fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' },
  howToPlayContent: { padding: '25px', textAlign: 'left' },
  howToPlayText: { fontSize: '15px', color: '#1a1a1a', marginBottom: '15px', fontWeight: '800', lineHeight: '1.6', display: 'flex', alignItems: 'flex-start', gap: '8px' },
  bullet: { color: '#10b981', fontSize: '16px' }, 
  container: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '60px', paddingBottom: '60px' },
  mainCard: { background: '#ffffff', padding: '40px', borderRadius: '24px', width: '100%', border: '4px solid #1a1a1a', boxShadow: '10px 10px 0px #1a1a1a' },
  input: { backgroundColor: '#333333', color: '#ffffff', width: '100%', padding: '20px', borderRadius: '12px', border: '3px solid #1a1a1a', fontSize: '20px', marginBottom: '25px', fontWeight: 'bold', outline: 'none' },
  smallInput: { backgroundColor: '#333333', color: '#ffffff', flex: 1, padding: '20px', borderRadius: '12px', border: '3px solid #1a1a1a', fontSize: '20px', fontWeight: 'bold', outline: 'none', textTransform: 'uppercase', minWidth: 0 },
  textarea: { backgroundColor: '#333333', color: '#ffffff', width: '100%', height: '150px', padding: '20px', borderRadius: '16px', border: '3px solid #1a1a1a', fontSize: '20px', marginBottom: '25px', fontWeight: 'bold', outline: 'none', resize: 'none' },
  primaryBtn: { width: '100%', padding: '22px', borderRadius: '12px', border: '3px solid #1a1a1a', backgroundColor: '#ffffff', color: '#1a1a1a', fontSize: '22px', fontWeight: '900', cursor: 'pointer', boxShadow: '6px 6px 0px #1a1a1a', textTransform: 'uppercase' },
  secondaryBtn: { padding: '18px 24px', borderRadius: '12px', border: '3px solid #1a1a1a', backgroundColor: '#ffffff', color: '#1a1a1a', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px #1a1a1a' },
  startBtn: { width: '100%', padding: '25px', borderRadius: '16px', border: '4px solid #1a1a1a', backgroundColor: '#10b981', color: '#ffffff', fontSize: '24px', fontWeight: '900', cursor: 'pointer', boxShadow: '8px 8px 0px #1a1a1a', marginTop: '30px' },
  doneBtnActive: { width: '100%', padding: '22px', borderRadius: '12px', border: '3px solid #1a1a1a', backgroundColor: '#ccc', color: '#1a1a1a', fontSize: '20px', fontWeight: '900', cursor: 'not-allowed' },
  divider: { margin: '30px 0', color: '#1a1a1a', fontSize: '16px', fontWeight: '900', letterSpacing: '2px' },
  roomBadge: { backgroundColor: '#ffffff', color: '#1a1a1a', padding: '12px 28px', borderRadius: '12px', fontSize: '18px', fontWeight: '900', border: '3px solid #1a1a1a', boxShadow: '4px 4px 0px #1a1a1a', marginBottom: '30px' },
  timerBadge: { backgroundColor: '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: '50px', fontSize: '26px', fontWeight: '900', border: '4px solid #1a1a1a', boxShadow: '4px 4px 0px #1a1a1a', marginBottom: '20px' },
  playerGrid: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px', width: '100%' },
  playerTag: { padding: '12px 20px', background: '#ffffff', color: '#1a1a1a', borderRadius: '12px', fontWeight: '800', fontSize: '18px', border: '3px solid #1a1a1a', boxShadow: '4px 4px 0px #1a1a1a' },
  scenarioCard: { fontSize: '24px', fontWeight: '900', background: '#ffffff', color: '#1a1a1a', padding: '30px', borderRadius: '24px', marginBottom: '35px', width: '100%', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a' },
  form: { width: '100%' },
  ansList: { width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' },
  ansCard: { background: '#ffffff', padding: '25px', borderRadius: '20px', textAlign: 'left', width: '100%', border: '4px solid #1a1a1a', boxShadow: '6px 6px 0px #1a1a1a' },
  jokeText: { fontSize: '22px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 18px 0', wordWrap: 'break-word' },
  replyBubble: { background: '#fef3c7', padding: '18px', borderRadius: '12px', marginTop: '18px', fontSize: '18px', color: '#1a1a1a', border: '3px solid #1a1a1a', marginLeft: '10px' },
  yellowDot: { display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #1a1a1a', marginRight: '8px', verticalAlign: 'middle' },
  voteCountBadge: { background: '#1a1a1a', color: '#fbbf24', padding: '10px 15px', borderRadius: '8px', fontWeight: '900', fontSize: '16px' },
  replyBtn: { background: '#ffffff', border: '3px solid #1a1a1a', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '900', color: '#1a1a1a', boxShadow: '4px 4px 0px #1a1a1a', fontSize: '16px' },
  voteBtn: { background: '#10b981', color: '#ffffff', border: '3px solid #1a1a1a', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: '900', fontSize: '16px', boxShadow: '4px 4px 0px #1a1a1a' },
  winnerCard: { background: '#ffffff', padding: '35px', borderRadius: '24px', width: '100%', margin: '0 0 35px 0', border: '4px solid #1a1a1a', boxShadow: '12px 12px 0px #1a1a1a' },
  phaseTitle: { fontSize: '32px', color: '#1a1a1a', marginBottom: '30px', fontWeight: '900', textTransform: 'uppercase' },
  loadingText: { color: '#1a1a1a', marginTop: '20px', fontWeight: '800', fontSize: '20px' },
  actionBtn: { flex: 2, background: '#3b82f6', color: '#fff', border: '3px solid #1a1a1a', padding: '15px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px #1a1a1a', fontSize: '16px' },
  cancelBtn: { flex: 1, background: '#ffffff', color: '#1a1a1a', border: '3px solid #1a1a1a', padding: '15px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px #1a1a1a', fontSize: '16px' },
  dropdown: { flex: 1, backgroundColor: '#333333', color: '#ffffff', padding: '15px', borderRadius: '8px', border: '3px solid #1a1a1a', fontSize: '16px', fontWeight: 'bold', outline: 'none', cursor: 'pointer' },
  checklistWrapper: { marginTop: '25px', padding: '20px', backgroundColor: '#e5e7eb', borderRadius: '12px', border: '3px dashed #1a1a1a', textAlign: 'left' },
  checklistItem: { fontSize: '16px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' },
  
  receiptBox: { width: '100%', padding: '25px', backgroundColor: '#FFC200', borderRadius: '16px', border: '4px solid #1a1a1a', marginBottom: '30px', textAlign: 'left', boxShadow: '6px 6px 0px #1a1a1a', fontFamily: '"Fredoka One", "Titan One", "Comic Sans MS", sans-serif' },
  receiptTitle: { color: '#1a1a1a', textTransform: 'uppercase', fontWeight: '900', textAlign: 'center', marginBottom: '20px', fontSize: '22px' },
  receiptSectionTitle: { color: '#1a1a1a', fontSize: '18px', fontWeight: '900', borderBottom: '3px solid #1a1a1a', paddingBottom: '5px', marginBottom: '15px', marginTop: '20px' },
  receiptScoreboard: { marginBottom: '20px' },
  receiptCard: { backgroundColor: '#ffffff', border: '3px solid #1a1a1a', borderRadius: '12px', padding: '15px', marginBottom: '15px' },

  translateWrapper: { position: 'absolute', top: '15px', left: '15px', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', padding: '6px 10px', borderRadius: '50px', border: '3px solid #1a1a1a', boxShadow: '2px 2px 0px #1a1a1a' },
  translateSelect: { border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', fontWeight: '900', color: '#1a1a1a', cursor: 'pointer' }
};

export default App;