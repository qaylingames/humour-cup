import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import html2canvas from 'html2canvas';

const socket = io('https://humour-cup-server.onrender.com');

// --- THE MASSIVE UNIVERSAL UI TRANSLATION DICTIONARY ---
const uiTranslations = {
  'English': { name: "Your Funny Name", create: "Create Game", orJoin: "OR JOIN A FRIEND", code: "CODE", join: "Join", rulebook: "👑 Official Rulebook 👑", rule1: "Write your humorous response on each scenario.", rule2: "Reply with your humour punches in the chat round after each scenario.", rule3: "Vote the ones you find humorous.", rule4: "The player with the maximum Humour XP gets the Humour Cup.", submitPub: "🌍 Submit a Public Scenario 🌍", pubDesc: "Add your own scenario for humour cup. These come randomly to players opting for Public scenarios in the lobby.", pubPlace: "Type your custom scenario here...", submit: "Submit", lobby: "Lobby", roomCode: "ROOM CODE:", cat: "Category:", scen: "Scenarios:", lang: "Language:", secret: "🤫 Secretly Add to the Game Mix!", secPlace: "Write a surprise scenario...", addPool: "Add to Pool", totPool: "Total Custom Scenarios in Pool:", waitSquad: "Waiting for the squad...", host: "(Host)", launch: "Launch Game 🚀", waitMore: "Waiting for at least 1 more player...", waitHost: "Waiting for the host to start...", fetch: "Fetching Scenarios...", scenTitle: "Scenario", secLeft: "Seconds Left", typeHumour: "Type your humour...", subHumour: "Submit Humour", waitSlow: "Waiting for slower humans...", chatVote: "Chat & Vote Round", humourBtn: "Humorous!", replyBtn: "Reply", repPlace: "Reply...", send: "Send", cancel: "Cancel", done: "I'm Done Reading!", waiting: "Waiting...", upcoming: "Upcoming", enterRound: "Entering Round", in: "in", load: "Loading...", results: "Final Results", winners: "Winners", winner: "Winner", scoreboard: "Final Scoreboard", receipt: "🧾 Humour Cup Receipt", thanks: "Thanks for playing Humour Cup! 🏆", saveRec: "📸 Save this Humour Cup receipt", playAgain: "Play Again (Host)", waitRes: "Waiting for Host to Restart...", adminVault: "Admin Vault View", backHome: "⬅ Back to Home", noScen: "No scenarios yet!" },
  'Hindi': { name: "आपका मज़ेदार नाम", create: "गेम बनाएं", orJoin: "या दोस्त से जुड़ें", code: "कोड", join: "जुड़ें", rulebook: "👑 आधिकारिक नियम 👑", rule1: "प्रत्येक परिदृश्य पर अपनी मज़ेदार प्रतिक्रिया लिखें।", rule2: "प्रत्येक परिदृश्य के बाद चैट राउंड में अपने हास्य पंचों के साथ उत्तर दें।", rule3: "जो आपको मज़ेदार लगें, उन्हें वोट दें।", rule4: "सबसे अधिक ह्यूमर XP वाले खिलाड़ी को ह्यूमर कप मिलता है।", submitPub: "🌍 सार्वजनिक परिदृश्य जमा करें 🌍", pubDesc: "ह्यूमर कप के लिए अपना खुद का परिदृश्य जोड़ें।", pubPlace: "अपना कस्टम परिदृश्य यहां टाइप करें...", submit: "जमा करें", lobby: "लॉबी", roomCode: "रूम कोड:", cat: "श्रेणी:", scen: "परिदृश्य:", lang: "भाषा:", secret: "🤫 चुपके से गेम मिक्स में जोड़ें!", secPlace: "एक आश्चर्यजनक परिदृश्य लिखें...", addPool: "पूल में जोड़ें", totPool: "पूल में कुल कस्टम परिदृश्य:", waitSquad: "स्क्वाड की प्रतीक्षा में...", host: "(होस्ट)", launch: "गेम शुरू करें 🚀", waitMore: "कम से कम 1 और खिलाड़ी की प्रतीक्षा में...", waitHost: "होस्ट के शुरू करने की प्रतीक्षा में...", fetch: "परिदृश्य प्राप्त कर रहा है...", scenTitle: "परिदृश्य", secLeft: "सेकंड शेष", typeHumour: "अपना हास्य टाइप करें...", subHumour: "हास्य जमा करें", waitSlow: "धीमे इंसानों की प्रतीक्षा में...", chatVote: "चैट और वोट राउंड", humourBtn: "मज़ेदार!", replyBtn: "उत्तर दें", repPlace: "उत्तर...", send: "भेजें", cancel: "रद्द करें", done: "मैंने पढ़ना समाप्त कर लिया है!", waiting: "प्रतीक्षा में...", upcoming: "आगामी", enterRound: "राउंड में प्रवेश", in: "में", load: "लोड हो रहा है...", results: "अंतिम परिणाम", winners: "विजेता", winner: "विजेता", scoreboard: "अंतिम स्कोरबोर्ड", receipt: "🧾 ह्यूमर कप रसीद", thanks: "ह्यूमर कप खेलने के लिए धन्यवाद! 🏆", saveRec: "📸 यह ह्यूमर कप रसीद सहेजें", playAgain: "फिर से खेलें (होस्ट)", waitRes: "होस्ट के फिर से शुरू करने की प्रतीक्षा में...", adminVault: "एडमिन वॉल्ट दृश्य", backHome: "⬅ वापस होम", noScen: "अभी तक कोई परिदृश्य नहीं!" },
  'Spanish': { name: "Tu Nombre Divertido", create: "Crear Juego", orJoin: "O UNIRSE A UN AMIGO", code: "CÓDIGO", join: "Unirse", rulebook: "👑 Reglas Oficiales 👑", rule1: "Escribe tu respuesta humorística en cada escenario.", rule2: "Responde con tus chistes en la ronda de chat.", rule3: "Vota los que te parezcan graciosos.", rule4: "El jugador con más XP gana la Copa de Humor.", submitPub: "🌍 Enviar Escenario Público 🌍", pubDesc: "Añade tu propio escenario para la copa de humor.", pubPlace: "Escribe tu escenario aquí...", submit: "Enviar", lobby: "Vestíbulo", roomCode: "CÓDIGO DE SALA:", cat: "Categoría:", scen: "Escenarios:", lang: "Idioma:", secret: "🤫 ¡Añadir en secreto!", secPlace: "Escribe un escenario sorpresa...", addPool: "Añadir", totPool: "Total de Escenarios Personalizados:", waitSquad: "Esperando al equipo...", host: "(Anfitrión)", launch: "Lanzar Juego 🚀", waitMore: "Esperando al menos a 1 jugador más...", waitHost: "Esperando que el anfitrión empiece...", fetch: "Obteniendo Escenarios...", scenTitle: "Escenario", secLeft: "Segundos Restantes", typeHumour: "Escribe tu humor...", subHumour: "Enviar Humor", waitSlow: "Esperando a los humanos lentos...", chatVote: "Ronda de Chat y Votos", humourBtn: "¡Gracioso!", replyBtn: "Responder", repPlace: "Responder...", send: "Enviar", cancel: "Cancelar", done: "¡He terminado de leer!", waiting: "Esperando...", upcoming: "Próximo", enterRound: "Entrando a la Ronda", in: "en", load: "Cargando...", results: "Resultados Finales", winners: "Ganadores", winner: "Ganador", scoreboard: "Marcador Final", receipt: "🧾 Recibo de Copa de Humor", thanks: "¡Gracias por jugar! 🏆", saveRec: "📸 Guardar este recibo", playAgain: "Jugar de nuevo (Anfitrión)", waitRes: "Esperando al anfitrión...", adminVault: "Vista de Bóveda", backHome: "⬅ Volver al Inicio", noScen: "¡Aún no hay escenarios!" },
  'French': { name: "Votre nom drôle", create: "Créer un jeu", orJoin: "OU REJOINDRE", code: "CODE", join: "Rejoindre", rulebook: "👑 Règles Officielles 👑", rule1: "Écrivez votre réponse humoristique.", rule2: "Répondez avec vos blagues dans le chat.", rule3: "Votez pour ceux que vous trouvez drôles.", rule4: "Le joueur avec le plus d'XP gagne.", submitPub: "🌍 Soumettre un scénario public 🌍", pubDesc: "Ajoutez votre propre scénario.", pubPlace: "Tapez votre scénario ici...", submit: "Soumettre", lobby: "Lobby", roomCode: "CODE DU SALON:", cat: "Catégorie:", scen: "Scénarios:", lang: "Langue:", secret: "🤫 Ajouter secrètement !", secPlace: "Écrivez un scénario surprise...", addPool: "Ajouter", totPool: "Total de scénarios personnalisés:", waitSquad: "En attente de l'équipe...", host: "(Hôte)", launch: "Lancer le jeu 🚀", waitMore: "En attente d'au moins 1 joueur...", waitHost: "En attente de l'hôte...", fetch: "Récupération...", scenTitle: "Scénario", secLeft: "Secondes restantes", typeHumour: "Tapez votre humour...", subHumour: "Soumettre l'humour", waitSlow: "En attente des humains lents...", chatVote: "Round de Chat & Vote", humourBtn: "Drôle !", replyBtn: "Répondre", repPlace: "Répondre...", send: "Envoyer", cancel: "Annuler", done: "J'ai fini de lire !", waiting: "En attente...", upcoming: "À venir", enterRound: "Entrée au Round", in: "dans", load: "Chargement...", results: "Résultats Finaux", winners: "Gagnants", winner: "Gagnant", scoreboard: "Tableau de bord", receipt: "🧾 Reçu de la Coupe", thanks: "Merci d'avoir joué ! 🏆", saveRec: "📸 Sauvegarder ce reçu", playAgain: "Rejouer (Hôte)", waitRes: "En attente de l'hôte...", adminVault: "Vue Admin", backHome: "⬅ Retour", noScen: "Pas de scénarios !" },
  'Mandarin': { name: "你的搞笑名字", create: "创建游戏", orJoin: "或加入朋友", code: "代码", join: "加入", rulebook: "👑 官方规则 👑", rule1: "在每个场景上写下你的幽默回应。", rule2: "在聊天回合中回复你的幽默段子。", rule3: "为你觉得好笑的投票。", rule4: "拥有最高幽默XP的玩家获得幽默奖杯。", submitPub: "🌍 提交公开场景 🌍", pubDesc: "添加你自己的幽默杯场景。", pubPlace: "在这里输入你的自定义场景...", submit: "提交", lobby: "大厅", roomCode: "房间代码：", cat: "类别：", scen: "场景：", lang: "语言：", secret: "🤫 秘密添加到游戏中！", secPlace: "写一个惊喜场景...", addPool: "添加到池中", totPool: "自定义场景总数：", waitSquad: "等待队伍...", host: "(房主)", launch: "开始游戏 🚀", waitMore: "等待至少一名玩家...", waitHost: "等待房主开始...", fetch: "获取场景中...", scenTitle: "场景", secLeft: "剩余秒数", typeHumour: "输入你的幽默...", subHumour: "提交幽默", waitSlow: "等待较慢的玩家...", chatVote: "聊天和投票回合", humourBtn: "好笑！", replyBtn: "回复", repPlace: "回复...", send: "发送", cancel: "取消", done: "我读完了！", waiting: "等待中...", upcoming: "即将到来", enterRound: "进入回合", in: "还有", load: "加载中...", results: "最终结果", winners: "赢家", winner: "赢家", scoreboard: "最终记分牌", receipt: "🧾 幽默杯收据", thanks: "感谢游玩！🏆", saveRec: "📸 保存这张收据", playAgain: "再玩一次（房主）", waitRes: "等待房主重新开始...", adminVault: "管理员视图", backHome: "⬅ 返回主页", noScen: "暂无场景！" },
  'Russian': { name: "Твое смешное имя", create: "Создать игру", orJoin: "ИЛИ ПРИСОЕДИНИТЬСЯ", code: "КОД", join: "Вход", rulebook: "👑 Правила 👑", rule1: "Напиши смешной ответ на сценарий.", rule2: "Отвечай шутками в чате.", rule3: "Голосуй за самые смешные.", rule4: "Игрок с наибольшим XP побеждает.", submitPub: "🌍 Предложить сценарий 🌍", pubDesc: "Добавь свой сценарий для игры.", pubPlace: "Введи свой сценарий здесь...", submit: "Отправить", lobby: "Лобби", roomCode: "КОД КОМНАТЫ:", cat: "Категория:", scen: "Сценарии:", lang: "Язык:", secret: "🤫 Добавить тайно!", secPlace: "Напиши сценарий-сюрприз...", addPool: "Добавить", totPool: "Всего сценариев:", waitSquad: "Ждем команду...", host: "(Хост)", launch: "Запуск 🚀", waitMore: "Ждем еще 1 игрока...", waitHost: "Ждем хоста...", fetch: "Получение...", scenTitle: "Сценарий", secLeft: "Секунд осталось", typeHumour: "Введи шутку...", subHumour: "Отправить", waitSlow: "Ждем остальных...", chatVote: "Чат и Голосование", humourBtn: "Смешно!", replyBtn: "Ответить", repPlace: "Ответить...", send: "Отправить", cancel: "Отмена", done: "Я прочитал!", waiting: "Ожидание...", upcoming: "Следующий", enterRound: "Начало раунда", in: "через", load: "Загрузка...", results: "Результаты", winners: "Победители", winner: "Победитель", scoreboard: "Счет", receipt: "🧾 Чек игры", thanks: "Спасибо за игру! 🏆", saveRec: "📸 Сохранить этот чек", playAgain: "Играть снова (Хост)", waitRes: "Ждем хоста...", adminVault: "Хранилище Админа", backHome: "⬅ Назад", noScen: "Нет сценариев!" }
  // Other languages dynamically fall back to English!
};

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

  // UNIVERSAL TRANSLATOR FUNCTION
  const t = (key) => uiTranslations[appLang]?.[key] || uiTranslations['English'][key] || key;

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
    if (room?.state === 'CHAT_PHASE' || room?.state === 'ANSWER_PHASE') {
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
  
  const handleSettingChange = (key, value) => { socket.emit('updateSettings', { roomId: room.id, settings: { [key]: value } }); };
  const handleSecretSubmit = () => { if (!secretInput.trim()) return; playSound('vote'); socket.emit('addSecretScenario', { roomId: room.id, text: secretInput }); setSecretInput(''); };

  // SECRET ADMIN VAULT (Click Logo 5 Times)
  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 5) {
      setLogoClicks(0);
      const pwd = prompt("Admin Passcode:");
      if (pwd === "admin") {
        playSound('win');
        socket.emit('getPublicVault', (data) => { setVaultData(data); setShowVault(true); });
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
        if (res.data.accepted) {
          playSound('vote'); 
          setPubStatus({ type: 'success', msg: `✅ ${res.data.reason}` });
          setPubScenario(''); 
          setTimeout(() => setPubStatus(null), 6000); 
        } else {
          playSound('alert'); 
          setPubStatus({ type: 'error', msg: `❌ ${res.data.reason}` });
        }
      } else {
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

  const handleSaveReceipt = () => {
    playSound('click');
    if (receiptRef.current) {
      html2canvas(receiptRef.current, { backgroundColor: '#fef3c7', scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = `HumourCup_Receipt_${room.id}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const isHost = room?.players[0]?.id === socket.id;

  // UPDATED RAIN EMOJIS!
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
      `}</style>

      {/* TOP LEFT GLOBAL TRANSLATION DROPDOWN */}
      <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 1000 }}>
        <select value={appLang} onChange={(e) => setAppLang(e.target.value)} style={{...styles.dropdown, padding: '8px', fontSize: '12px', width: 'auto'}}>
          <option>English</option><option>Mandarin</option><option>Hindi</option><option>Spanish</option><option>French</option><option>Arabic</option><option>Portuguese</option><option>Russian</option><option>German</option><option>Japanese</option><option>Korean</option><option>Indonesian</option>
        </select>
      </div>

      <audio ref={audioRef} src={BGM_TRACKS[bgmIndex]} loop />

      {/* --- VIEW: HOME SCREEN --- */}
      {!room && !showVault && (
        <div style={styles.container}>
          <h1 onClick={handleLogoClick} style={{...styles.logo, cursor: 'pointer', userSelect: 'none'}}>🏆 Humour Cup</h1>
          
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
              <textarea value={pubScenario} onChange={(e) => setPubScenario(e.target.value)} placeholder={t('pubPlace')} style={{...styles.textarea, height: '80px', marginBottom: '10px'}} />
              
              <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                <select value={pubLang} onChange={(e) => setPubLang(e.target.value)} style={styles.dropdown}>
                  <option>English</option><option>Mandarin</option><option>Hindi</option><option>Spanish</option><option>French</option><option>Arabic</option><option>Portuguese</option><option>Russian</option><option>German</option><option>Japanese</option><option>Korean</option><option>Indonesian</option>
                </select>
                <select value={pubCategory} onChange={(e) => setPubCategory(e.target.value)} style={styles.dropdown}>
                  <option>All Ages</option><option>18+</option>
                </select>
              </div>

              <button onClick={handlePublicSubmit} disabled={pubStatus?.type === 'loading'} className="btn-3d" style={{...styles.primaryBtn, padding: '12px', fontSize: '16px'}}>{t('submit')}</button>

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
        </div>
      )}

      {/* --- VIEW: ADMIN VAULT LIBRARY --- */}
      {!room && showVault && (
        <div style={{...styles.container, maxWidth: '800px'}}>
          <h1 style={styles.logo}>🏆 Humour Cup</h1>
          <h2 style={styles.phaseTitle}>{t('adminVault')}</h2>
          <button onClick={() => setShowVault(false)} className="btn-3d" style={{...styles.secondaryBtn, marginBottom: '20px'}}>{t('backHome')}</button>
          
          <div style={{width: '100%', display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center'}}>
             {['All Ages', '18+'].map(cat => (
               <div key={cat} style={{flex: '1 1 300px', backgroundColor: '#fff', border: '4px solid #1a1a1a', borderRadius: '16px', padding: '20px', boxShadow: '8px 8px 0px #1a1a1a'}}>
                 <h2 style={{backgroundColor: '#1a1a1a', color: '#FFC200', padding: '10px', borderRadius: '8px'}}>{cat} Vault</h2>
                 {vaultData.filter(v => v.category === cat).length === 0 ? <p style={{fontWeight: 'bold'}}>{t('noScen')}</p> : 
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
                      <option>English</option><option>Mandarin</option><option>Hindi</option><option>Spanish</option><option>French</option><option>Arabic</option><option>Portuguese</option><option>Russian</option><option>German</option><option>Japanese</option><option>Korean</option><option>Indonesian</option>
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
        </div>
      )}

      {/* --- VIEW: LAUNCHING --- */}
      {room?.state === 'LAUNCHING' && (
        <div style={styles.container}>
          <h1 style={styles.logo}>🏆 Humour Cup</h1>
          <h2 style={styles.phaseTitle}>{t('fetch')}</h2>
          <h1 className="animate-bounce" style={{fontSize:'80px', margin:'20px 0'}}>🚀</h1>
          <div className="loading-container"><div className="loading-fill"></div></div>
        </div>
      )}

      {/* --- VIEW: ANSWER PHASE --- */}
      {room?.state === 'ANSWER_PHASE' && (() => {
        const safeAnswers = room.roundData.answers || [];
        const hasSubmitted = safeAnswers.some(a => a.playerId === socket.id);
        const currentRound = room.roundData.roundNumber || 1; 
        return (
          <div style={styles.container}>
            <h1 style={styles.logo}>🏆 Humour Cup</h1>
            <h2 style={styles.phaseTitle}>{t('scenTitle')} {currentRound}</h2>
            <div style={styles.timerBadge}>⏳ {timeLeft} {t('secLeft')}</div>
            <div style={styles.scenarioCard}>"{room.roundData.scenario}"</div>
            {!hasSubmitted ? (
              <form onSubmit={handleSubmitAnswer} style={styles.form}>
                <textarea value={myAnswer} onChange={(e) => setMyAnswer(e.target.value)} placeholder={t('typeHumour')} style={styles.textarea} />
                <button type="submit" className="btn-3d" style={styles.primaryBtn}>{t('subHumour')}</button>
              </form>
            ) : <h2 className="animate-bounce" style={styles.loadingText}>{t('waitSlow')} ({safeAnswers.length}/{room.players.length})</h2>}
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
            <h2 style={styles.phaseTitle}>{t('chatVote')}</h2>
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
            <h2 style={styles.phaseTitle}>{t('scenTitle')} {nextRound} {t('upcoming')}</h2>
            <div style={{width: '100%', marginBottom: '40px'}}>
              {sortedPlayers.map((p, i) => (
                <div key={p.id} style={{display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#fff', border: '3px solid #1a1a1a', borderRadius: '12px', marginBottom: '10px', fontWeight: 'bold', boxShadow: '4px 4px 0px #1a1a1a'}}>
                  <span style={{fontSize: '18px'}}>#{i + 1} {p.name}</span><span style={{fontSize: '18px', color: '#10b981'}}>{p.score} XP</span>
                </div>
              ))}
            </div>
            {timeLeft > 0 ? <h3 style={{color: '#1a1a1a', fontWeight: '900', fontSize: '24px', textTransform: 'uppercase'}}>{t('enterRound')} {nextRound} {t('in')} {timeLeft}...</h3> : <div style={{width: '100%', marginTop: '20px'}}><h3 className="animate-bounce" style={{color: '#1a1a1a', fontWeight: '900', fontSize: '20px', textTransform: 'uppercase'}}>{t('load')}</h3><div className="loading-container"><div className="loading-fill"></div></div></div>}
          </div>
        );
      })()}

      {/* --- VIEW: RESULTS --- */}
      {room?.state === 'RESULTS' && (() => {
        const sortedPlayers = [...room.players].sort((a,b) => b.score - a.score);
        const highestScore = sortedPlayers[0].score;
        const winners = sortedPlayers.filter(p => p.score === highestScore);
        const isTie = winners.length > 1;

        return (
          <div style={styles.container}>
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

            <h1 style={styles.logo}>🏆 Humour Cup</h1>
            <h2 style={styles.phaseTitle}>{t('results')}</h2>
            
            <h3 style={{color: '#1a1a1a', textTransform: 'uppercase', fontWeight: '900', marginTop: '10px', marginBottom: '10px', fontSize: '24px'}}>{isTie ? t('winners') : t('winner')}</h3>
            <div style={styles.winnerCard}>
              {winners.map(w => <h1 key={w.id} style={{margin:'0 0 5px 0', color: '#1a1a1a', fontSize: '42px'}}>{w.name}</h1>)}
              <h3 style={{margin:'15px 0 0 0', color: '#1a1a1a', opacity: 0.8}}>{highestScore} XP</h3>
            </div>

            <h3 style={{color: '#1a1a1a', textTransform: 'uppercase', fontWeight: '900', marginTop: '20px'}}>{t('scoreboard')}</h3>
            <div style={{width: '100%', marginBottom: '40px'}}>
              {sortedPlayers.map((p, i) => (
                <div key={p.id} style={{display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#fff', border: '3px solid #1a1a1a', borderRadius: '12px', marginBottom: '10px', fontWeight: 'bold', boxShadow: '4px 4px 0px #1a1a1a'}}>
                  <span style={{fontSize: '18px'}}>#{i + 1} {p.name}</span><span style={{fontSize: '18px', color: '#10b981'}}>{p.score} XP</span>
                </div>
              ))}
            </div>

            <div ref={receiptRef} style={styles.receiptBox}>
              <h3 style={styles.receiptTitle}>{t('receipt')}</h3>
              <p style={{textAlign: 'center', fontSize: '12px', opacity: 0.6, marginTop: '-15px', marginBottom: '20px'}}>{t('roomCode')} {room.id}</p>
              
              {room.history && room.history.map((round, i) => (
                <div key={i} style={{marginBottom: '20px'}}>
                  <p style={{fontWeight: '900', fontSize: '16px', marginBottom: '8px', color: '#1a1a1a'}}>Q{round.roundNumber}: "{round.scenario}"</p>
                  {round.answers.map(ans => {
                    const author = room.players.find(p => p.id === ans.playerId)?.name || "Unknown";
                    return (
                      <div key={ans.id} style={{marginLeft: '15px', marginBottom: '8px', borderLeft: '3px solid #ccc', paddingLeft: '10px'}}>
                        <p style={{fontSize: '14px', color: '#333', margin: '0'}}><b>{author}:</b> "{ans.text}" (⭐ {ans.votes.length})</p>
                        {ans.replies.map(rep => {
                          const repAuthor = room.players.find(p => p.id === rep.playerId)?.name || "Unknown";
                          return <p key={rep.id} style={{fontSize: '13px', color: '#666', margin: '2px 0 0 0'}}>↳ <b>{repAuthor}:</b> {rep.text}</p>
                        })}
                      </div>
                    )
                  })}
                </div>
              ))}
              <div style={{borderTop: '2px dashed #1a1a1a', paddingTop: '10px', textAlign: 'center', fontWeight: 'bold', fontSize: '14px'}}>
                {t('thanks')}
              </div>
            </div>

            <button onClick={handleSaveReceipt} className="btn-3d" style={{...styles.secondaryBtn, width: '100%', marginBottom: '20px', backgroundColor: '#10b981', color: '#fff'}}>{t('saveRec')}</button>

            {isHost ? <button onClick={handlePlayAgain} className="btn-3d" style={styles.primaryBtn}>{t('playAgain')}</button> : <h3 className="animate-bounce" style={{color: '#1a1a1a', fontWeight: '900', fontSize: '20px'}}>{t('waitRes')}</h3>}
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
  checklistItem: { fontSize: '14px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' },
  receiptBox: { width: '100%', padding: '25px 20px', backgroundColor: '#fef3c7', borderRadius: '4px', border: '3px dashed #1a1a1a', marginBottom: '20px', textAlign: 'left', boxShadow: '6px 6px 0px #1a1a1a', fontFamily: '"Comic Sans MS", "Chalkboard SE", "Comic Neue", cursive' },
  receiptTitle: { color: '#1a1a1a', textTransform: 'uppercase', fontWeight: '900', textAlign: 'center', marginBottom: '20px', fontSize: '24px', borderBottom: '2px dashed #1a1a1a', paddingBottom: '15px' }
};

export default App;