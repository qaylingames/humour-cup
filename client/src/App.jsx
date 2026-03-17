import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import html2canvas from 'html2canvas'; // NEW IMAGE TOOL

const socket = io('https://humour-cup-server.onrender.com');

const sfxCache = {
  click: new Audio('https://actions.google.com/sounds/v1/ui/button_click.ogg'),
  create: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'),
  join: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg'), 
  vote: new Audio('https://actions.google.com/sounds/v1/magic/magic_chime.ogg'), 
  win: new Audio('https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg'),
  alert: new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg')
};

const BGM_TRACKS = [
  'https://ia903204.us.archive.org/16/items/MonkeysSpinningMonkeys/Monkeys%20Spinning%20Monkeys.mp3',
  'https://ia800305.us.archive.org/30/items/SneakySnitch/Sneaky%20Snitch.mp3',
  'https://ia903107.us.archive.org/15/items/FluffingADuck/Fluffing%20a%20Duck.mp3',
  'https://ia801402.us.archive.org/27/items/TheBuilder_201511/The%20Builder.mp3',
  'https://ia800201.us.archive.org/5/items/MerryGo/Merry%20Go.mp3',
  'https://ia801407.us.archive.org/29/items/QuirkyDog/Quirky%20Dog.mp3'
];

function App() {
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [room, setRoom] = useState(null);
  
  // Public & Secret Scenario States
  const [pubScenario, setPubScenario] = useState('');
  const [pubLang, setPubLang] = useState('English');
  const [pubCategory, setPubCategory] = useState('All Ages');
  const [pubStatus, setPubStatus] = useState(null); 
  const [secretInput, setSecretInput] = useState(''); // NEW: For in-lobby custom typing!
  
  const [showVault, setShowVault] = useState(false);
  const [vaultData, setVaultData] = useState([]);

  // Gameplay State
  const [myAnswer, setMyAnswer] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingToAnsId, setReplyingToAnsId] = useState(null);
  const [seenReplies, setSeenReplies] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);

  const [bgmIndex, setBgmIndex] = useState(() => Math.floor(Math.random() * BGM_TRACKS.length));
  const audioRef = useRef(null);
  const prevPlayersCount = useRef(0);
  const prevGameState = useRef('');
  const prevRoundNumber = useRef(1);

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
      
      prevGameState.current = updatedRoom.state;
      setRoom(updatedRoom);
    });

    socket.on('newReplyAlert', () => playSound('alert', 0.5));
    return () => { socket.off('roomData'); socket.off('newReplyAlert'); };
  }, []);

  useEffect(() => {
    if (room?.state === 'CHAT_PHASE') {
      const interval = setInterval(() => setTimeLeft(Math.max(0, Math.ceil(((room.roundData?.endTime || Date.now()) - Date.now()) / 1000))), 200);
      return () => clearInterval(interval);
    } else if (room?.state === 'INTERMISSION') {
      const interval = setInterval(() => setTimeLeft(Math.max(0, Math.ceil(((room.roundData?.intermissionEndTime || Date.now()) - Date.now()) / 1000))), 200);
      return () => clearInterval(interval);
    }
  }, [room]);

  const handleCreateRoom = () => { playSound('create'); if (!playerName) alert("Enter a name!"); else socket.emit('createRoom', playerName, () => {}); };
  const handleJoinRoom = () => { playSound('click'); if (!playerName || !joinCode) alert("Fill all fields!"); else socket.emit('joinRoom', { roomId: joinCode, playerName }, (res) => !res.success && alert(res.message)); };
  const handleStartGame = () => { playSound('click'); socket.emit('startGame', room.id); };
  
  const handleSettingChange = (key, value) => {
    socket.emit('updateSettings', { roomId: room.id, settings: { [key]: value } });
  };
  
  // NEW: Submitting a secret custom scenario
  const handleSecretSubmit = () => {
    if (!secretInput.trim()) return;
    playSound('vote');
    socket.emit('addSecretScenario', { roomId: room.id, text: secretInput });
    setSecretInput(''); // Clear the box after submitting!
  };

  const handlePublicSubmit = () => {
    if (!pubScenario.trim()) return;
    playSound('click');
    setPubStatus({ type: 'loading', msg: 'AI is running checks...' });
    socket.emit('submitPublicScenario', { text: pubScenario, language: pubLang, category: pubCategory }, (res) => {
      if (res.success) {
        if (res.data.accepted) {
          playSound('vote'); 
          setPubStatus({ type: 'success', msg: `✅ Submitted! ${res.data.reason}` });
          setPubScenario(''); 
          setTimeout(() => setPubStatus(null), 6000); 
        } else {
          playSound('alert'); 
          setPubStatus({ type: 'error', msg: `❌ Rejected: ${res.data.reason}` });
        }
      } else {
        setPubStatus({ type: 'error', msg: `❌ ${res.message}` });
      }
    });
  };

  const openVaultLibrary = () => {
    playSound('click');
    socket.emit('getPublicVault', (data) => {
      setVaultData(data);
      setShowVault(true);
    });
  };

  const handleSubmitAnswer = (e) => { e.preventDefault(); playSound('click'); if (myAnswer) socket.emit('submitAnswer', { roomId: room.id, answerText: myAnswer }); setMyAnswer(''); };
  const handleSendReply = (answerId) => { playSound('click'); if (replyText) socket.emit('submitChatReply', { roomId: room.id, answerId: answerId, text: replyText }); setReplyText(''); setReplyingToAnsId(null); };
  const handleVote = (itemId) => { playSound('vote', 1.0); socket.emit('submitChatVote', { roomId: room.id, itemId: itemId }); };
  const handleDone = () => { playSound('click'); socket.emit('toggleDone', { roomId: room.id }); };
  const handleInitReply = (ansId, prefix = "") => { playSound('click'); setReplyingToAnsId(ansId); setReplyText(prefix); };
  const handlePlayAgain = () => { playSound('click'); socket.emit('playAgain', { roomId: room.id }); };

  const receiptRef = useRef(null);
  const handleSaveReceipt = () => {
    playSound('click');
    if (receiptRef.current) {
      html2canvas(receiptRef.current, { backgroundColor: '#FFC200', scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `HumourCup_Match_${room.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const isHost = room?.players[0]?.id === socket.id;

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
        
        /* NEW HUMOUR RAIN CSS */
        .emoji-rain { position: fixed; top: -50px; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 9999; overflow: hidden; }
        .falling-emoji { position: absolute; font-size: 35px; animation: fall linear forwards; opacity: 0.9; }
        @keyframes fall { to { transform: translateY(110vh) rotate(360deg); } }
      `}</style>

      <audio ref={audioRef} src={BGM_TRACKS[bgmIndex]} loop />

      {/* --- VIEW: HOME SCREEN --- */}
      {!room && !showVault && (
        <div style={styles.container}>
          <h1 style={styles.logo}>🏆 Humour Cup</h1>
          
          <div style={styles.mainCard}>
            <input placeholder="Your Funny Name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} style={styles.input} />
            <button onClick={handleCreateRoom} className="btn-3d" style={styles.primaryBtn}>Create Game</button>
            <div style={styles.divider}>OR JOIN A FRIEND</div>
            <div style={{display:'flex', gap:'10px', width: '100%'}}>
              <input placeholder="CODE" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} style={styles.smallInput} maxLength={4} />
              <button onClick={handleJoinRoom} className="btn-3d" style={styles.secondaryBtn}>Join</button>
            </div>
          </div>

          <div style={{marginTop: '20px', width: '100%'}}>
            <button onClick={openVaultLibrary} className="btn-3d" style={{...styles.secondaryBtn, width: '100%', backgroundColor: '#1a1a1a', color: '#FFC200', borderColor: '#FFC200'}}>
              📚 Browse Public Vault
            </button>
          </div>

          <div style={styles.howToPlayBox}>
            <div style={styles.howToPlayHeader}>👑 Official Rulebook 👑</div>
            <div style={styles.howToPlayContent}>
              <p style={styles.howToPlayText}><span style={styles.bullet}>♦</span> Write your humorous response on each scenario.</p>
              <p style={styles.howToPlayText}><span style={styles.bullet}>♦</span> Reply with your humour punches in the chat round after each scenario.</p>
              <p style={styles.howToPlayText}><span style={styles.bullet}>♦</span> Vote the ones you find humorous.</p>
              <p style={styles.howToPlayText}><span style={styles.bullet}>♦</span> The player with the maximum Humour XP gets the Humour Cup.</p>
            </div>
          </div>

          <div style={{...styles.howToPlayBox, marginTop: '40px', transform: 'rotate(0deg)'}}>
            <div style={{...styles.howToPlayHeader, backgroundColor: '#10b981', color: '#fff'}}>🌍 Submit a Public Scenario 🌍</div>
            <div style={{...styles.howToPlayContent, textAlign: 'center'}}>
              <p style={{fontSize: '14px', fontWeight: 'bold', marginBottom: '15px'}}>Add your own scenario for humour cup. These come randomly to players opting for Public scenarios in the lobby.</p>
              <textarea value={pubScenario} onChange={(e) => setPubScenario(e.target.value)} placeholder="Type your custom scenario here..." style={{...styles.textarea, height: '80px', marginBottom: '10px'}} />
              
              <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                <select value={pubLang} onChange={(e) => setPubLang(e.target.value)} style={styles.dropdown}>
                  <option>English</option><option>Mandarin</option><option>Hindi</option><option>Spanish</option><option>French</option><option>Arabic</option><option>Portuguese</option><option>Russian</option><option>German</option><option>Japanese</option><option>Korean</option><option>Indonesian</option>
                </select>
                <select value={pubCategory} onChange={(e) => setPubCategory(e.target.value)} style={styles.dropdown}>
                  <option>All Ages</option><option>18+</option>
                </select>
              </div>

              <button onClick={handlePublicSubmit} disabled={pubStatus?.type === 'loading'} className="btn-3d" style={{...styles.primaryBtn, padding: '12px', fontSize: '16px'}}>Submit</button>

              {pubStatus && (
                <div style={styles.checklistWrapper}>
                  <div style={styles.checklistItem}>{pubStatus.type === 'loading' ? '⏳' : '✅'} Language & Category Match</div>
                  <div style={styles.checklistItem}>{pubStatus.type === 'loading' ? '⏳' : pubStatus.type === 'success' ? '✅' : '❌'} Simple Words & Grammar</div>
                  <div style={styles.checklistItem}>{pubStatus.type === 'loading' ? '⏳' : pubStatus.type === 'success' ? '✅' : '❌'} Humour Potential Evaluated</div>
                  <div style={{ marginTop: '12px', fontWeight: '900', fontSize: '14px', color: pubStatus.type === 'success' ? '#10b981' : pubStatus.type === 'error' ? '#ef4444' : '#fbbf24' }}>
                    {pubStatus.msg}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW: VAULT LIBRARY --- */}
      {!room && showVault && (
        <div style={{...styles.container, maxWidth: '800px'}}>
          <h1 style={styles.logo}>🏆 Humour Cup</h1>
          <h2 style={styles.phaseTitle}>Public Vault Library</h2>
          <button onClick={() => setShowVault(false)} className="btn-3d" style={{...styles.secondaryBtn, marginBottom: '20px'}}>⬅ Back to Home</button>
          
          <div style={{width: '100%', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center'}}>
             {['All Ages', '18+'].map(cat => (
               <div key={cat} style={{flex: '1 1 300px', backgroundColor: '#fff', border: '4px solid #1a1a1a', borderRadius: '16px', padding: '20px', boxShadow: '8px 8px 0px #1a1a1a'}}>
                 <h2 style={{backgroundColor: '#1a1a1a', color: '#FFC200', padding: '10px', borderRadius: '8px'}}>{cat} Vault</h2>
                 {vaultData.filter(v => v.category === cat).length === 0 ? <p style={{fontWeight: 'bold'}}>No scenarios yet!</p> : 
                   vaultData.filter(v => v.category === cat).map((v, i) => (
                     <div key={i} style={{textAlign: 'left', padding: '10px', borderBottom: '2px dashed #ccc'}}>
                       <span style={{fontSize: '12px', fontWeight: '900', color: '#10b981'}}>[{v.language}]</span>
                       <p style={{margin: '5px 0', fontWeight: 'bold'}}>{v.text}</p>
                     </div>
                   ))
                 }
               </div>
             ))}
          </div>
        </div>
      )}

      {/* --- VIEW: LOBBY --- */}
      {room?.state === 'LOBBY' && (
        <div style={styles.container}>
          <h1 style={styles.logo}>🏆 Humour Cup</h1>
          <h2 style={styles.phaseTitle}>Lobby</h2>
          
          <div style={styles.roomBadge}>ROOM CODE: {room.id}</div>
          
          <div style={{...styles.mainCard, marginBottom: '30px', textAlign: 'left'}}>
             <h3 style={{textTransform: 'uppercase', borderBottom: '3px solid #1a1a1a', paddingBottom: '10px', marginBottom: '15px'}}>⚙️ Game Settings</h3>
             
             <div style={{display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap'}}>
               <div style={{flex: 1}}>
                 <label style={{fontWeight: '900', fontSize: '14px'}}>Category:</label>
                 <select disabled={!isHost} value={room.settings.category} onChange={(e) => handleSettingChange('category', e.target.value)} style={{...styles.dropdown, width: '100%', marginTop: '5px'}}>
                   <option>All Ages</option><option>18+</option>
                 </select>
               </div>
               <div style={{flex: 1}}>
                 <label style={{fontWeight: '900', fontSize: '14px'}}>Scenarios:</label>
                 <select disabled={!isHost} value={room.settings.source} onChange={(e) => handleSettingChange('source', e.target.value)} style={{...styles.dropdown, width: '100%', marginTop: '5px'}}>
                   <option>AI</option><option>Public</option><option>Custom</option>
                 </select>
               </div>
               {room.settings.source === 'Public' && (
                 <div style={{flex: '1 1 100%'}}>
                   <label style={{fontWeight: '900', fontSize: '14px'}}>Public Language:</label>
                   <select disabled={!isHost} value={room.settings.language} onChange={(e) => handleSettingChange('language', e.target.value)} style={{...styles.dropdown, width: '100%', marginTop: '5px'}}>
                      <option>English</option><option>Mandarin</option><option>Hindi</option><option>Spanish</option><option>French</option><option>Arabic</option><option>Portuguese</option><option>Russian</option><option>German</option><option>Japanese</option><option>Korean</option><option>Indonesian</option>
                   </select>
                 </div>
               )}
             </div>

             {/* THE NEW SECRET CUSTOM SCENARIO UI */}
             {room.settings.source === 'Custom' && (
               <div style={{backgroundColor: '#e5e7eb', padding: '15px', borderRadius: '12px', border: '3px dashed #1a1a1a', textAlign: 'center'}}>
                 <h4 style={{marginBottom: '10px', fontWeight: '900'}}>🤫 Secretly Add to the Game Mix!</h4>
                 <input 
                   placeholder={`Write a surprise scenario...`} 
                   value={secretInput} 
                   onChange={(e) => setSecretInput(e.target.value)} 
                   style={{...styles.input, marginBottom: '10px', padding: '10px', fontSize: '14px'}} 
                 />
                 <button onClick={handleSecretSubmit} className="btn-3d" style={{...styles.primaryBtn, fontSize: '14px', padding: '10px'}}>
                   Add to Pool
                 </button>
                 <p style={{marginTop: '10px', fontWeight: 'bold', color: '#10b981'}}>
                   Total Custom Scenarios in Pool: {room.customCount || 0}
                 </p>
               </div>
             )}
          </div>

          <h3 style={{color: '#1a1a1a', fontWeight: '900', marginBottom: '20px'}}>Waiting for the squad...</h3>
          <div style={styles.playerGrid}>
            {room.players.map((p, i) => (
              <div key={i} className="animate-bounce" style={{...styles.playerTag, animationDelay: `${i * 0.2}s`}}>
                🎭 {p.name} {i === 0 && <span style={{opacity: 0.5, fontSize: '14px'}}> (Host)</span>}
              </div>
            ))}
          </div>
          
          {isHost ? (
            room.players.length >= 2 ? <button onClick={handleStartGame} className="btn-3d" style={styles.startBtn}>Launch Game 🚀</button> : <h3 className="animate-bounce" style={{color: '#ef4444', marginTop: '30px', fontWeight: '900', fontSize: '20px'}}>Waiting for at least 1 more player...</h3>
          ) : <h3 className="animate-bounce" style={styles.loadingText}>Waiting for the host to start...</h3>}
        </div>
      )}

      {/* --- VIEW: LAUNCHING --- */}
      {room?.state === 'LAUNCHING' && (
        <div style={styles.container}>
          <h1 style={styles.logo}>🏆 Humour Cup</h1>
          <h2 style={styles.phaseTitle}>Fetching Scenarios...</h2>
          <h1 className="animate-bounce" style={{fontSize:'80px', margin:'20px 0'}}>🚀</h1>
          <div className="loading-container"><div className="loading-fill"></div></div>
        </div>
      )}

      {/* --- VIEW: ANSWER --- */}
      {room?.state === 'ANSWER_PHASE' && (() => {
        const safeAnswers = room.roundData.answers || [];
        const hasSubmitted = safeAnswers.some(a => a.playerId === socket.id);
        const currentRound = room.roundData.roundNumber || 1; 
        return (
          <div style={styles.container}>
            <h1 style={styles.logo}>🏆 Humour Cup</h1>
            <h2 style={styles.phaseTitle}>Scenario {currentRound}</h2>
            <div style={styles.scenarioCard}>"{room.roundData.scenario}"</div>
            {!hasSubmitted ? (
              <form onSubmit={handleSubmitAnswer} style={styles.form}>
                <textarea value={myAnswer} onChange={(e) => setMyAnswer(e.target.value)} placeholder="Type your humour..." style={styles.textarea} />
                <button type="submit" className="btn-3d" style={styles.primaryBtn}>Submit Humour</button>
              </form>
            ) : <h2 className="animate-bounce" style={styles.loadingText}>Waiting for slower humans... ({safeAnswers.length}/{room.players.length})</h2>}
          </div>
        );
      })()}

      {/* --- VIEW: REAL-TIME CHAT & VOTE PHASE --- */}
      {room?.state === 'CHAT_PHASE' && (() => {
        const donePlayers = room.roundData.donePlayers || [];
        const safeAnswers = room.roundData.answers || [];
        const isDone = donePlayers.includes(socket.id);

        return (
          <div style={styles.container}>
            <h1 style={styles.logo}>🏆 Humour Cup</h1>
            <h2 style={styles.phaseTitle}>Chat & Vote Round</h2>
            <div style={styles.timerBadge}>⏳ {timeLeft} Seconds Left</div>
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
                      {ans.playerId !== socket.id && !ansVotes.includes(socket.id) && <button onClick={() => handleVote(ans.id)} className="btn-3d" style={styles.voteBtn}>Humorous!</button>}
                      <button onClick={() => handleInitReply(ans.id)} className="btn-3d" style={styles.replyBtn}>Reply</button>
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
                            {rep.playerId !== socket.id && !repVotes.includes(socket.id) && <button onClick={() => handleVote(rep.id)} className="btn-3d" style={styles.voteBtn}>Humorous!</button>}
                            <button onClick={() => handleInitReply(ans.id, `@${repAuthor} `)} className="btn-3d" style={styles.replyBtn}>Reply</button>
                          </div>
                        </div>
                      );
                    })}
                    {replyingToAnsId === ans.id && (
                      <div style={{marginTop:'15px', display:'flex', flexDirection:'column', gap:'10px'}}>
                        <input value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Reply..." style={styles.input} autoFocus />
                        <div style={{display:'flex', gap:'10px'}}>
                           <button onClick={() => handleSendReply(ans.id)} className="btn-3d" style={styles.actionBtn}>Send</button>
                           <button onClick={() => { playSound('click'); setReplyingToAnsId(null); }} className="btn-3d" style={styles.cancelBtn}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: '30px', paddingBottom: '50px', width: '100%' }}>
              <button onClick={handleDone} disabled={isDone} className="btn-3d" style={isDone ? styles.doneBtnActive : styles.primaryBtn}>{isDone ? `Waiting... (${donePlayers.length}/${room.players.length})` : "I'm Done Reading!"}</button>
            </div>
          </div>
        );
      })()}

      {/* --- VIEW: INTERMISSION --- */}
      {room?.state === 'INTERMISSION' && (() => {
        const sortedPlayers = [...room.players].sort((a,b) => b.score - a.score);
        const nextRound = (room.roundData?.roundNumber || 1) + 1;
        return (
          <div style={styles.container}>
            <h1 style={styles.logo}>🏆 Humour Cup</h1>
            <h2 style={styles.phaseTitle}>Scenario {nextRound} Upcoming</h2>
            <div style={{width: '100%', marginBottom: '40px'}}>
              {sortedPlayers.map((p, i) => (
                <div key={p.id} style={{display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#fff', border: '3px solid #1a1a1a', borderRadius: '12px', marginBottom: '10px', fontWeight: 'bold', boxShadow: '4px 4px 0px #1a1a1a'}}>
                  <span style={{fontSize: '18px'}}>#{i + 1} {p.name}</span>
                  <span style={{fontSize: '18px', color: '#10b981'}}>{p.score} XP</span>
                </div>
              ))}
            </div>
            {timeLeft > 0 ? <h3 style={{color: '#1a1a1a', fontWeight: '900', fontSize: '24px', textTransform: 'uppercase'}}>Entering Round {nextRound} in {timeLeft}...</h3> : <div style={{width: '100%', marginTop: '20px'}}><h3 className="animate-bounce" style={{color: '#1a1a1a', fontWeight: '900', fontSize: '20px', textTransform: 'uppercase'}}>Loading...</h3><div className="loading-container"><div className="loading-fill"></div></div></div>}
          </div>
        );
      })()}

      {/* --- VIEW: RESULTS --- */}
      {room?.state === 'RESULTS' && (() => {
        const sortedPlayers = [...room.players].sort((a,b) => b.score - a.score);
        const highestScore = sortedPlayers[0].score;
        const winners = sortedPlayers.filter(p => p.score === highestScore);
        const isTie = winners.length > 1;

        // Custom Humour Rain Arrays
        const rainEmojis = ['😂', '🤣', '💀', '🏆', '🔥'];

        return (
          <div style={styles.container}>
            {/* THE HUMOUR RAIN ANIMATION */}
            <div className="emoji-rain">
              {Array.from({ length: 50 }).map((_, i) => (
                <span key={i} className="falling-emoji" style={{
                  left: `${Math.random() * 100}vw`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}>
                  {rainEmojis[Math.floor(Math.random() * rainEmojis.length)]}
                </span>
              ))}
            </div>

            <h1 style={styles.logo}>🏆 Humour Cup</h1>
            <h2 style={styles.phaseTitle}>Final Results</h2>
            
            <h3 style={{color: '#1a1a1a', textTransform: 'uppercase', fontWeight: '900', marginTop: '10px', marginBottom: '10px', fontSize: '24px'}}>{isTie ? 'Winners' : 'Winner'}</h3>
            <div style={styles.winnerCard}>
              {winners.map(w => <h1 key={w.id} style={{margin:'0 0 5px 0', color: '#1a1a1a', fontSize: '42px'}}>{w.name}</h1>)}
              <h3 style={{margin:'15px 0 0 0', color: '#1a1a1a', opacity: 0.8}}>{highestScore} XP</h3>
            </div>

            {/* THE EXPORTABLE MATCH RECEIPT */}
            <div ref={receiptRef} style={{width: '100%', padding: '20px', backgroundColor: '#FFC200', borderRadius: '16px', border: '4px solid #1a1a1a', marginBottom: '30px', textAlign: 'left'}}>
              <h3 style={{color: '#1a1a1a', textTransform: 'uppercase', fontWeight: '900', textAlign: 'center', marginBottom: '20px'}}>📜 Match Receipt</h3>
              
              <h4 style={{fontWeight: '900', borderBottom: '2px solid #1a1a1a', paddingBottom: '5px', marginBottom: '10px'}}>Final Scoreboard</h4>
              {sortedPlayers.map((p, i) => (
                <div key={p.id} style={{display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px'}}>
                  <span>#{i + 1} {p.name}</span><span>{p.score} XP</span>
                </div>
              ))}

              <h4 style={{fontWeight: '900', borderBottom: '2px solid #1a1a1a', paddingBottom: '5px', marginTop: '20px', marginBottom: '10px'}}>The Scenarios</h4>
              {room.history && room.history.map((round, i) => (
                <div key={i} style={{marginBottom: '15px', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '2px solid #1a1a1a'}}>
                  <p style={{fontWeight: '900', fontSize: '14px', marginBottom: '8px'}}>Round {round.roundNumber}: "{round.scenario}"</p>
                  {round.answers.map(ans => {
                    const author = room.players.find(p => p.id === ans.playerId)?.name || "Unknown";
                    return (
                      <div key={ans.id} style={{marginLeft: '10px', marginBottom: '5px'}}>
                        <p style={{fontSize: '12px', color: '#666', margin: '0'}}><b>{author}:</b> "{ans.text}" (⭐ {ans.votes.length})</p>
                        {ans.replies.map(rep => {
                          const repAuthor = room.players.find(p => p.id === rep.playerId)?.name || "Unknown";
                          return <p key={rep.id} style={{fontSize: '11px', color: '#888', margin: '0 0 0 15px'}}>↳ <b>{repAuthor}:</b> {rep.text}</p>
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            <button onClick={handleSaveReceipt} className="btn-3d" style={{...styles.secondaryBtn, width: '100%', marginBottom: '20px', backgroundColor: '#10b981', color: '#fff'}}>📸 Save Match as Image</button>

            {isHost ? <button onClick={handlePlayAgain} className="btn-3d" style={styles.primaryBtn}>Play Again (Host)</button> : <h3 className="animate-bounce" style={{color: '#1a1a1a', fontWeight: '900', fontSize: '20px'}}>Waiting for Host to Restart...</h3>}
          </div>
        );
      })()}
    </div>
  );
}

const styles = {
  appWrapper: { minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', padding: '20px', position: 'relative', backgroundColor: '#FFC200' }, 
  howToPlayBox: { marginTop: '40px', width: '100%', backgroundColor: '#ffffff', border: '4px solid #1a1a1a', borderRadius: '16px', boxShadow: '6px 6px 0px #1a1a1a', overflow: 'hidden', transform: 'rotate(-1.5deg)' },
  howToPlayHeader: { backgroundColor: '#1a1a1a', color: '#FFC200', padding: '12px', fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' },
  howToPlayContent: { padding: '20px', textAlign: 'left' },
  howToPlayText: { fontSize: '14px', color: '#1a1a1a', marginBottom: '12px', fontWeight: '800', lineHeight: '1.5', display: 'flex', alignItems: 'flex-start', gap: '8px' },
  bullet: { color: '#10b981', fontSize: '16px' }, 
  container: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '40px', paddingBottom: '60px' },
  logo: { fontSize: '48px', color: '#1a1a1a', marginBottom: '30px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-1px' },
  mainCard: { background: '#ffffff', padding: '30px', borderRadius: '24px', width: '100%', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a' },
  input: { backgroundColor: '#333333', color: '#ffffff', width: '100%', padding: '16px', borderRadius: '12px', border: '3px solid #1a1a1a', fontSize: '18px', marginBottom: '20px', fontWeight: 'bold', outline: 'none' },
  smallInput: { backgroundColor: '#333333', color: '#ffffff', flex: 1, padding: '16px', borderRadius: '12px', border: '3px solid #1a1a1a', fontSize: '18px', fontWeight: 'bold', outline: 'none', textTransform: 'uppercase', minWidth: 0 },
  textarea: { backgroundColor: '#333333', color: '#ffffff', width: '100%', height: '120px', padding: '15px', borderRadius: '16px', border: '3px solid #1a1a1a', fontSize: '18px', marginBottom: '20px', fontWeight: 'bold', outline: 'none', resize: 'none' },
  primaryBtn: { width: '100%', padding: '18px', borderRadius: '12px', border: '3px solid #1a1a1a', backgroundColor: '#ffffff', color: '#1a1a1a', fontSize: '20px', fontWeight: '900', cursor: 'pointer', boxShadow: '6px 6px 0px #1a1a1a', textTransform: 'uppercase' },
  secondaryBtn: { padding: '15px 20px', borderRadius: '12px', border: '3px solid #1a1a1a', backgroundColor: '#ffffff', color: '#1a1a1a', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px #1a1a1a' },
  startBtn: { width: '100%', padding: '20px', borderRadius: '16px', border: '4px solid #1a1a1a', backgroundColor: '#10b981', color: '#ffffff', fontSize: '22px', fontWeight: '900', cursor: 'pointer', boxShadow: '8px 8px 0px #1a1a1a', marginTop: '30px' },
  doneBtnActive: { width: '100%', padding: '18px', borderRadius: '12px', border: '3px solid #1a1a1a', backgroundColor: '#ccc', color: '#1a1a1a', fontSize: '18px', fontWeight: '900', cursor: 'not-allowed' },
  divider: { margin: '25px 0', color: '#1a1a1a', fontSize: '14px', fontWeight: '900', letterSpacing: '2px' },
  roomBadge: { backgroundColor: '#ffffff', color: '#1a1a1a', padding: '10px 24px', borderRadius: '12px', fontSize: '16px', fontWeight: '900', border: '3px solid #1a1a1a', boxShadow: '4px 4px 0px #1a1a1a', marginBottom: '30px' },
  timerBadge: { backgroundColor: '#ef4444', color: '#fff', padding: '10px 20px', borderRadius: '50px', fontSize: '24px', fontWeight: '900', border: '4px solid #1a1a1a', boxShadow: '4px 4px 0px #1a1a1a', marginBottom: '20px' },
  playerGrid: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px', width: '100%' },
  playerTag: { padding: '10px 18px', background: '#ffffff', color: '#1a1a1a', borderRadius: '12px', fontWeight: '800', fontSize: '16px', border: '3px solid #1a1a1a', boxShadow: '4px 4px 0px #1a1a1a' },
  scenarioCard: { fontSize: '22px', fontWeight: '900', background: '#ffffff', color: '#1a1a1a', padding: '25px', borderRadius: '24px', marginBottom: '30px', width: '100%', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a' },
  form: { width: '100%' },
  ansList: { width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' },
  ansCard: { background: '#ffffff', padding: '20px', borderRadius: '20px', textAlign: 'left', width: '100%', border: '4px solid #1a1a1a', boxShadow: '6px 6px 0px #1a1a1a' },
  jokeText: { fontSize: '20px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 15px 0', wordWrap: 'break-word' },
  replyBubble: { background: '#fef3c7', padding: '15px', borderRadius: '12px', marginTop: '15px', fontSize: '16px', color: '#1a1a1a', border: '3px solid #1a1a1a', marginLeft: '10px' },
  yellowDot: { display: 'inline-block', width: '10px', height: '10px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #1a1a1a', marginRight: '8px', verticalAlign: 'middle' },
  voteCountBadge: { background: '#1a1a1a', color: '#fbbf24', padding: '8px 12px', borderRadius: '8px', fontWeight: '900', fontSize: '14px' },
  replyBtn: { background: '#ffffff', border: '3px solid #1a1a1a', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '900', color: '#1a1a1a', boxShadow: '4px 4px 0px #1a1a1a', fontSize: '14px' },
  voteBtn: { background: '#10b981', color: '#ffffff', border: '3px solid #1a1a1a', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '900', fontSize: '14px', boxShadow: '4px 4px 0px #1a1a1a' },
  winnerCard: { background: '#ffffff', padding: '30px', borderRadius: '24px', width: '100%', margin: '0 0 30px 0', border: '4px solid #1a1a1a', boxShadow: '12px 12px 0px #1a1a1a' },
  phaseTitle: { fontSize: '28px', color: '#1a1a1a', marginBottom: '25px', fontWeight: '900', textTransform: 'uppercase' },
  loadingText: { color: '#1a1a1a', marginTop: '20px', fontWeight: '800', fontSize: '18px' },
  actionBtn: { flex: 2, background: '#3b82f6', color: '#fff', border: '3px solid #1a1a1a', padding: '12px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px #1a1a1a', fontSize: '14px' },
  cancelBtn: { flex: 1, background: '#ffffff', color: '#1a1a1a', border: '3px solid #1a1a1a', padding: '12px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px #1a1a1a', fontSize: '14px' },
  dropdown: { flex: 1, backgroundColor: '#333333', color: '#ffffff', padding: '12px', borderRadius: '8px', border: '3px solid #1a1a1a', fontSize: '14px', fontWeight: 'bold', outline: 'none', cursor: 'pointer' },
  checklistWrapper: { marginTop: '20px', padding: '15px', backgroundColor: '#e5e7eb', borderRadius: '12px', border: '3px dashed #1a1a1a', textAlign: 'left' },
  checklistItem: { fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }
};

export default App;