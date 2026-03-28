import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://humour-cup-server.onrender.com');

const uiTranslations = {
  'English': { name: "Your Funny Name", create: "Create Room", orJoin: "OR JOIN A FRIEND", code: "CODE", join: "Join", rulebook: "👑 How to Play 👑", rule1: "Write your humorous response on each scenario.", rule2: "Reply with your humour punches in the chat round after each scenario.", rule3: "Vote the ones you find humorous.", rule4: "The player with the maximum Humour XP gets the Humour Cup.", submitPub: "🌍 Submit a Public Scenario 🌍", pubDesc: "Add your own scenario for humour cup. These come randomly to players opting for Public scenarios in the lobby.", pubPlace: "Type your custom scenario here...", submit: "Submit", lobby: "Lobby", roomCode: "ROOM CODE:", cat: "Category:", scen: "Scenarios:", lang: "Language:", secret: "🤫 Secretly Add to the Game Mix!", secPlace: "Write a surprise scenario...", addPool: "Add to Pool", totPool: "Total Custom Scenarios in Pool:", waitSquad: "Waiting for the squad...", host: "(Host)", launch: "Launch Game 🚀", waitMore: "Waiting for at least 1 more player...", waitHost: "Waiting for the host to start...", fetch: "Fetching Scenarios...", scenTitle: "Scenario", secLeft: "Seconds Left", typeHumour: "Type your humour...", subHumour: "Submit Humour", waitSlow: "Waiting for slower humans...", chatVote: "Chat & Vote Round", humourBtn: "Humorous!", replyBtn: "Reply", repPlace: "Reply...", send: "Send", cancel: "Cancel", done: "I'm Done Reading!", waiting: "Waiting...", upcoming: "Upcoming", enterRound: "Entering Round-", in: "in", seconds: "seconds", load: "Loading...", results: "Final Results", winners: "Winners", winner: "Winner", scoreboard: "Final Scoreboard", receipt: "🧾 MATCH RECEIPT", thanks: "Thanks for playing Humour Cup! 🏆", saveRec: "📸 Save this Match Receipt", playAgain: "Play Again (Host)", waitRes: "Waiting for Host to Restart...", adminVault: "Admin Vault View", backHome: "⬅ Back to Home", noScen: "No scenarios yet!" },
  'Hindi': { name: "आपका मज़ेदार नाम", create: "रूम बनाएं", orJoin: "या दोस्त से जुड़ें", code: "कोड", join: "जुड़ें", rulebook: "👑 कैसे खेलें 👑", rule1: "प्रत्येक परिदृश्य पर अपनी मज़ेदार प्रतिक्रिया लिखें।", rule2: "परिदृश्य के बाद चैट राउंड में अपने हास्य का जवाब दें।", rule3: "जो आपको मज़ेदार लगें, उन्हें वोट दें।", rule4: "सबसे अधिक ह्यूमर XP वाले खिलाड़ी को ह्यूमर कप मिलता है।", submitPub: "🌍 सार्वजनिक परिदृश्य जमा करें 🌍", pubDesc: "ह्यूमर कप के लिए अपना परिदृश्य जोड़ें। ये उन खिलाड़ियों को बेतरतीब ढंग से आते हैं जो लॉबी में सार्वजनिक परिदृश्य चुनते हैं।", pubPlace: "अपना कस्टम परिदृश्य यहां टाइप करें...", submit: "जमा करें", lobby: "लॉबी", roomCode: "रूम कोड:", cat: "श्रेणी:", scen: "परिदृश्य:", lang: "भाषा:", secret: "🤫 चुपके से गेम में जोड़ें!", secPlace: "एक परिदृश्य लिखें...", addPool: "पूल में जोड़ें", totPool: "पूल में कुल कस्टम परिदृश्य:", waitSquad: "स्क्वाड की प्रतीक्षा में...", host: "(होस्ट)", launch: "गेम शुरू करें 🚀", waitMore: "1 और खिलाड़ी की प्रतीक्षा में...", waitHost: "होस्ट के शुरू करने की प्रतीक्षा में...", fetch: "परिदृश्य प्राप्त कर रहा है...", scenTitle: "परिदृश्य", secLeft: "सेकंड शेष", typeHumour: "अपना हास्य टाइप करें...", subHumour: "हास्य जमा करें", waitSlow: "धीमे इंसानों की प्रतीक्षा में...", chatVote: "चैट और वोट राउंड", humourBtn: "मज़ेदार!", replyBtn: "उत्तर दें", repPlace: "उत्तर...", send: "भेजें", cancel: "रद्द करें", done: "पढ़ना समाप्त कर लिया!", waiting: "प्रतीक्षा में...", upcoming: "आगामी", enterRound: "राउंड-", in: "में प्रवेश", seconds: "सेकंड में", load: "लोड हो रहा है...", results: "अंतिम परिणाम", winners: "विजेता", winner: "विजेता", scoreboard: "अंतिम स्कोरबोर्ड", receipt: "🧾 MATCH RECEIPT", thanks: "खेलने के लिए धन्यवाद! 🏆", saveRec: "📸 यह रसीद सहेजें", playAgain: "फिर से खेलें (होस्ट)", waitRes: "होस्ट की प्रतीक्षा में...", adminVault: "एडमिन वॉल्ट", backHome: "⬅ वापस", noScen: "कोई परिदृश्य नहीं!" },
  'Spanish': { name: "Tu Nombre Divertido", create: "Crear Sala", orJoin: "O UNIRSE A UN AMIGO", code: "CÓDIGO", join: "Unirse", rulebook: "👑 Cómo Jugar 👑", rule1: "Escribe tu respuesta humorística en cada escenario.", rule2: "Responde con tus chistes en la ronda de chat.", rule3: "Vota los que te parezcan graciosos.", rule4: "El jugador con más XP gana la Copa.", submitPub: "🌍 Enviar Escenario Público 🌍", pubDesc: "Añade tu propio escenario para la copa de humor. Estos aparecen aleatoriamente a los jugadores que optan por escenarios públicos en el vestíbulo.", pubPlace: "Escribe tu escenario aquí...", submit: "Enviar", lobby: "Vestíbulo", roomCode: "CÓDIGO DE SALA:", cat: "Categoría:", scen: "Escenarios:", lang: "Idioma:", secret: "🤫 ¡Añadir en secreto!", secPlace: "Escribe un escenario sorpresa...", addPool: "Añadir", totPool: "Total de Escenarios Personalizados:", waitSquad: "Esperando al equipo...", host: "(Anfitrión)", launch: "Lanzar Juego 🚀", waitMore: "Esperando a 1 jugador más...", waitHost: "Esperando al anfitrión...", fetch: "Obteniendo Escenarios...", scenTitle: "Escenario", secLeft: "Segundos Restantes", typeHumour: "Escribe tu humor...", subHumour: "Enviar Humor", waitSlow: "Esperando a los lentos...", chatVote: "Ronda de Chat y Votos", humourBtn: "¡Gracioso!", replyBtn: "Responder", repPlace: "Responder...", send: "Enviar", cancel: "Cancelar", done: "¡Terminé de leer!", waiting: "Esperando...", upcoming: "Próximo", enterRound: "Entrando a la Ronda-", in: "en", seconds: "segundos", load: "Cargando...", results: "Resultados Finales", winners: "Ganadores", winner: "Ganador", scoreboard: "Marcador Final", receipt: "🧾 MATCH RECEIPT", thanks: "¡Gracias por jugar! 🏆", saveRec: "📸 Guardar este recibo", playAgain: "Jugar de nuevo", waitRes: "Esperando al anfitrión...", adminVault: "Bóveda Admin", backHome: "⬅ Volver", noScen: "¡Sin escenarios!" },
  'French': { name: "Votre nom drôle", create: "Créer un Salon", orJoin: "OU REJOINDRE", code: "CODE", join: "Rejoindre", rulebook: "👑 Comment Jouer 👑", rule1: "Écrivez votre réponse humoristique.", rule2: "Répondez avec vos blagues dans le chat.", rule3: "Votez pour ceux que vous trouvez drôles.", rule4: "Le joueur avec le plus d'XP gagne.", submitPub: "🌍 Soumettre un scénario 🌍", pubDesc: "Ajoutez votre propre scénario. Ceux-ci apparaissent aléatoirement aux joueurs optant pour les scénarios publics dans le lobby.", pubPlace: "Tapez votre scénario ici...", submit: "Soumettre", lobby: "Lobby", roomCode: "CODE DU SALON:", cat: "Catégorie:", scen: "Scénarios:", lang: "Langue:", secret: "🤫 Ajouter secrètement !", secPlace: "Écrivez un scénario surprise...", addPool: "Ajouter", totPool: "Total personnalisés:", waitSquad: "En attente de l'équipe...", host: "(Hôte)", launch: "Lancer le jeu 🚀", waitMore: "En attente d'un joueur...", waitHost: "En attente de l'hôte...", fetch: "Récupération...", scenTitle: "Scénario", secLeft: "Secondes", typeHumour: "Tapez votre humour...", subHumour: "Soumettre l'humour", waitSlow: "En attente des humains lents...", chatVote: "Round de Chat & Vote", humourBtn: "Drôle !", replyBtn: "Répondre", repPlace: "Répondre...", send: "Envoyer", cancel: "Annuler", done: "J'ai fini !", waiting: "En attente...", upcoming: "À venir", enterRound: "Entrée au Round-", in: "dans", seconds: "secondes", load: "Chargement...", results: "Résultats Finaux", winners: "Gagnants", winner: "Gagnant", scoreboard: "Tableau de bord", receipt: "🧾 MATCH RECEIPT", thanks: "Merci d'avoir joué ! 🏆", saveRec: "📸 Sauvegarder ce reçu", playAgain: "Rejouer", waitRes: "En attente de l'hôte...", adminVault: "Vue Admin", backHome: "⬅ Retour", noScen: "Pas de scénarios !" },
  'Mandarin': { name: "你的搞笑名字", create: "创建房间", orJoin: "或加入朋友", code: "代码", join: "加入", rulebook: "👑 怎么玩 👑", rule1: "在每个场景上写下你的幽默回应。", rule2: "在聊天回合中回复你的幽默段子。", rule3: "为你觉得好笑的投票。", rule4: "拥有最高幽默XP的玩家获胜。", submitPub: "🌍 提交公开场景 🌍", pubDesc: "添加你自己的幽默场景。这些场景会随机出现给在大厅选择公开场景的玩家。", pubPlace: "在这里输入你的场景...", submit: "提交", lobby: "大厅", roomCode: "房间代码：", cat: "类别：", scen: "场景：", lang: "语言：", secret: "🤫 秘密添加！", secPlace: "写一个惊喜场景...", addPool: "添加到池中", totPool: "自定义场景总数：", waitSquad: "等待队伍...", host: "(房主)", launch: "开始游戏 🚀", waitMore: "等待至少一名玩家...", waitHost: "等待房主开始...", fetch: "获取场景中...", scenTitle: "场景", secLeft: "剩余秒数", typeHumour: "输入你的幽默...", subHumour: "提交", waitSlow: "等待较慢的玩家...", chatVote: "聊天和投票回合", humourBtn: "好笑！", replyBtn: "回复", repPlace: "回复...", send: "发送", cancel: "取消", done: "我读完了！", waiting: "等待中...", upcoming: "即将到来", enterRound: "进入回合-", in: "还有", seconds: "秒", load: "加载中...", results: "最终结果", winners: "赢家", winner: "赢家", scoreboard: "最终记分牌", receipt: "🧾 MATCH RECEIPT", thanks: "感谢游玩！🏆", saveRec: "📸 保存收据", playAgain: "再玩一次", waitRes: "等待房主...", adminVault: "管理员", backHome: "⬅ 返回", noScen: "暂无场景！" },
  'Arabic': { name: "اسمك المضحك", create: "إنشاء غرفة", orJoin: "أو الانضمام", code: "رمز", join: "انضمام", rulebook: "👑 كيف تلعب 👑", rule1: "اكتب ردك المضحك على كل سيناريو.", rule2: "رد بنكاتك في جولة الدردشة.", rule3: "صوت لمن تجده مضحكًا.", rule4: "اللاعب صاحب أعلى نقاط يفوز.", submitPub: "🌍 إرسال سيناريو 🌍", pubDesc: "أضف السيناريو الخاص بك. تظهر هذه بشكل عشوائي للاعبين الذين يختارون السيناريوهات العامة في اللوبي.", pubPlace: "اكتب هنا...", submit: "إرسال", lobby: "اللوبي", roomCode: "رمز الغرفة:", cat: "الفئة:", scen: "السيناريوهات:", lang: "اللغة:", secret: "🤫 أضف سرا!", secPlace: "اكتب مفاجأة...", addPool: "إضافة", totPool: "المجموع:", waitSquad: "في انتظار الفريق...", host: "(مضيف)", launch: "ابدأ اللعبة 🚀", waitMore: "في انتظار لاعب آخر...", waitHost: "في انتظار المضيف...", fetch: "جاري الجلب...", scenTitle: "سيناريو", secLeft: "ثواني", typeHumour: "اكتب نكتتك...", subHumour: "إرسال", waitSlow: "في انتظار الباقين...", chatVote: "الدردشة والتصويت", humourBtn: "مضحك!", replyBtn: "رد", repPlace: "رد...", send: "إرسال", cancel: "إلغاء", done: "انتهيت!", waiting: "انتظار...", upcoming: "القادم", enterRound: "دخول الجولة-", in: "في", seconds: "ثانية", load: "تحميل...", results: "النتائج", winners: "الفائزون", winner: "الفائز", scoreboard: "النقاط", receipt: "🧾 MATCH RECEIPT", thanks: "شكرا للعب! 🏆", saveRec: "📸 حفظ الإيصال", playAgain: "العب مرة أخرى", waitRes: "في انتظار المضيف...", adminVault: "المسؤول", backHome: "⬅ رجوع", noScen: "لا توجد سيناريوهات!" },
  'Portuguese': { name: "Seu Nome Engraçado", create: "Criar Sala", orJoin: "OU ENTRAR", code: "CÓDIGO", join: "Entrar", rulebook: "👑 Como Jogar 👑", rule1: "Escreva sua resposta humorística.", rule2: "Responda no chat após cada cenário.", rule3: "Vote nas mais engraçadas.", rule4: "O jogador com mais XP ganha.", submitPub: "🌍 Enviar Cenário Público 🌍", pubDesc: "Adicione seu próprio cenário. Estes aparecem aleatoriamente para os jogadores que optam por cenários públicos no lobby.", pubPlace: "Digite seu cenário aqui...", submit: "Enviar", lobby: "Lobby", roomCode: "CÓDIGO DA SALA:", cat: "Categoria:", scen: "Cenários:", lang: "Idioma:", secret: "🤫 Adicionar em segredo!", secPlace: "Escreva um cenário surpresa...", addPool: "Adicionar", totPool: "Total de cenários:", waitSquad: "Esperando a equipe...", host: "(Host)", launch: "Lançar Jogo 🚀", waitMore: "Esperando mais 1 jogador...", waitHost: "Esperando o host...", fetch: "Buscando Cenários...", scenTitle: "Cenário", secLeft: "Segundos Restantes", typeHumour: "Digite seu humor...", subHumour: "Enviar Humor", waitSlow: "Esperando os lentos...", chatVote: "Rodada de Chat e Votos", humourBtn: "Engraçado!", replyBtn: "Responder", repPlace: "Responder...", send: "Enviar", cancel: "Cancelar", done: "Terminei de ler!", waiting: "Esperando...", upcoming: "Próximo", enterRound: "Entrando na Rodada-", in: "em", seconds: "segundos", load: "Carregando...", results: "Resultados Finais", winners: "Vencedores", winner: "Vencedor", scoreboard: "Placar Final", receipt: "🧾 MATCH RECEIPT", thanks: "Obrigado por jogar! 🏆", saveRec: "📸 Salvar este recibo", playAgain: "Jogar Novamente", waitRes: "Esperando o host...", adminVault: "Cofre Admin", backHome: "⬅ Voltar", noScen: "Sem cenários!" },
  'German': { name: "Dein lustiger Name", create: "Raum erstellen", orJoin: "ODER BEITRETEN", code: "CODE", join: "Beitreten", rulebook: "👑 Wie man spielt 👑", rule1: "Schreibe deine humorvolle Antwort.", rule2: "Antworte mit Witzen in der Chat-Runde.", rule3: "Stimme für die lustigsten ab.", rule4: "Der Spieler mit den meisten XP gewinnt.", submitPub: "🌍 Szenario einreichen 🌍", pubDesc: "Füge dein eigenes Szenario hinzu. Diese erscheinen zufällig für Spieler, die sich in der Lobby für öffentliche Szenarien entscheiden.", pubPlace: "Tippe dein Szenario hier...", submit: "Einreichen", lobby: "Lobby", roomCode: "RAUMCODE:", cat: "Kategorie:", scen: "Szenarien:", lang: "Sprache:", secret: "🤫 Heimlich hinzufügen!", secPlace: "Schreibe ein Überraschungs-Szenario...", addPool: "Hinzufügen", totPool: "Gesamte eigene Szenarien:", waitSquad: "Warten auf das Team...", host: "(Host)", launch: "Spiel starten 🚀", waitMore: "Warten auf 1 weiteren Spieler...", waitHost: "Warten auf den Host...", fetch: "Lade Szenarien...", scenTitle: "Szenario", secLeft: "Sekunden übrig", typeHumour: "Tippe deinen Humor...", subHumour: "Humor einreichen", waitSlow: "Warten auf die Langsamen...", chatVote: "Chat & Abstimmung", humourBtn: "Witzig!", replyBtn: "Antworten", repPlace: "Antworten...", send: "Senden", cancel: "Abbrechen", done: "Ich bin fertig!", waiting: "Warten...", upcoming: "Kommend", enterRound: "Runde-", in: "in", seconds: "Sekunden", load: "Lädt...", results: "Endergebnisse", winners: "Gewinner", winner: "Gewinner", scoreboard: "Endstand", receipt: "🧾 MATCH RECEIPT", thanks: "Danke fürs Spielen! 🏆", saveRec: "📸 Beleg speichern", playAgain: "Nochmal spielen", waitRes: "Warten auf Host...", adminVault: "Admin-Tresor", backHome: "⬅ Zurück", noScen: "Noch keine Szenarien!" },
  'Japanese': { name: "あなたの面白い名前", create: "ルームを作成", orJoin: "または参加", code: "コード", join: "参加", rulebook: "👑 遊び方 👑", rule1: "各お題に面白い回答を書きます。", rule2: "チャットでジョークを返信します。", rule3: "面白いものに投票します。", rule4: "XPが最も多いプレイヤーの勝ちです。", submitPub: "🌍 公開お題を投稿 🌍", pubDesc: "自分のお題を追加してください。これらは、ロビーで公開お題を選択したプレイヤーにランダムに出題されます。", pubPlace: "ここにお題を入力...", submit: "送信", lobby: "ロビー", roomCode: "ルームコード:", cat: "カテゴリー:", scen: "お題:", lang: "言語:", secret: "🤫 こっそり追加！", secPlace: "サプライズお題を書く...", addPool: "追加", totPool: "カスタムお題の合計:", waitSquad: "チームを待っています...", host: "(ホスト)", launch: "ゲーム開始 🚀", waitMore: "あと1人待っています...", waitHost: "ホストを待っています...", fetch: "お題を取得中...", scenTitle: "お題", secLeft: "残り秒数", typeHumour: "ユーモアを入力...", subHumour: "送信", waitSlow: "他のプレイヤーを待っています...", chatVote: "チャット＆投票", humourBtn: "面白い！", replyBtn: "返信", repPlace: "返信...", send: "送信", cancel: "キャンセル", done: "読み終わりました！", waiting: "待機中...", upcoming: "次", enterRound: "ラウンド-", in: "開始まで", seconds: "秒", load: "ロード中...", results: "最終結果", winners: "勝者", winner: "勝者", scoreboard: "最終スコアボード", receipt: "🧾 MATCH RECEIPT", thanks: "遊んでくれてありがとう！🏆", saveRec: "📸 このレシートを保存", playAgain: "もう一度プレイ", waitRes: "ホストを待っています...", adminVault: "管理者", backHome: "⬅ 戻る", noScen: "まだお題がありません！" },
  'Korean': { name: "재미있는 이름", create: "방 만들기", orJoin: "또는 참가", code: "코드", join: "참가", rulebook: "👑 플레이 방법 👑", rule1: "각 시나리오에 재미있는 답변을 쓰세요.", rule2: "채팅 라운드에서 농담을 주고받으세요.", rule3: "재미있는 것에 투표하세요.", rule4: "가장 많은 XP를 얻은 사람이 승리합니다.", submitPub: "🌍 공개 시나리오 제출 🌍", pubDesc: "나만의 시나리오를 추가하세요. 이 시나리오는 로비에서 공개 시나리오를 선택한 플레이어에게 무작위로 표시됩니다.", pubPlace: "여기에 시나리오를 입력하세요...", submit: "제출", lobby: "로비", roomCode: "방 코드:", cat: "카테고리:", scen: "시나리오:", lang: "언어:", secret: "🤫 몰래 추가하기!", secPlace: "깜짝 시나리오 쓰기...", addPool: "추가", totPool: "총 커스텀 시나리오:", waitSquad: "팀을 기다리는 중...", host: "(방장)", launch: "게임 시작 🚀", waitMore: "1명 더 기다리는 중...", waitHost: "방장을 기다리는 중...", fetch: "시나리오 가져오는 중...", scenTitle: "시나리오", secLeft: "초 남음", typeHumour: "유머를 입력하세요...", subHumour: "제출", waitSlow: "다른 플레이어 기다리는 중...", chatVote: "채팅 및 투표 라운드", humourBtn: "웃겨요!", replyBtn: "답글", repPlace: "답글...", send: "보내기", cancel: "취소", done: "다 읽었어요!", waiting: "대기 중...", upcoming: "다음", enterRound: "라운드-", in: "시작까지", 초: "seconds", load: "로딩 중...", results: "최종 결과", winners: "우승자들", winner: "우승자", scoreboard: "최종 점수판", receipt: "🧾 MATCH RECEIPT", thanks: "플레이해주셔서 감사합니다! 🏆", saveRec: "📸 이 영수증 저장", playAgain: "다시 플레이", waitRes: "방장을 기다리는 중...", adminVault: "관리자 금고", backHome: "⬅ 뒤로", noScen: "아직 시나리오가 없습니다!" },
  'Indonesian': { name: "Nama Lucumu", create: "Buat Ruang", orJoin: "ATAU GABUNG", code: "KODE", join: "Gabung", rulebook: "👑 Cara Bermain 👑", rule1: "Tulis respons lucumu.", rule2: "Balas dengan candaan di ronde obrolan.", rule3: "Pilih yang menurutmu lucu.", rule4: "Pemain dengan XP terbanyak menang.", submitPub: "🌍 Kirim Skenario 🌍", pubDesc: "Tambahkan skenariomu sendiri. Ini akan muncul secara acak kepada pemain yang memilih skenario publik di lobi.", pubPlace: "Ketik skenariomu di sini...", submit: "Kirim", lobby: "Lobi", roomCode: "KODE RUANG:", cat: "Kategori:", scen: "Skenario:", lang: "Bahasa:", secret: "🤫 Tambah diam-diam!", secPlace: "Tulis skenario kejutan...", addPool: "Tambah", totPool: "Total Skenario Khusus:", waitSquad: "Menunggu skuad...", host: "(Host)", launch: "Mulai Game 🚀", waitMore: "Menunggu 1 pemain lagi...", waitHost: "Menunggu host...", fetch: "Mengambil Skenario...", scenTitle: "Skenario", secLeft: "Detik Tersisa", typeHumour: "Ketik lucumu...", subHumour: "Kirim Kelucuan", waitSlow: "Menunggu yang lambat...", chatVote: "Ronde Obrolan & Pilih", humourBtn: "Lucu!", replyBtn: "Balas", repPlace: "Balas...", send: "Kirim", cancel: "Batal", done: "Saya Selesai Membaca!", waiting: "Menunggu...", upcoming: "Mendatang", enterRound: "Masuk Ronde-", in: "dalam", seconds: "detik", load: "Memuat...", results: "Hasil Akhir", winners: "Pemenang", winner: "Pemenang", scoreboard: "Papan Skor", receipt: "🧾 MATCH RECEIPT", thanks: "Terima kasih sudah bermain! 🏆", saveRec: "📸 Simpan struk ini", playAgain: "Main Lagi", waitRes: "Menunggu Host...", adminVault: "Brankas Admin", backHome: "⬅ Kembali", noScen: "Belum ada skenario!" },
  'Russian': { name: "Твое смешное имя", create: "Создать комнату", orJoin: "ИЛИ ПРИСОЕДИНИТЬСЯ", code: "КОД", join: "Вход", rulebook: "👑 Как играть 👑", rule1: "Напиши смешной ответ на сценарий.", rule2: "Отвечай шутками в чате.", rule3: "Голосуй за самые смешные.", rule4: "Игрок с наибольшим XP побеждает.", submitPub: "🌍 Предложить сценарий 🌍", pubDesc: "Добавь свой сценарий для игры. Они случайным образом выпадают игрокам, выбравшим публичные сценарии в лобби.", pubPlace: "Введи свой сценарий здесь...", submit: "Отправить", lobby: "Лобби", roomCode: "КОД КОМНАТЫ:", cat: "Категория:", scen: "Сценарии:", lang: "Язык:", secret: "🤫 Добавить тайно!", secPlace: "Напиши сценарий-сюрприз...", addPool: "Добавить", totPool: "Всего сценариев:", waitSquad: "Ждем команду...", host: "(Хост)", launch: "Запуск 🚀", waitMore: "Ждем еще 1 игрока...", waitHost: "Ждем хоста...", fetch: "Получение...", scenTitle: "Сценарий", secLeft: "Секунд осталось", typeHumour: "Введи шутку...", subHumour: "Отправить", waitSlow: "Ждем остальных...", chatVote: "Чат и Голосование", humourBtn: "Смешно!", replyBtn: "Ответить", repPlace: "Ответить...", send: "Отправить", cancel: "Отмена", done: "Я прочитал!", waiting: "Ожидание...", upcoming: "Следующий", enterRound: "Начало раунда-", in: "через", seconds: "секунд", load: "Загрузка...", results: "Результаты", winners: "Победители", winner: "Победитель", scoreboard: "Счет", receipt: "🧾 MATCH RECEIPT", thanks: "Спасибо за игру! 🏆", saveRec: "📸 Сохранить этот чек", playAgain: "Играть снова", waitRes: "Ждем хоста...", adminVault: "Хранилище Админа", backHome: "⬅ Назад", noScen: "Нет сценариев!" }
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

function App() {
  const [appLang, setAppLang] = useState('English'); 
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [room, setRoom] = useState(null);

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const [pubScenario, setPubScenario] = useState('');
  const [pubLang, setPubLang] = useState('English');
  const [pubCategory, setPubCategory] = useState('All Ages');
  const [pubStatus, setPubStatus] = useState(null); 
  const [secretInput, setSecretInput] = useState(''); 
  
  const [showVault, setShowVault] = useState(false);
  const [vaultData, setVaultData] = useState([]);
  const [logoClicks, setLogoClicks] = useState(0); 

  const [isAdminMode, setIsAdminMode] = useState(false);
  const [seedingStats, setSeedingStats] = useState({});
  const [adminPublicScenarios, setAdminPublicScenarios] = useState([]);
  const [adminKey, setAdminKey] = useState('');

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

  const [pubCooldown, setPubCooldown] = useState(0);

  // TICKING COOLDOWN TIMER FOR PUBLIC SUBMISSIONS
  useEffect(() => {
    let timer;
    if (pubCooldown > 0) {
      timer = setInterval(() => {
        setPubCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pubCooldown]);
  
  // DONATION LINK
  const KOFI_LINK = "https://ko-fi.com/arpitsrivstva"; 

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
      if (!pwd) return;

      socket.emit('verifyAdmin', pwd, (res) => {
        if (res.success) {
          playSound('win');
          setAdminKey(pwd);
          setIsAdminMode(true);
          refreshStats(pwd);
        } else {
          playSound('alert');
          alert("Access Denied: Incorrect Passcode");
        }
      });
    }
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

  const isHost = room?.players[0]?.id === socket.id;
  const rainEmojis = ['😂', '🤣', '💀', '🏆', '🔥', '🌶️', '👽', '🦄', '🍻', '😆', '😁', '🫠', '😭', '🤟'];

  return (
    <div onClick={unlockAudio} style={styles.appWrapper}>
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap');
      @import url('https://cdn.jsdelivr.net/npm/@fontsource/libertinus-serif@5.0.8/index.css');

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

        @keyframes slideDown { 
          from { opacity: 0; transform: translateY(-10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }

      `}</style>

      {!room && !showVault && !isAdminMode && (
        <div style={styles.translateWrapper}>
          <span style={{fontSize: '16px'}}>🌐</span>
          <select value={appLang} onChange={(e) => setAppLang(e.target.value)} style={styles.translateSelect}>
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

      <audio ref={audioRef} src={BGM_TRACKS[bgmIndex]} loop />

      <div style={{...styles.container, paddingBottom: '100px'}}>
         <img src="/finale-logo.png" alt="Humour Cup Logo" className="animated-logo-main" onClick={handleLogoClick} />

        {/* --- VIEW: ADMIN DASHBOARD --- */}
        {isAdminMode && !room && (
          <div style={{width: '100%', maxWidth: '600px', backgroundColor: '#fff', padding: '30px', borderRadius: '16px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a', marginBottom: '40px'}}>
            <h2 style={styles.phaseTitle}>🌱 SEEDING DATA</h2>
            <div style={{display: 'flex', gap: '10px', marginBottom: '30px'}}>
               <button onClick={() => refreshStats()} className="btn-3d" style={{...styles.secondaryBtn, flex: 1, backgroundColor: '#10b981', color: '#fff'}}>🔄 REFRESH</button>
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

                <button 
                  onClick={handlePublicSubmit} 
                  disabled={pubStatus?.type === 'loading' || pubCooldown > 0} 
                  className="btn-3d" 
                  style={{
                    ...styles.primaryBtn, 
                    padding: '18px', 
                    fontSize: '16px',
                    backgroundColor: pubCooldown > 0 ? '#ccc' : '#ffffff',
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

            {/* --- THE NEW DIVIDER LINE --- */}
            <div style={{ 
                width: '50%', 
                height: '4px', 
                backgroundColor: '#1a1a1a', 
                marginTop: '60px', 
                marginBottom: '10px',
                marginInline: 'auto',
                borderRadius: '10px', 
                opacity: '0.6' 
            }}></div>

            {/* --- THE COFFEE BUTTON BOX (Tilted) --- */}
            <div style={{...styles.devCardGreen, transform: 'rotate(-2deg)', marginTop: '40px'}}>
               <a href={KOFI_LINK} target="_blank" rel="noreferrer" className="btn-3d" style={{...styles.donateBtn, background: '#6F4E37', color: '#ffffff', marginTop: '0', padding: '12px 24px', fontSize: '15px'}}>
                 ☕ Buy the Developer a Coffee
               </a>
               <p style={styles.indieDevText}>
                 This indie dev needs to handle server, moderations and maintenance 🥺. A lil help can boost me up for my ideaz&nbsp;💙.
               </p>
            </div>

            {/* --- THE OVAL FEEDBACK BOX (Flat / No Rotation) --- */}
            <div style={{...styles.devCardOval, marginTop: '45px'}}>
               <p style={styles.feedbackText}>
                 How the heck should I make this game more fun? Tell me everything&nbsp;at
               </p>
               <a href="mailto:qaylingames@gmail.com" className="btn-3d" style={styles.emailLink}>qaylingames@gmail.com 💌</a>
            </div>

            {/* --- NEW: ABOUT THE GAME SECTION (FOR ADSENSE SEO) --- */}
            {/* --- INTERACTIVE "ABOUT THE GAME" DROPDOWN --- */}
            <div style={{ width: '100%', marginTop: '40px' }}>
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
                <span>🤔 What is Humour Cup?</span>
                <span style={{ 
                  transform: isAboutOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                  transition: 'transform 0.3s ease' 
                }}>
                  ▼
                </span>
              </button>

              {isAboutOpen && (
                <div style={{
                  width: '100%', 
                  backgroundColor: '#ffffff', 
                  border: '4px solid #1a1a1a', 
                  borderTop: 'none', 
                  borderRadius: '0 0 16px 16px', 
                  padding: '30px', 
                  textAlign: 'left', 
                  color: '#1a1a1a', 
                  boxShadow: '6px 6px 0px #1a1a1a',
                  animation: 'slideDown 0.3s ease-out'
                }}>
                  <p style={styles.aboutText}>
                    Welcome to Humour Cup, the ultimate real-time multiplayer comedy game where your wit wins the crown! Whether you are hanging out with friends at a party, taking a break with coworkers, or just looking for a fun online activity, Humour Cup provides endless entertainment.
                  </p>
                  <p style={styles.aboutText}>
                    <strong>How It Works:</strong><br/>
                    The game is simple but highly addictive. The host creates a secure room and shares a unique 4-digit code with friends. Once everyone joins the lobby, the server generates hilarious, completely unique scenarios—ranging from absurd hypothetical questions and daily life awkwardness to weird text messages and meme-worthy situations.
                  </p>
                  <p style={styles.aboutText}>
                    Players have a limited time to type their funniest, most creative responses. But the fun doesn't stop there! In the Chat & Vote Phase, players can reply to each other's jokes with even more punchlines. You earn Humour XP by getting votes from your friends. The player with the most XP at the end of the rounds takes home the legendary Humour Cup!
                  </p>
                  <p style={{ ...styles.aboutText, marginBottom: 0 }}>
                    <strong>Features:</strong><br/>
                    - <strong>Dynamic AI Scenarios:</strong> Powered by advanced AI, you will never play the exact same game twice.<br/>
                    - <strong>Custom Prompts:</strong> Have an inside joke? Secretly add your own custom scenarios to the game pool.<br/>
                    - <strong>Global Languages:</strong> Play in English, Hindi, Spanish, French, Mandarin, and more!<br/>
                    - <strong>Family Friendly or 18+:</strong> Choose the category that fits your squad's vibe.<br/><br/>
                    Join thousands of players and spark your humour today. Create a room, share the code, and let the comedy battle begin!
                  </p>
                </div>
              )}
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
              
              <div style={{ 
                  width: '50%', 
                  height: '4px', 
                  backgroundColor: '#1a1a1a', 
                  marginTop: '60px', 
                  marginBottom: '10px',
                  marginInline: 'auto',
                  borderRadius: '10px', 
                  opacity: '0.6' 
              }}></div>

              <div style={{...styles.devCardGreen, transform: 'rotate(-2deg)', marginTop: '40px'}}>
                 <a href={KOFI_LINK} target="_blank" rel="noreferrer" className="btn-3d" style={{...styles.donateBtn, background: '#6F4E37', color: '#ffffff', marginTop: '0', padding: '12px 24px', fontSize: '15px'}}>
                   ☕ Buy the Developer a Coffee
                 </a>
                 <p style={styles.indieDevText}>
                   This indie dev needs to handle server, moderations and maintenance 🥺. A lil help can boost me up for my ideaz&nbsp;💙.
                 </p>
              </div>

              <div style={{...styles.devCardOval, marginTop: '45px'}}>
                 <p style={styles.feedbackText}>
                   How the heck should I make this game more fun? Tell me everything&nbsp;at
                 </p>
                 <a href="mailto:qaylingames@gmail.com" className="btn-3d" style={styles.emailLink}>qaylingames@gmail.com 💌</a>
              </div>

            </>
          );
        })()}
      </div>

      {/* --- THE FOOTER SIGNATURE --- */}
      <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '0',
          width: '100%',
          textAlign: 'center', 
          fontSize: '0.7rem', 
          color: '#ffffff', 
          opacity: '0.9',
          fontWeight: '500',
          fontFamily: '"Libertinus Serif", serif'
      }}>
          ⚡ made by <a 
              href="https://arpitsrivstva.itch.io/" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                  color: '#ffffff', 
                  fontWeight: '500', 
                  fontSize: '0.7rem',
                  textDecoration: 'none',
                  borderBottom: '0.5px solid #ffffff',
                  paddingBottom: '1px'
              }}
          >
              Arpit Srivastava
          </a> to spark your humour ⚡

          {/* --- NEW LEGAL LINKS FOR ADSENSE --- */}
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '0.65rem' }}>
              <a href="https://docs.google.com/document/d/1FVv1pg7i2pnXE0zk6HZv5IZWThJGsS_XV1gzckZkMeM/edit?usp=sharing" style={{ color: '#fff', textDecoration: 'underline' }}>Privacy Policy</a>
              <a href="https://docs.google.com/document/d/1ZupAWubSYr8X57gRgJjf-88GLmbrDaGS2GIe1IJ59xQ/edit?usp=sharing" style={{ color: '#fff', textDecoration: 'underline' }}>Terms of Service</a>
              <a href="mailto:qaylingames@gmail.com" style={{ color: '#fff', textDecoration: 'underline' }}>Contact Us</a>
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
    justifyContent: 'center', 
    position: 'relative', 
    backgroundColor: '#FFC200', 
    overflowX: 'hidden', 
    boxSizing: 'border-box',
    paddingBottom: '40px' // Increased padding so content doesn't hit the expanded footer
  }, 
  howToPlayBox: { marginTop: '40px', width: '100%', backgroundColor: '#ffffff', border: '4px solid #1a1a1a', borderRadius: '16px', boxShadow: '6px 6px 0px #1a1a1a', overflow: 'hidden', transform: 'rotate(-1.5deg)' },
  howToPlayHeader: { backgroundColor: '#1a1a1a', color: '#FFC200', padding: '12px', fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center' },
  howToPlayContent: { padding: '25px', textAlign: 'left' },
  howToPlayText: { fontSize: '15px', color: '#1a1a1a', marginBottom: '15px', fontWeight: '800', lineHeight: '1.6', display: 'flex', alignItems: 'flex-start', gap: '8px' },
  bullet: { color: '#10b981', fontSize: '16px' }, 
  
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
  translateWrapper: { position: 'fixed', top: '15px', left: '15px', zIndex: 10000, display: 'flex', alignItems: 'center', gap: '4px', background: '#fff', padding: '6px 10px', borderRadius: '50px', border: '3px solid #1a1a1a', boxShadow: '2px 2px 0px #1a1a1a' },
  translateSelect: { border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', fontWeight: '900', color: '#1a1a1a', cursor: 'pointer' },
  donateBtn: { display: 'inline-block', background: '#ff5e5b', color: '#ffffff', padding: '15px 30px', borderRadius: '50px', border: '4px solid #1a1a1a', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '6px 6px 0px #1a1a1a', textDecoration: 'none', marginTop: '40px' },
  
  devCardGreen: { background: '#10b981', padding: '25px', borderRadius: '16px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a', width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  indieDevText: { fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#ffffff', fontWeight: 'bold', lineHeight: '1.5', margin: '5px 0 0 0' },
  devCardOval: { background: '#e5e7eb', padding: '30px 40px', borderRadius: '100px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #ef4444', width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
  feedbackText: { fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#1a1a1a', fontWeight: 'bold', margin: '0', lineHeight: '1.4' },
  emailLink: { fontFamily: "'Kalam', cursive", color: '#ffffff', background: '#ef4444', padding: '8px 16px', borderRadius: '12px', border: '3px solid #1a1a1a', textDecoration: 'none', fontWeight: '900', fontSize: '15px', margin: '0', boxShadow: '4px 4px 0px #1a1a1a', display: 'inline-block' },

  aboutCard: { background: '#ffffff', padding: '30px', borderRadius: '16px', border: '4px solid #1a1a1a', boxShadow: '8px 8px 0px #1a1a1a', width: '100%', marginTop: '40px', textAlign: 'left', color: '#1a1a1a' },
  aboutTitle: { fontFamily: "'Kalam', cursive", fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', borderBottom: '3px solid #1a1a1a', paddingBottom: '10px', marginBottom: '15px', marginTop: 0 },
  aboutText: { fontSize: '15px', fontWeight: '500', lineHeight: '1.6', marginBottom: '15px' }
};

export default App;