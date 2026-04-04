import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://humour-cup-server.onrender.com');

const uiTranslations = {
  'English': { 
    name: "Your Funny Name", create: "Create Room", createGold: "Create GOLD Room!", orJoin: "OR JOIN A FRIEND", code: "CODE", join: "Join", rulebook: "👑 How to Play 👑", rule1: "Write your humorous response on each scenario.", rule2: "Reply with your humour punches in the chat round after each scenario.", rule3: "Vote the ones you find humorous.", rule4: "The player with the maximum Humour XP gets the Humour Cup.", 
    submitPub: "🌍 Submit your humorous Scenarios for Humour Cup players 🌍", pubDesc: "These come randomly to Humour Cup players opting for Public scenarios in the Lobby.", pubPlace: "Type your custom scenario here...", submit: "Submit", lobby: "Lobby", roomCode: "ROOM CODE:", cat: "Category:", scen: "Scenarios:", lang: "Language:", secret: "🤫 Secretly Add to the Game Mix!", secPlace: "Write a surprise scenario...", addPool: "Add to Pool", totPool: "Total Custom Scenarios in Pool:", addCustomAlso: "Add your custom humorous scenarios to the Public scenario box below as well, if suitable.", waitSquad: "Waiting for the squad...", host: "(Host)", launch: "Launch Game 🚀", waitMore: "Waiting for at least 1 more player...", waitHost: "Waiting for the host to start...", fetch: "Fetching Scenarios...", scenTitle: "Scenario", secLeft: "Seconds Left", typeHumour: "Type your humour...", subHumour: "Submit Humour", waitSlow: "Waiting for slower humans...", chatVote: "Chat & Vote Round", humourBtn: "Humorous!", replyBtn: "Reply", repPlace: "Reply...", send: "Send", cancel: "Cancel", done: "I'm Done Reading!", waiting: "Waiting...", upcoming: "Upcoming", enterRound: "Entering Round-", in: "in", seconds: "seconds", load: "Loading...", results: "Final Results", winners: "Winners", winner: "Winner", scoreboard: "Final Scoreboard", receipt: "🧾 MATCH RECEIPT", thanks: "Thanks for playing Humour Cup! 🏆", saveRec: "📸 Save this Match Receipt", playAgain: "Play Again (Host)", waitRes: "Waiting for Host to Restart...", adminVault: "Admin Vault View", backHome: "⬅ Back to Home", noScen: "No scenarios yet!", madeBy: "⚡made by ", toSpark: " to spark your humour⚡", privacy: "Privacy Policy", terms: "Terms of Service", contact: "Contact Us",
    donateBtn: "🥺 Support me to grow Humour Cup 🥺", 
    donateText: "This indie developer needs to handle server, moderations and maintenance. Donations keep Humour Cup and my ideaz - alive.💙", 
    feedbackText: "How the heck should I make this game more fun? Tell me everything at", chatInst: "Tap 'Humorous' to the funny responses of each other.", whatIsHC: "🤔 What is Humour Cup?",
    donateClarify: "Buy Humour Cup GOLD for some extra perks. Or please support me by donating here. 🙏🏻", customAmt: "Enter amount", emailPlace: "Enter your email address...", payRazor: "Pay via Razorpay", payPaddle: "Pay via Paddle (Global)", payUpi: "Pay via UPI ID (India)",
    goldTitle: "🏆 Humour Cup GOLD", goldSub: "More than 1 Room cannot be created from the same Fun Key at the same time.",
    gPerk1: "Unlimited Players (Beyond the 7 player cap!)", gPerk2: "Custom Number of Rounds & Timers", gPerk3: "More Humorous A.I. Scenarios", gPerk4: "Prioritized Best Selected A.I. and Public Scenarios", gPerk5: "Change scenarios while playing", gPerk6: "100% Ad-Free Experience", gPerk7: "Official Supporter of Humour Cup 💙",
    gInput: "Already have a key? Enter it here...", gInstruction: "Buy GOLD to get your Fun Key emailed instantly!", gActive: "Fun Key activated. Create a GOLD Room now.",
    ab1: "Welcome to Humour Cup, the ultimate real-time multiplayer humour competition game where your wit wins the crown! Whether you are hanging out with your boring friends at a party, taking a break with your fake co-workers, or just looking for some great fun online activity like OnlyFans but text version lol - Humour Cup is just right for that endless entertainment. 😼",
    ab2: "How to really play this shi*?:",
    ab3: "You input your sharp wits and the others vote if they find it humorous. You battle with your humorous comments after each scenario with others. The most humorous one wins the so called - Humour Cup.🏆 You can also save the game you played with everyone at the end, for collecting memories.",
    ab4: "To elaborate the gameplay more: You respond to the scenarios in each round with your wit IQ.🧠 And after every Scenario, you vote for the most humorous responses and battle through your humourous comments in a Chat and Vote Phase for earning Humour XPs through others' votes.⚔️ The one at the top of the scoreboard wins the Humour Cup at the end.🏆🥇",
    ab5: "Step by step explaination: The host creates a secure room and shares a unique 4-digit code which you can give your friends to join with crazy names so that no one knows who's who - total anonymity.😈 Once everyone joins the lobby after creating the room, they can select how they want to play through different options given, and there are plenty enough of them to spoil you. The server works as the options selected by the Host (the one who created the Room).",
    ab6: "If you select A.I., then the humorous scenarios will be randomly generated by the A.I. ranging from absurd hypothetical questions and daily life awkwardness to weird text messages and meme-worthy situations.🤖",
    ab7: "If you select Public, then the humorous scenarios will be randomly generated from the scenarios entered by the players globally in the 'Submit your humorous Scenarios for Humour Cup players' box. You go enter some of your funny scenarios there. Now!😠",
    ab8: "The Custom option is the most hilarious one. They give you all present in the lobby - the freedom of entering your own scenarios for your game (anonymously🤫).",
    ab9: "Beware, the game is simple but highly addictive. Don't complain later that I didn't warn you when you would have Text Neck Syndrome. You would search that, right?😏", 
    ab10: "Why is Humour Cup lit?❤️‍🔥 :",
    ab11: "Dynamic AI Scenarios: Powered by advanced AI, you will never feel playing the exact same game twice.",
    ab12: "Submit your Scenarios for Humour Cup players: Have a good-humour curse? Can make a funny scenario for players to play Humour Cup? Have an inside joke? - Then add your own scenarios to the 'Submit your humorous Scenarios for Humour Cup players' box.",
    ab13: "Create your own Scenarios in Humour Cup: In the Custom option of Lobby, you all can write any scenarios anonymously for others to respond on it while playing Humour Cup.",
    ab14: "Global Languages: Play in some of the hottest languages around the world like English, Hindi, Spanish, French, Mandarin, and more!",
    ab15: "Family Friendly or 18+: Choose the category that fits your squad's vibe. You are free to play however you want and free to write whatever you want.",
    ab16: "Test your humour today. Find out your humour rank amongst your friends. Create a room, share the code with your friends, and let the humour battle begin!"
  },
  // Note: Only English object modified above to keep the code short for you, 
  // but you can replace the rest of the languages array exactly from your original code here!
};

const sfxCache = {
  click: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg'), 
  create: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg'),
  join: new Audio('https://actions.google.com/sounds/v1/cartoon/pop.ogg'), 
  vote: new Audio('https://actions.google.com/sounds/v1/cartoon/cartoon_cowbell.ogg'), 
  win: new Audio('https://actions.google.com/sounds/v1/crowds/crowd_cheer.ogg'),
  alert: new Audio('https://actions.google.com/sounds/v1/water/water_drop.ogg'),
  tick: new Audio('https://actions.google.com/sounds/v1/tools/ratchet_wrench.ogg') 
};

const BGM_TRACKS = [
  'https://ia903204.us.archive.org/16/items/MonkeysSpinningMonkeys/Monkeys%20Spinning%20Monkeys.mp3',
  'https://ia800305.us.archive.org/30/items/SneakySnitch/Sneaky%20Snitch.mp3',
  'https://ia903107.us.archive.org/15/items/FluffingADuck/Fluffing%20a%20Duck.mp3',
  'https://ia801402.us.archive.org/27/items/TheBuilder_201511/The%20Builder.mp3',
  'https://ia800201.us.archive.org/5/items/MerryGo/Merry%20Go.mp3'
];

const doodleBgSvg = "data:image/svg+xml;charset=utf-8,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%231a1a1a' stroke-width='4' fill='none' stroke-linecap='round' stroke-linejoin='round' opacity='0.08'%3E%3Cpath d='M40,40 Q60,20 80,50 T120,40'/%3E%3Ccircle cx='200' cy='60' r='8'/%3E%3Cpath d='M250,220 L265,190 L280,220 Z'/%3E%3Cpath d='M50,250 C70,220 100,280 120,240'/%3E%3Cpath d='M150,150 L165,165 L150,180'/%3E%3Cpath d='M270,100 L290,90 L280,110'/%3E%3Ccircle cx='80' cy='150' r='4' fill='%231a1a1a'/%3E%3Cpath d='M20,180 Q30,190 20,200'/%3E%3Cpath d='M320,320 L340,340 M340,320 L320,340'/%3E%3Cpath d='M350,150 Q370,130 380,160 T350,190'/%3E%3Ccircle cx='300' cy='280' r='12' stroke-dasharray='4 4'/%3E%3Cpath d='M100,350 L110,320 L130,340'/%3E%3Cpath d='M180,300 Q200,320 220,300'/%3E%3Ccircle cx='50' cy='320' r='3' fill='%231a1a1a'/%3E%3C/g%3E%3C/svg%3E";

const formatNum = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num;
};

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
  
  const [logoClicks, setLogoClicks] = useState(0); 

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [seedingStats, setSeedingStats] = useState({});
  const [adminPublicScenarios, setAdminPublicScenarios] = useState([]);
  const [adminKey, setAdminKey] = useState('');
  
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPwdInput, setAdminPwdInput] = useState('');

  const [myAnswer, setMyAnswer] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyingToAnsId, setReplyingToAnsId] = useState(null);
  const [seenReplies, setSeenReplies] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);

  const [isAboutOpen, setIsAboutOpen] = useState(false); 
  const [showUpiModal, setShowUpiModal] = useState(false); 
  
  const [showDonateModal, setShowDonateModal] = useState(false); 
  const [donateEmail, setDonateEmail] = useState('');
  const [donateAmount, setDonateAmount] = useState('');
  
  const [showGoldModal, setShowGoldModal] = useState(false);
  const [goldKeyInput, setGoldKeyInput] = useState('');
  const [goldEmail, setGoldEmail] = useState('');
  const [activeGoldKey, setActiveGoldKey] = useState(null);

  const [bgmIndex, setBgmIndex] = useState(() => Math.floor(Math.random() * BGM_TRACKS.length));
  const audioRef = useRef(null);
  const receiptRef = useRef(null);
  const prevPlayersCount = useRef(0);
  const prevGameState = useRef('');
  const prevRoundNumber = useRef(1);

  const t = (key) => uiTranslations[appLang]?.[key] || uiTranslations['English'][key] || key;

  const [pubCooldown, setPubCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (pubCooldown > 0) {
      timer = setInterval(() => {
        setPubCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pubCooldown]);
  
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
    
    socket.on('kickedFromRoom', () => {
      alert("You were kicked from the lobby by the host.");
      setRoom(null);
    });

    return () => { socket.off('roomData'); socket.off('newReplyAlert'); socket.off('kickedFromRoom'); };
  }, [appLang]);

  useEffect(() => {
    if (room?.state === 'RESULTS') { window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }, [room?.state]);

  useEffect(() => {
    if (room?.state === 'CHAT_PHASE' || room?.state === 'ANSWER_PHASE') {
      const interval = setInterval(() => setTimeLeft(Math.max(0, Math.ceil(((room.roundData?.endTime || Date.now()) - Date.now()) / 1000))), 200);
      return () => clearInterval(interval);
    } else if (room?.state === 'INTERMISSION') {
      const interval = setInterval(() => setTimeLeft(Math.max(0, Math.ceil(((room.roundData?.intermissionEndTime || Date.now()) - Date.now()) / 1000))), 200);
      return () => clearInterval(interval);
    }
  }, [room]);

  useEffect(() => {
    if ((room?.state === 'ANSWER_PHASE' || room?.state === 'CHAT_PHASE') && timeLeft > 0 && timeLeft <= 20) {
      playSound('tick', 0.6);
    }
  }, [timeLeft, room?.state]);

  const refreshStats = (keyToUse = adminKey) => { 
    socket.emit('getSeedingStats', keyToUse, (data) => setSeedingStats(data)); 
    socket.emit('getAdminPublicScenarios', keyToUse, (data) => setAdminPublicScenarios(data));
  };

  const handleBuyGold = (method) => {
    if(!goldEmail.includes('@')) return alert("Please enter a valid email first!");
    playSound('click');
    alert(`Initiating ${method.toUpperCase()} checkout...\nItem: Humour Cup GOLD\nPrice: ₹499 / $5.99\nEmail: ${goldEmail}\n\n(This will trigger the real API once connected)`);
  };

  const handleDonate = (method) => {
    if(!donateEmail.includes('@')) return alert("Please enter a valid email first!");
    if(!donateAmount || isNaN(donateAmount) || donateAmount < 1) return alert("Please enter a valid amount!");
    playSound('click');
    alert(`Initiating ${method.toUpperCase()} checkout...\nItem: Custom Support Donation\nAmount: ${donateAmount}\nEmail: ${donateEmail}\n\n(This will trigger the real API once connected)`);
  };

  const handleActivateGold = () => {
      if(goldKeyInput.trim() !== '') {
          playSound('win');
          setActiveGoldKey(goldKeyInput.trim());
          setTimeout(() => setShowGoldModal(false), 1500);
      }
  };

  const handleCreateRoom = () => { 
      playSound('create'); 
      if (!playerName) return alert("Please enter your funny name!"); 
      
      socket.emit('createRoom', { playerName, language: appLang, funKey: activeGoldKey }, (res) => {
          if (!res.success) {
              alert(res.message);
              if(res.message.includes('already in use')) {
                  setActiveGoldKey(null);
              }
          }
      }); 
  };
  const handleJoinRoom = () => { playSound('click'); if (!playerName) return alert("Please enter your funny name!"); if (!joinCode) return alert("Please enter a room code!"); socket.emit('joinRoom', { roomId: joinCode, playerName }, (res) => !res.success && alert(res.message)); };
  const handleStartGame = () => { playSound('click'); socket.emit('startGame', room.id); };
  const handleSettingChange = (key, value) => { socket.emit('updateSettings', { roomId: room.id, settings: { [key]: value } }); };
  const handleSecretSubmit = () => { if (!secretInput.trim()) return; playSound('vote'); socket.emit('addSecretScenario', { roomId: room.id, text: secretInput }); setSecretInput(''); };

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    
    if (newCount >= 5) {
      setLogoClicks(0);
      setShowAdminLogin(true);
    }
  };

  const submitAdminLogin = () => {
    socket.emit('verifyAdmin', adminPwdInput, (res) => {
      if (res.success) {
        playSound('win');
        setAdminKey(adminPwdInput);
        setIsAdminMode(true);
        setShowAdminLogin(false);
        setAdminPwdInput('');
        refreshStats(adminPwdInput);
      } else {
        playSound('alert');
        alert("Access Denied: Incorrect Passcode");
        setAdminPwdInput('');
      }
    });
  };

  const handlePublicSubmit = () => {
    if (!pubScenario.trim() || pubCooldown > 0) return; 
    playSound('click');
    setPubStatus({ type: 'loading', msg: '⏳' });
    
    socket.emit('submitPublicScenario', { text: pubScenario, language: pubLang, category: pubCategory }, (res) => {
      if (res.success) {
        playSound('vote'); 
        setPubStatus({ type: 'success', msg: `✅ ${res.data.reason || 'Submitted!'}` });
        setPubScenario(''); 
        setPubCooldown(10); 
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

  const renderSubmitScenarioBox = () => (
    <div style={{...styles.howToPlayBox, marginTop: '40px', transform: 'rotate(0deg)'}}>
      <div style={{
        ...styles.howToPlayHeader, 
        backgroundColor: '#ff9900', 
        color: '#ffffff', 
        fontSize: '26px', 
        fontWeight: '900',
        fontFamily: '"Bangers", cursive', 
        textTransform: 'none', 
        letterSpacing: '1px',
        lineHeight: '1.2', 
        padding: '15px 20px',
        textShadow: '3px 3px 0px #1a1a1a, -1px -1px 0px #1a1a1a, 1px -1px 0px #1a1a1a, -1px 1px 0px #1a1a1a', 
      }}>
        {t('submitPub')}
      </div>
      <div style={{...styles.howToPlayContent, textAlign: 'center'}}>
        <p style={{fontSize: '14px', fontWeight: 'bold', margin: '0 0 15px 0'}}>{t('pubDesc')}</p>
        <textarea id="pubScenarioInput" name="pubScenario" value={pubScenario} onChange={(e) => setPubScenario(e.target.value)} placeholder={t('pubPlace')} style={{...styles.textarea, height: '120px', marginBottom: '10px'}} />
        
        <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
          <select id="pubLangSelect" name="pubLang" value={pubLang} onChange={(e) => setPubLang(e.target.value)} style={styles.dropdown}>
            <option value="English">English</option><option value="Mandarin">Mandarin</option><option value="Hindi">Hindi</option><option value="Spanish">Spanish</option><option value="French">French</option><option value="Arabic">Arabic</option><option value="Portuguese">Portuguese</option><option value="Russian">Russian</option><option value="German">German</option><option value="Japanese">Japanese</option><option value="Korean">Korean</option><option value="Indonesian">Indonesian</option>
          </select>
          <select id="pubCatSelect" name="pubCat" value={pubCategory} onChange={(e) => setPubCategory(e.target.value)} style={styles.dropdown}>
            <option value="All Ages">All Ages</option><option value="18+">18+</option>
          </select>
        </div>

        <button 
          onClick={handlePublicSubmit} 
          disabled={pubStatus?.type === 'loading' || pubCooldown > 0} 
          className="btn-3d" 
          style={{
            ...styles.primaryBtn, 
            padding: '18px', 
            fontSize: '16px',
            backgroundColor: pubCooldown > 0 ? '#ccc' : '#10b981', 
            color: pubCooldown > 0 ? '#1a1a1a' : '#ffffff',
            cursor: pubCooldown > 0 ? 'not-allowed' : 'pointer'
          }}>
          {pubCooldown > 0 ? `Wait ${pubCooldown}s` : t('submit')}
        </button>

        {pubCooldown > 0 && (
          <p style={{ marginTop: '12px', color: '#ef4444', fontWeight: '900', fontSize: '14px' }}>
            You can submit another scenario in {pubCooldown} seconds.
          </p>
        )}

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
  );

  const renderSupportCards = () => (
    <>
      {/* The Updated Indie Dev Support Box */}
      <div style={{
        ...styles.devCardGreen, 
        backgroundColor: '#10b981', /* Match Submit Button green */
        border: '5px solid #1a1a1a',
        boxShadow: '10px 10px 0px #1a1a1a',
        transform: 'rotate(0deg)', 
        marginTop: '30px'
      }}>
        
        <p style={{
          ...styles.indieDevText, 
          color: '#ffffff', 
          backgroundColor: 'transparent',
          border: 'none', 
          padding: '5px',
          fontSize: '18px',
          textAlign: 'center',
          textShadow: '1px 1px 0px rgba(0,0,0,0.3)',
          margin: '0 0 15px 0'
        }}>
          {t('donateText')}
        </p>

        <button onClick={() => setShowDonateModal(true)} className="btn-3d" style={{
          ...styles.donateBtn, 
          background: '#6b4c3a', /* Brown coffee color */
          color: '#ffffff', 
          marginTop: '0', 
          padding: '12px 24px', 
          display: 'flex',          
          justifyContent: 'center',
          alignItems: 'center',      
          width: '90%',
          borderRadius: '50px',
          border: '4px solid #1a1a1a',
          boxShadow: '0px 6px 0px #1a1a1a'
        }}>
          <span style={{ 
            fontFamily: "'Fredoka One', cursive", 
            letterSpacing: '1px', 
            textAlign: 'center', 
            lineHeight: '1.2', 
            fontSize: 'clamp(16px, 5vw, 22px)' 
          }}>
            Support me to grow<br/>Humour Cup
          </span>
        </button>

      </div>

      {/* The Feedback Oval Box */}
      <div style={{...styles.devCardOval, marginTop: '35px'}}>
         <p style={styles.feedbackText}>{t('feedbackText')}</p>
         <a href="mailto:qaylingames@gmail.com" className="btn-3d" style={styles.emailLink}>qaylingames@gmail.com 💌</a>
      </div>
    </>
  );

  const isHost = room?.players[0]?.id === socket.id;
  const rainEmojis = ['😂', '🤣', '💀', '🏆', '🔥', '🌶️', '👽', '🦄', '🍻', '😆', '😁', '🫠', '😭', '🤟'];

  return (
    <div onClick={unlockAudio} style={styles.appWrapper}>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');

        /* --- GLOBAL LAYOUT LOCKS --- */
        * { box-sizing: border-box; } 
        html, body { overflow-x: hidden; margin: 0; padding: 0; width: 100%; }

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
        @keyframes unified-wobble-breathe { 0%, 100% { transform: scale(1) rotate(0deg); } 25% { transform: scale(1.03) rotate(-3deg); } 50% { transform: scale(1) rotate(2deg); } 75% { transform: scale(1.03) rotate(-1deg); } }
        .animated-logo-main { animation: unified-wobble-breathe 5s infinite ease-in-out; max-width: 100%; width: 450px; height: auto; cursor: pointer; user-select: none; margin-bottom: 20px; margin-top: 30px; }

        @keyframes popIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .custom-scroll::-webkit-scrollbar { width: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: #fef3c7; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #ff9900; border-radius: 10px; border: 2px solid #1a1a1a; }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        @keyframes backgroundDrift { 
          from { background-position: 0 0; } 
          to { background-position: -300px 300px; } 
        }
        .doodle-bg {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background-image: url("${doodleBgSvg}");
          background-size: 300px 300px;
          animation: backgroundDrift 20s linear infinite;
          pointer-events: none; 
          z-index: 0; 
        }

      `}</style>

      {/* --- THE ADMIN LOGIN MODAL --- */}
      {showAdminLogin && (
        <div id="admin-backdrop" onClick={(e) => { if(e.target.id === 'admin-backdrop') setShowAdminLogin(false); }} style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFC200', padding: '30px', borderRadius: '24px', border: '5px solid #1a1a1a', 
            boxShadow: '10px 10px 0px #1a1a1a', maxWidth: '400px', width: '100%', textAlign: 'center', animation: 'popIn 0.3s ease-out'
          }}>
            <h2 style={{...styles.phaseTitle, fontSize: '28px', marginBottom: '20px', color: '#1a1a1a', textShadow: 'none', transform: 'rotate(0deg)'}}>🔐 Admin Vault</h2>
            
            <input type="password" id="adminPwd" placeholder="Enter Passcode..." value={adminPwdInput} onChange={(e) => setAdminPwdInput(e.target.value)} style={{...styles.input, marginBottom: '20px', textAlign: 'center', letterSpacing: '5px'}} />
            
            <div style={{display: 'flex', gap: '10px'}}>
               <button onClick={submitAdminLogin} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: '#10b981', color: '#fff', flex: 1, padding: '15px', fontSize: '16px'}}>ENTER</button>
               <button onClick={() => setShowAdminLogin(false)} className="btn-3d" style={{...styles.secondaryBtn, flex: 1, padding: '15px', fontSize: '16px'}}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* --- THE UPI POPUP MODAL --- */}
      {showUpiModal && (
        <div id="upi-backdrop" onClick={(e) => { if(e.target.id === 'upi-backdrop') setShowUpiModal(false); }} style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFC200', padding: '30px', borderRadius: '24px', border: '5px solid #1a1a1a', 
            boxShadow: '10px 10px 0px #1a1a1a', maxWidth: '400px', width: '100%', textAlign: 'center', animation: 'popIn 0.3s ease-out'
          }}>
            <h2 style={{...styles.phaseTitle, fontSize: '28px', marginBottom: '10px', color: '#1a1a1a', textShadow: 'none', transform: 'rotate(0deg)'}}>☕ Support the Dev</h2>
            <p style={{fontWeight: 'bold', marginBottom: '20px', color: '#333'}}>Scan the QR below with any UPI app. Put your Humour Cup Username in the notes!</p>
            
            <div style={{width: '200px', height: '200px', backgroundColor: '#fff', border: '4px dashed #1a1a1a', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '12px'}}>
              <span style={{fontWeight: '900', color: '#666'}}>[ Place your UPI QR code image here ]</span>
            </div>
            
            <p style={{fontWeight: '900', fontSize: '18px', color: '#ef4444', marginBottom: '20px'}}>UPI ID: your.upi@okbank</p>
          </div>
        </div>
      )}

      {/* --- THE SUPPORT / DONATE MODAL --- */}
      {showDonateModal && (
        <div id="donate-backdrop" onClick={(e) => { if(e.target.id === 'donate-backdrop') setShowDonateModal(false); }} style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
        }}>
          <div style={{
            position: 'relative',
            backgroundColor: '#FFC200', padding: '45px 25px 25px 25px', borderRadius: '24px', border: '5px solid #1a1a1a', 
            boxShadow: '10px 10px 0px #1a1a1a', maxWidth: '450px', width: '100%', textAlign: 'center', animation: 'popIn 0.3s ease-out'
          }}>
            
            <button onClick={() => setShowDonateModal(false)} style={{
              position: 'absolute', top: '12px', right: '18px',
              background: 'none', border: 'none', fontSize: '32px', fontWeight: 'bold', 
              color: '#1a1a1a', cursor: 'pointer', lineHeight: '1'
            }}>
              &times;
            </button>

            <div style={{ display: 'inline-block', backgroundColor: '#fff', border: '3px solid #1a1a1a', borderRadius: '12px', padding: '8px 16px', marginBottom: '20px', boxShadow: '4px 4px 0px #1a1a1a' }}>
              <h2 style={{ fontSize: 'clamp(18px, 5vw, 24px)', margin: 0, color: '#1a1a1a', fontWeight: '900', fontFamily: "'Kalam', cursive", textTransform: 'uppercase', whiteSpace: 'nowrap'}}>☕ Support The Dev</h2>
            </div>
            
            <div style={{backgroundColor: '#fff', border: '3px solid #1a1a1a', borderRadius: '12px', padding: '15px', marginBottom: '20px', textAlign: 'left'}}>
               <p style={{margin: 0, fontWeight: '800', fontSize: '14px', lineHeight: '1.5', color: '#1a1a1a'}}>{t('donateClarify')}</p>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px'}}>
               <div style={{display: 'flex', border: '3px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#333'}}>
                  <select style={{...styles.dropdown, border: 'none', borderRadius: 0, flex: '0 0 auto', width: '80px', backgroundColor: '#1a1a1a', textAlign: 'center', padding: '10px', fontSize: '20px'}}>
                    <option>₹</option><option>$</option><option>€</option>
                  </select>
                  <input type="number" min="1" id="donateAmt" placeholder={t('customAmt')} value={donateAmount} onChange={(e) => setDonateAmount(e.target.value)} style={{...styles.input, marginBottom: '0', border: 'none', borderRadius: 0, flex: 1}} />
               </div>
               <input type="email" id="donateEmail" placeholder={t('emailPlace')} value={donateEmail} onChange={(e) => setDonateEmail(e.target.value)} style={{...styles.input, marginBottom: '0'}} />
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px'}}>
               <button onClick={() => handleDonate('razorpay')} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: '#3b82f6', color: '#fff', fontSize: '16px', padding: '15px'}}>{t('payRazor')}</button>
               <button onClick={() => handleDonate('paddle')} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: '#10b981', color: '#fff', fontSize: '16px', padding: '15px'}}>{t('payPaddle')}</button>
               <button onClick={() => {setShowDonateModal(false); setShowUpiModal(true);}} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: '#1a1a1a', color: '#fff', fontSize: '16px', padding: '15px'}}>{t('payUpi')}</button>
            </div>
          </div>
        </div>
      )}

      {/* --- THE GOLD PURCHASE/ACTIVATION MODAL --- */}
      {showGoldModal && (
        <div id="gold-backdrop" onClick={(e) => { if(e.target.id === 'gold-backdrop') setShowGoldModal(false); }} style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 100000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px'
        }}>
          <div style={{
            position: 'relative', 
            backgroundColor: '#fff', padding: '40px 25px 25px 25px', 
            borderRadius: '24px', border: '5px solid #1a1a1a', 
            boxShadow: '10px 10px 0px #1a1a1a', maxWidth: '500px', width: '100%', maxHeight: '90vh', 
            display: 'flex', flexDirection: 'column',
            animation: 'popIn 0.3s ease-out', overflow: 'hidden'
          }}>
            
            <button onClick={() => setShowGoldModal(false)} style={{
              position: 'absolute', top: '12px', right: '18px',
              background: 'none', border: 'none', fontSize: '32px', fontWeight: 'bold', 
              color: '#9ca3af', cursor: 'pointer', lineHeight: '1'
            }}>
              &times;
            </button>
            
            <h2 style={{fontFamily: '"Fredoka One", cursive', fontSize: 'clamp(24px, 6vw, 32px)', color: '#ff9900', margin: '0 0 15px 0', textShadow: '2px 2px 0px #1a1a1a, -1px -1px 0px #1a1a1a, 1px -1px 0px #1a1a1a, -1px 1px 0px #1a1a1a', whiteSpace: 'nowrap'}}>
              🏆 Humour Cup GOLD
            </h2>
            
            <div className="custom-scroll" style={{
                textAlign: 'left', marginBottom: '20px', padding: '15px', backgroundColor: '#fef3c7', 
                borderRadius: '12px', border: '3px solid #1a1a1a', overflowY: 'auto', minHeight: '120px', flex: '1 1 auto'
            }}>
               <p style={{fontWeight: '900', color: '#ef4444', fontSize: '18px', margin: '0 0 5px 0', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', animation: 'pulse 1.5s infinite'}}>🚀 Coming Soon 🚀</p>
               <p style={{fontWeight: '900', color: '#1a1a1a', fontSize: '16px', margin: '0 0 10px 0', textAlign: 'center'}}>Unlock these Perks:</p>
               <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                 {/* Removed gPerk1: Unlimited Players */}
                 <div style={styles.aboutBullet}><span>⭐</span> <span>{t('gPerk2')}</span></div>
                 <div style={styles.aboutBullet}><span>⭐</span> <span>{t('gPerk3')}</span></div>
                 <div style={styles.aboutBullet}><span>⭐</span> <span>{t('gPerk4')}</span></div>
                 <div style={styles.aboutBullet}><span>⭐</span> <span>{t('gPerk5')}</span></div>
                 <div style={styles.aboutBullet}><span>⭐</span> <span>{t('gPerk6')}</span></div>
                 <div style={styles.aboutBullet}><span>⭐</span> <span>{t('gPerk7')}</span></div>
               </div>
            </div>

            <div style={{ flexShrink: 0 }}>
              {activeGoldKey ? (
                 <div style={{backgroundColor: '#10b981', padding: '15px', borderRadius: '12px', border: '3px solid #1a1a1a', color: '#fff', fontWeight: '900', fontSize: '18px', marginBottom: '15px', textAlign: 'center'}}>
                    {t('gActive')}
                 </div>
              ) : (
                 <>
                    {/* The Purchase Section */}
                    <div style={{backgroundColor: '#f3f4f6', border: '3px dashed #1a1a1a', borderRadius: '12px', padding: '15px', marginBottom: '15px'}}>
                        <p style={{fontWeight: '800', color: '#1a1a1a', fontSize: '14px', marginBottom: '10px', marginTop: 0}}>{t('gInstruction')}</p>
                        
                        <input type="email" id="goldEmailInput" placeholder={t('emailPlace')} value={goldEmail} onChange={(e) => setGoldEmail(e.target.value)} style={{...styles.input, marginBottom: '10px', fontSize: '16px', padding: '12px', width: '100%', boxSizing: 'border-box'}} />
                        
                        <div style={{display: 'flex', gap: '10px', width: '100%'}}>
                           <button onClick={() => handleBuyGold('razorpay')} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: '#3b82f6', color: '#fff', fontSize: '11px', padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                             <span style={{fontSize: '18px', display: 'block', fontWeight: '900', marginBottom: '2px'}}>₹499</span>
                             <span style={{textAlign: 'center', lineHeight: '1.2'}}>Pay via<br/>Razorpay</span>
                           </button>
                           
                           <button onClick={() => handleBuyGold('paddle')} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: '#10b981', color: '#fff', fontSize: '11px', padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                             <span style={{fontSize: '18px', display: 'block', fontWeight: '900', marginBottom: '2px'}}>$5.99</span>
                             <span style={{textAlign: 'center', lineHeight: '1.2'}}>Pay via Paddle<br/>(Global)</span>
                           </button>
                        </div>
                    </div>

                    {/* The Activation Section */}
                    <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px'}}>
                        <input id="goldKeyInputBox" name="goldKey" placeholder={t('gInput')} value={goldKeyInput} onChange={(e) => setGoldKeyInput(e.target.value)} style={{...styles.input, marginBottom: '0', fontSize: '16px', padding: '15px', width: '100%', textAlign: 'center', boxSizing: 'border-box'}} />
                        <button onClick={handleActivateGold} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: '#1a1a1a', color: '#ff9900', borderColor: '#1a1a1a', width: '100%', fontSize: '16px', padding: '15px'}}>ACTIVATE FUN KEY</button>
                    </div>
                 </>
              )}
              
              <p style={{fontSize: '11px', color: '#ef4444', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center'}}>{t('goldSub')}</p>

            </div>
          </div>
        </div>
      )}

      <div className="doodle-bg"></div>

      {/* TOP LEFT LANGUAGE SELECTOR */}
      {!room && !isAdminMode && (
        <div style={styles.translateWrapper}>
          <span style={{fontSize: '16px'}}>🌐</span>
          <select id="appLangSelect" name="appLang" value={appLang} onChange={(e) => setAppLang(e.target.value)} style={styles.translateSelect}>
            <option value="English">EN</option>
            <option value="Hindi">हिन्दी</option>
            <option value="Spanish">ES</option>
            <option value="French">FR</option>
            <option value="Mandarin">中文</option>
            <option value="Japanese">日本語</option>
            <option value="Korean">한국어</option>
            <option value="Russian">РУ</option>
            <option value="Arabic">عربي</option>
            <option value="Portuguese">PT</option>
            <option value="German">DE</option>
            <option value="Indonesian">ID</option>
          </select>
        </div>
      )}

      {/* TOP RIGHT GOLD BUTTON */}
      {!room && !isAdminMode && (
        <button onClick={() => { playSound('click'); setShowGoldModal(true); }} className="btn-3d" style={{
          position: 'fixed', top: '20px', right: '25px', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '4px', 
          background: activeGoldKey ? '#10b981' : '#1a1a1a', color: activeGoldKey ? '#fff' : '#ff9900', 
          padding: '8px 12px', borderRadius: '50px', 
          border: '3px solid #1a1a1a', boxShadow: '2px 2px 0px #1a1a1a', fontSize: '14px', fontWeight: '900', cursor: 'pointer',
          fontFamily: '"Fredoka One", "Titan One", "Comic Sans MS", sans-serif'
        }}>
          {activeGoldKey ? '⭐ GOLD ACTIVE' : '⭐ GOLD'}
        </button>
      )}

      <audio ref={audioRef} src={BGM_TRACKS[bgmIndex]} loop />

      <div style={{...styles.container, paddingBottom: '40px', flex: '1 0 auto', position: 'relative', zIndex: 1}}>
         <img src="/finale-logo.png" alt="Humour Cup Logo" className="animated-logo-main" onClick={handleLogoClick} />

        {isAdminMode && !room && (
          <div style={{width: '100%', maxWidth: '600px', backgroundColor: '#fff', padding: '30px', borderRadius: '16px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a', marginBottom: '40px'}}>
            <h2 style={styles.phaseTitle}>🌱 SEEDING DATA</h2>
            <div style={{display: 'flex', gap: '10px', marginBottom: '30px'}}>
               <button onClick={() => refreshStats()} className="btn-3d" style={{...styles.secondaryBtn, flex: 1, backgroundColor: '#10b981', color: '#fff'}}>🔄 REFRESH</button>
               <button onClick={() => setIsAdminMode(false)} className="btn-3d" style={{...styles.secondaryBtn, flex: 1}}>❌ CLOSE</button>
            </div>
            
            <div style={{marginBottom: '40px'}}>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                {Object.entries(seedingStats).map(([lang, count]) => (
                  <div key={lang} style={{backgroundColor: '#fef3c7', border: '2px solid #1a1a1a', borderRadius: '8px', padding: '10px 15px', fontWeight: '900', color: '#1a1a1a', flex: '1 1 calc(33% - 10px)', textAlign: 'center'}}>
                    {lang}: <span style={{color: '#10b981'}}>{formatNum(count)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '4px solid #1a1a1a', paddingTop: '30px' }}>
              <h2 style={{...styles.phaseTitle, fontSize: '24px'}}>🌍 USER SUBMISSIONS ({formatNum(adminPublicScenarios.length)})</h2>
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

        {!room && !isAdminMode && (
          <>
            <div style={styles.mainCard}>
              <input id="playerNameInput" name="playerName" placeholder={t('name')} value={playerName} onChange={(e) => setPlayerName(e.target.value)} style={styles.input} />
              
              <button onClick={handleCreateRoom} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: activeGoldKey ? '#10b981' : '#ff9900', color: '#ffffff', borderColor: '#1a1a1a'}}>
                  {activeGoldKey ? t('createGold') : t('create')}
              </button>
              
              <div style={styles.divider}>{t('orJoin')}</div>
              <div style={{display:'flex', gap:'10px', width: '100%'}}>
                <input id="joinCodeInput" name="joinCode" placeholder={t('code')} value={joinCode} onChange={(e) => setJoinCode(e.target.value)} style={styles.smallInput} maxLength={4} />
                <button onClick={handleJoinRoom} className="btn-3d" style={{...styles.secondaryBtn, backgroundColor: '#ff9900', color: '#ffffff', borderColor: '#1a1a1a'}}>{t('join')}</button>
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

            {renderSubmitScenarioBox()}

            {renderSupportCards()}

            <div style={styles.sectionDivider}></div>

            <div style={{ width: '100%', marginTop: '10px', marginBottom: '40px' }}>
              <button 
                onClick={() => { playSound('click'); setIsAboutOpen(!isAboutOpen); }} 
                className="btn-3d" 
                style={{
                  width: '100%', 
                  padding: '20px', 
                  backgroundColor: isAboutOpen ? '#1a1a1a' : '#ffffff', 
                  color: isAboutOpen ? '#FFC200' : '#1a1a1a', 
                  fontSize: '22px', 
                  fontWeight: '900', 
                  border: '4px solid #1a1a1a', 
                  borderRadius: isAboutOpen ? '16px 16px 0 0' : '16px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  boxShadow: isAboutOpen ? 'none' : '6px 6px 0px #1a1a1a',
                  fontFamily: "'Kalam', cursive",
                  textTransform: 'uppercase',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{t('whatIsHC')}</span>
                <span style={{ transform: isAboutOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>▼</span>
              </button>

              {isAboutOpen && (
                <div style={{
                  width: '100%', backgroundColor: '#ffffff', border: '4px solid #1a1a1a', borderTop: 'none', 
                  borderRadius: '0 0 16px 16px', padding: '30px', textAlign: 'left', color: '#1a1a1a', 
                  boxShadow: '6px 6px 0px #1a1a1a', animation: 'slideDown 0.3s ease-out'
                }}>
                  <p style={styles.aboutText}>{t('ab1')}</p>
                  
                  <p style={{...styles.aboutText, marginTop: '25px'}}><strong>{t('ab2')}</strong></p>
                  <p style={styles.aboutText}>{t('ab3')}</p>
                  <p style={styles.aboutText}>{t('ab4')}</p>
                  <p style={styles.aboutText}>{t('ab5')}</p>
                  
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0'}}>
                    <div style={styles.aboutBullet}><span>🤖</span> <span>{t('ab6')}</span></div>
                    <div style={styles.aboutBullet}><span>🌍</span> <span>{t('ab7')}</span></div>
                    <div style={styles.aboutBullet}><span>🤫</span> <span>{t('ab8')}</span></div>
                  </div>
                  
                  <p style={styles.aboutText}>{t('ab9')}</p>
                  
                  <p style={{ ...styles.aboutText, marginTop: '25px' }}><strong>{t('ab10')}</strong></p>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px', margin: '15px 0'}}>
                    <div style={styles.aboutBullet}><span>💪</span> <span><strong>{t('ab11').split(':')[0]}:</strong>{t('ab11').split(':')[1]}</span></div>
                    <div style={styles.aboutBullet}><span>💪</span> <span><strong>{t('ab12').split(':')[0]}:</strong>{t('ab12').split(':')[1] || t('ab12')}</span></div>
                    <div style={styles.aboutBullet}><span>💪</span> <span><strong>{t('ab13').split(':')[0]}:</strong>{t('ab13').split(':')[1] || t('ab13')}</span></div>
                    <div style={styles.aboutBullet}><span>💪</span> <span><strong>{t('ab14').split(':')[0]}:</strong>{t('ab14').split(':')[1] || t('ab14')}</span></div>
                    <div style={styles.aboutBullet}><span>💪</span> <span><strong>{t('ab15').split(':')[0]}:</strong>{t('ab15').split(':')[1] || t('ab15')}</span></div>
                  </div>
                  
                  <p style={{ ...styles.aboutText, marginBottom: 0, marginTop: '25px', fontWeight: 'bold' }}>{t('ab16')}</p>
                </div>
              )}
            </div>

          </>
        )}

        {room?.state === 'LOBBY' && (
          <>
            <h2 style={styles.phaseTitle}>{t('lobby')}</h2>
            <div style={styles.roomBadge}>{t('roomCode')} {room.id}</div>
            
            <div style={{...styles.mainCard, marginBottom: '30px', textAlign: 'left', paddingTop: '20px'}}>
               <div style={{display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap'}}>
                 
                 <div style={{flex: 1}}>
                   <label style={{fontWeight: '900', fontSize: '14px'}}>{t('scen')}</label>
                   <select id="lobbySourceSelect" name="lobbySource" disabled={!isHost} value={room.settings.source} onChange={(e) => handleSettingChange('source', e.target.value)} style={{...styles.dropdown, width: '100%', marginTop: '5px'}}>
                     <option>AI</option><option>Public</option><option>Custom</option>
                   </select>
                 </div>

                 {room.settings.source !== 'AI' && (
                   <div style={{flex: 1}}>
                     <label style={{fontWeight: '900', fontSize: '14px'}}>{t('cat')}</label>
                     <select id="lobbyCatSelect" name="lobbyCat" disabled={!isHost} value={room.settings.category} onChange={(e) => handleSettingChange('category', e.target.value)} style={{...styles.dropdown, width: '100%', marginTop: '5px'}}>
                       <option>All Ages</option><option>18+</option>
                     </select>
                   </div>
                 )}

                 {(room.settings.source === 'Public' || room.settings.source === 'AI') && (
                   <div style={{flex: '1 1 100%'}}>
                     <label style={{fontWeight: '900', fontSize: '14px'}}>{t('lang')}</label>
                     <select id="lobbyLangSelect" name="lobbyLang" disabled={!isHost} value={room.settings.language} onChange={(e) => handleSettingChange('language', e.target.value)} style={{...styles.dropdown, width: '100%', marginTop: '5px'}}>
                        <option value="English">English</option><option value="Mandarin">Mandarin</option><option value="Hindi">Hindi</option><option value="Spanish">Spanish</option><option value="French">French</option><option value="Arabic">Arabic</option><option value="Portuguese">Portuguese</option><option value="Russian">Russian</option><option value="German">German</option><option value="Japanese">Japanese</option><option value="Korean">Korean</option><option value="Indonesian">Indonesian</option>
                     </select>
                   </div>
                 )}
               </div>

               {room.settings.source === 'Custom' && (
                 <div style={{backgroundColor: '#e5e7eb', padding: '15px', borderRadius: '12px', border: '3px dashed #1a1a1a', textAlign: 'center'}}>
                   <h4 style={{marginBottom: '10px', fontWeight: '900'}}>{t('secret')}</h4>
                   <input id="secretInputBox" name="secretInput" placeholder={t('secPlace')} value={secretInput} onChange={(e) => setSecretInput(e.target.value)} style={{...styles.input, marginBottom: '10px', padding: '10px', fontSize: '14px'}} />
                   <button onClick={handleSecretSubmit} className="btn-3d" style={{...styles.primaryBtn, fontSize: '14px', padding: '10px'}}>{t('addPool')}</button>
                   <p style={{marginTop: '10px', fontWeight: 'bold', color: '#10b981', marginBottom: 0}}>{t('totPool')} {room.customCount || 0}</p>
                   <p style={{marginTop: '15px', fontWeight: 'bold', color: '#1a1a1a', fontSize: '13px', lineHeight: '1.4'}}>{t('addCustomAlso')}</p>
                 </div>
               )}
               
               {/* MOCKUP OF GOLD LOBBY FEATURES IF HOST HAS GOLD */}
               {room.isGold && (
                 <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '12px', border: '3px solid #ff9900', textAlign: 'center'}}>
                   <p style={{fontWeight: '900', color: '#ff9900', margin: '0 0 10px 0'}}>⭐ GOLD SETTINGS ⭐</p>
                   <div style={{display: 'flex', gap: '10px'}}>
                     <div style={{flex: 1}}>
                       <label style={{fontWeight: '900', fontSize: '12px', color: '#666'}}>Rounds</label>
                       <select id="goldRoundSelect" name="goldRounds" disabled={!isHost} value={room.settings.customRounds || 3} onChange={(e) => handleSettingChange('customRounds', parseInt(e.target.value))} style={{...styles.dropdown, width: '100%', marginTop: '5px', padding: '10px', fontSize: '14px'}}>
                         <option value={3}>3 Rounds</option><option value={5}>5 Rounds</option><option value={10}>10 Rounds</option>
                       </select>
                     </div>
                     <div style={{flex: 1}}>
                       <label style={{fontWeight: '900', fontSize: '12px', color: '#666'}}>Timer</label>
                       <select id="goldTimerSelect" name="goldTimer" disabled={!isHost} value={room.settings.customTimer || 90000} onChange={(e) => handleSettingChange('customTimer', parseInt(e.target.value))} style={{...styles.dropdown, width: '100%', marginTop: '5px', padding: '10px', fontSize: '14px'}}>
                         <option value={60000}>Fast (60s)</option><option value={90000}>Normal (90s)</option><option value={120000}>Slow (120s)</option>
                       </select>
                     </div>
                   </div>
                 </div>
               )}
            </div>

            <h3 style={{color: '#1a1a1a', fontWeight: '900', marginBottom: '10px'}}>
              {t('waitSquad')} ({room.players.length} Joined)
            </h3>
            
            {isHost && (
              <button 
                onClick={() => handleSettingChange('namesRevealed', !room.settings.namesRevealed)}
                className="btn-3d"
                style={{
                  ...styles.secondaryBtn, 
                  padding: '8px 16px', 
                  fontSize: '14px', 
                  marginBottom: '20px',
                  backgroundColor: room.settings.namesRevealed ? '#fbbf24' : '#10b981',
                  color: room.settings.namesRevealed ? '#1a1a1a' : '#fff'
                }}
              >
                {room.settings.namesRevealed ? "🙈 Hide Player Names" : "👁️ Reveal Player Names"}
              </button>
            )}
            
            <div style={styles.playerGrid}>
              {[...room.players].sort((a, b) => a.name.localeCompare(b.name)).map((p, i) => (
                <div key={p.id} className="animate-bounce" style={{
                  ...styles.playerTag, 
                  animationDelay: `${i * 0.2}s`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  
                  <span>🎭 {room.settings.namesRevealed ? p.name : '???'}</span>
                  
                  {isHost && p.id !== socket.id && (
                    <button 
                      onClick={() => socket.emit('kickPlayer', { roomId: room.id, playerIdToKick: p.id })}
                      style={{
                        backgroundColor: '#ef4444', 
                        color: 'white', 
                        border: '2px solid #1a1a1a', 
                        borderRadius: '6px', 
                        padding: '4px 8px', 
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        boxShadow: '2px 2px 0px #1a1a1a',
                        fontSize: '12px',
                        marginLeft: '5px'
                      }}
                    >
                      Kick
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isHost ? (room.players.length >= 2 ? <button onClick={handleStartGame} className="btn-3d" style={styles.startBtn}>{t('launch')}</button> : <h3 className="animate-bounce" style={{color: '#ef4444', marginTop: '30px', fontWeight: '900', fontSize: '20px'}}>{t('waitMore')}</h3>) : <h3 className="animate-bounce" style={styles.loadingText}>{t('waitHost')}</h3>}
            
            <div style={{ marginTop: '20px', width: '100%' }}>
              {renderSubmitScenarioBox()}
            </div>
            
          </>
        )}

        {room?.state === 'LAUNCHING' && (
          <>
            <h2 style={styles.phaseTitle}>{t('fetch')}</h2>
            <h1 className="animate-bounce" style={{fontSize:'80px', margin:'20px 0'}}>🚀</h1>
            <div className="loading-container"><div className="loading-fill"></div></div>
          </>
        )}

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
                  <textarea id="gameAnswerInput" name="gameAnswer" value={myAnswer} onChange={(e) => setMyAnswer(e.target.value)} placeholder={t('typeHumour')} style={styles.textarea} />
                  <button type="submit" className="btn-3d" style={styles.primaryBtn}>{t('subHumour')}</button>
                </form>
              ) : <h2 className="animate-bounce" style={styles.loadingText}>{t('waitSlow')} ({safeAnswers.length}/{room.players.length})</h2>}
            </>
          );
        })()}

        {room?.state === 'CHAT_PHASE' && (() => {
          const donePlayers = room.roundData.donePlayers || [];
          const safeAnswers = room.roundData.answers || [];
          const isDone = donePlayers.includes(socket.id);

          return (
            <>
              <h2 style={styles.phaseTitle}>{t('chatVote')}</h2>
              <h3 style={{ color: '#1a1a1a', marginTop: '-20px', marginBottom: '10px', fontSize: '18px', fontWeight: '800' }}>
                Reply with your humour punches and vote.
              </h3>
              <p style={{ color: '#ef4444', fontWeight: '900', fontSize: '15px', marginTop: '0', marginBottom: '20px' }}>
                {t('chatInst')}
              </p>
              
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
                          <input id={`replyInput-${ans.id}`} name="chatReply" value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={t('repPlace')} style={styles.input} autoFocus />
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
              
              <h2 style={styles.phaseTitle}>{isTie ? t('winners') : t('winner')}</h2>
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
              
              <div style={{ marginTop: '20px', width: '100%' }}>
                {renderSubmitScenarioBox()}
              </div>

              {renderSupportCards()}

            </>
          );
        })()}
      </div>

      <div style={styles.sectionDivider}></div>

      <div style={{
        marginBottom: '40px', 
        backgroundColor: '#ff9900',
        padding: '12px 20px', 
        borderRadius: '50px 20px 60px 25px / 20px 60px 25px 50px', 
        border: '1px solid #1a1a1a', 
        boxShadow: '3px 3px 0px #1a1a1a', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'fit-content', 
        maxWidth: '95%', 
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '0.7rem', 
          color: '#ffffff', 
          fontWeight: '400',
          fontFamily: '"Kalam", cursive',
          whiteSpace: 'nowrap', 
        }}>
          {t('madeBy')}<a 
            href="https://arpitsrivstva.itch.io/" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              color: '#ffffff', 
              fontFamily: '"Kalam", cursive',
              fontWeight: '400', 
              textDecoration: 'underline', 
              textDecorationStyle: 'wavy', 
              textDecorationColor: '#ffffff', 
              textUnderlineOffset: '2.5px', 
            }}
          >
            Arpit Srivastava
          </a>{t('toSpark')}
        </div>

        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <a href="/privacy.html" style={styles.footerLegalLink}>{t('privacy')}</a>
          <a href="/terms.html" style={styles.footerLegalLink}>{t('terms')}</a>
          <a href="mailto:qaylingames@gmail.com" style={styles.footerLegalLink}>{t('contact')}</a>
        </div>
      </div>

    </div>

  );
}

const styles = {
  appWrapper: { 
    minHeight: '100vh', 
    width: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    position: 'relative', 
    backgroundColor: '#FFC200', 
    overflowX: 'hidden', 
    boxSizing: 'border-box',
    paddingBottom: '0' 
  }, 
  howToPlayBox: { marginTop: '40px', width: '100%', backgroundColor: '#ffffff', border: '4px solid #1a1a1a', borderRadius: '16px', boxShadow: '6px 6px 0px #1a1a1a', overflow: 'hidden', transform: 'rotate(-1.5deg)' },
  howToPlayHeader: { backgroundColor: '#1a1a1a', color: '#FFC200', padding: '12px', fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' },
  howToPlayContent: { padding: '25px', textAlign: 'left' },
  howToPlayText: { fontSize: '15px', color: '#1a1a1a', marginBottom: '15px', fontWeight: '800', lineHeight: '1.6', display: 'flex', alignItems: 'flex-start', gap: '8px' },
  bullet: { color: '#10b981', fontSize: '16px' }, 
  
  aboutText: { fontSize: '15px', fontWeight: '500', lineHeight: '1.6', marginBottom: '15px' },
  aboutBullet: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '15px', fontWeight: '500', lineHeight: '1.5' },

  container: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 20px 20px 20px', boxSizing: 'border-box' },
  
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
  
  phaseTitle: { 
    fontSize: '38px', 
    color: '#ffffff', 
    marginBottom: '30px', 
    fontWeight: '900', 
    fontFamily: "'Kalam', cursive",
    textTransform: 'uppercase', 
    textAlign: 'center',
    textShadow: '3px 3px 0px #1a1a1a, -2px -2px 0px #1a1a1a, 2px -2px 0px #1a1a1a, -2px 2px 0px #1a1a1a, 2px 2px 0px #1a1a1a', 
    transform: 'rotate(-2deg)',
    display: 'inline-block'
  },
  
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
  translateWrapper: { position: 'fixed', top: '20px', left: '20px', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', padding: '8px 12px', borderRadius: '50px', border: '3px solid #1a1a1a', boxShadow: '2px 2px 0px #1a1a1a' },
  translateSelect: { border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', fontWeight: '900', color: '#1a1a1a', cursor: 'pointer' },
  
  devCardGreen: { background: '#10b981', padding: '25px', borderRadius: '16px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a', width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  indieDevText: { fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#ffffff', fontWeight: 'bold', lineHeight: '1.5', margin: '5px 0 0 0' },
  devCardOval: { background: '#e5e7eb', padding: '30px 40px', borderRadius: '100px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #ef4444', width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  feedbackText: { fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#1a1a1a', fontWeight: 'bold', margin: '0', lineHeight: '1.4' },
  emailLink: { color: '#ffffff', fontFamily: "'Kalam', cursive", background: '#ef4444', padding: '8px 16px', borderRadius: '12px', border: '3px solid #1a1a1a', textDecoration: 'none', fontWeight: '900', fontSize: '15px', margin: '0', boxShadow: '4px 4px 0px #1a1a1a', display: 'inline-block' },

  sectionDivider: { 
    width: '50%', 
    maxWidth: '250px', 
    height: '4px', 
    backgroundColor: '#1a1a1a', 
    marginTop: '40px', 
    marginBottom: '40px',
    marginInline: 'auto',
    borderRadius: '10px', 
    opacity: '0.6' 
  },
  
  footerLegalLink: { 
    color: '#ffffff',
    textDecoration: 'underline', 
    fontWeight: '300', 
    fontFamily: "'Kalam', cursive", 
    fontSize: '9px' 
  },
};

export default App;