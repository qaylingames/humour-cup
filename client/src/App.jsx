import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://humour-cup-server.onrender.com');

const uiTranslations = {
  'English': { 
    name: "Your Funny Name", create: "Create Room", createGold: "Create GOLD Room!", orJoin: "OR JOIN A FRIEND", code: "CODE", join: "Join", rulebook: "👑 How to Play 👑", rule1: "Write your humorous response on each scenario.", rule2: "Reply with your humour punches in the chat round after each scenario.", rule3: "Vote the ones you find humorous.", rule4: "The player with the maximum Humour XP gets the Humour Cup.", 
    submitPub: "🌍 Submit your humorous Scenarios for Humour Cup players 🌍", pubDesc: "These come randomly to Humour Cup players opting for Public scenarios in the Lobby.", pubPlace: "Type your custom scenario here...", submit: "Submit", lobby: "Lobby", roomCode: "ROOM CODE:", cat: "Category:", scen: "Scenarios:", lang: "Language:", secret: "🤫 Secretly Add to the Game Mix!", secPlace: "Write a surprise scenario...", addPool: "Add to Pool", totPool: "Total Custom Scenarios in Pool:", addCustomAlso: "Add your custom humorous scenarios to the Public scenario box below as well, if suitable.", waitSquad: "Waiting for the squad...", host: "(Host)", launch: "Launch Game 🚀", waitMore: "Waiting for at least 1 more player...", waitHost: "Waiting for the host to start...", fetch: "Fetching Scenarios...", scenTitle: "Scenario", secLeft: "Seconds Left", typeHumour: "Type your humour...", subHumour: "Submit Humour", waitSlow: "Waiting for slower humans...", chatVote: "Chat & Vote Round", humourBtn: "Humorous!", replyBtn: "Reply", repPlace: "Reply...", send: "Send", cancel: "Cancel", done: "I'm Done Reading!", waiting: "Waiting...", upcoming: "Upcoming", enterRound: "Entering Round-", in: "in", seconds: "seconds", load: "Loading...", results: "Final Results", winners: "Winners", winner: "Winner", scoreboard: "Final Scoreboard", receipt: "🧾 MATCH RECEIPT", thanks: "Thanks for playing Humour Cup! 🏆", saveRec: "📸 Save this Match Receipt", playAgain: "Play Again (Host)", waitRes: "Waiting for Host to Restart...", adminVault: "Admin Vault View", backHome: "⬅ Back to Home", noScen: "No scenarios yet!", madeBy: "⚡made by ", toSpark: " to spark your humour⚡", privacy: "Privacy Policy", terms: "Terms of Service", contact: "Contact Us",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "This indie developer needs to handle server, moderations and maintenance. Donations keep Humour Cup and my ideaz - alive.💙", 
    feedbackText: "How the heck should I make this game more fun? Tell me everything at", chatInst: "Tap 'Humorous' to the funny responses of each other.", whatIsHC: "🤔 What is Humour Cup?",
    donateClarify: "Buy Humour Cup GOLD for some extra perks. Or please support me by donating here. 🙏🏻", customAmt: "Enter amount", emailPlace: "Enter your email address...", payRazor: "Pay via Razorpay", payPaddle: "Pay via Paddle (Global)", payUpi: "Pay via UPI ID (India)",
    goldTitle: "🏆 Humour Cup GOLD", goldSub: "More than 1 Room cannot be created from the same Fun Key at the same time.",
    gPerk2: "Custom Number of Rounds & Timers", gPerk3: "More Humorous A.I. Scenarios", gPerk4: "Prioritized Best Selected A.I. and Public Scenarios", gPerk5: "Change scenarios while playing", gPerk6: "100% Ad-Free Experience", gPerk7: "Official Supporter of Humour Cup 💙",
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
  'Hindi': { 
    name: "आपका मज़ेदार नाम", create: "रूम बनाएं", createGold: "गोल्ड रूम बनाएं!", orJoin: "या दोस्त से जुड़ें", code: "कोड", join: "जुड़ें", rulebook: "👑 कैसे खेलें 👑", rule1: "प्रत्येक परिदृश्य पर अपनी मज़ेदार प्रतिक्रिया लिखें।", rule2: "परिदृश्य के बाद चैट राउंड में अपने हास्य का जवाब दें।", rule3: "जो आपको मज़ेदार लगें, उन्हें वोट दें।", rule4: "सबसे अधिक ह्यूमर XP वाले खिलाड़ी को ह्यूमर कप मिलता है।", submitPub: "🌍 ह्यूमर कप खिलाड़ियों के लिए अपने मज़ेदार परिदृश्य जमा करें 🌍", pubDesc: "ये लॉबी में सार्वजनिक परिदृश्य चुनने वाले ह्यूमर कप खिलाड़ियों को बेतरतीब ढंग से आते हैं।", pubPlace: "अपना कस्टम परिदृश्य यहां टाइप करें...", submit: "जमा करें", lobby: "लॉबी", roomCode: "रूम कोड:", cat: "श्रेणी:", scen: "परिदृश्य:", lang: "भाषा:", secret: "🤫 चुपके से गेम में जोड़ें!", secPlace: "एक परिदृश्य लिखें...", addPool: "पूल में जोड़ें", totPool: "पूल में कुल कस्टम परिदृश्य:", addCustomAlso: "यदि उपयुक्त हो, तो कृपया अपने कस्टम मज़ेदार परिदृश्यों को नीचे दिए गए सार्वजनिक परिदृश्य बॉक्स में भी जोड़ें।", waitSquad: "स्क्वाड की प्रतीक्षा में...", host: "(होस्ट)", launch: "गेम शुरू करें 🚀", waitMore: "1 और खिलाड़ी की प्रतीक्षा में...", waitHost: "होस्ट के शुरू करने की प्रतीक्षा में...", fetch: "परिदृश्य प्राप्त कर रहा है...", scenTitle: "परिदृश्य", secLeft: "सेकंड शेष", typeHumour: "अपना हास्य टाइप करें...", subHumour: "हास्य जमा करें", waitSlow: "धीमे इंसानों की प्रतीक्षा में...", chatVote: "चैट और वोट राउंड", humourBtn: "मज़ेदार!", replyBtn: "उत्तर दें", repPlace: "उत्तर...", send: "भेजें", cancel: "रद्द करें", done: "पढ़ना समाप्त कर लिया!", waiting: "प्रतीक्षा में...", upcoming: "आगामी", enterRound: "राउंड-", in: "में प्रवेश", seconds: "सेकंड में", load: "लोड हो रहा है...", results: "अंतिम परिणाम", winners: "विजेता", winner: "विजेता", scoreboard: "अंतिम स्कोरबोर्ड", receipt: "🧾 MATCH RECEIPT", thanks: "खेलने के लिए धन्यवाद! 🏆", saveRec: "📸 यह रसीद सहेजें", playAgain: "फिर से खेलें (होस्ट)", waitRes: "होस्ट की प्रतीक्षा में...", adminVault: "एडमिन वॉल्ट", backHome: "⬅ वापस", noScen: "कोई परिदृश्य नहीं!", madeBy: "⚡निर्माता ", toSpark: " आपके हास्य को जगाने के लिए⚡", privacy: "गोपनीयता नीति", terms: "सेवा की शर्तें", contact: "संपर्क करें",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "इस इंडी डेवलपर को सर्वर, मॉडरेशन और रखरखाव संभालना होता है। आपके डोनेशन (दान) ह्यूमर कप और मेरे आइडियाज़ को ज़िंदा रखते हैं। 💙", 
    feedbackText: "मैं इस गेम को और मज़ेदार कैसे बनाऊं? मुझे सब कुछ यहां बताएं", chatInst: "एक-दूसरे के मज़ेदार जवाबों पर 'मज़ेदार!' टैप करें।", whatIsHC: "🤔 ह्यूमर कप क्या है?",
    donateClarify: "कुछ अतिरिक्त अनुलाभों के लिए ह्यूमर कप GOLD खरीदें। या कृपया यहाँ दान करके मेरा समर्थन करें। 🙏🏻", customAmt: "राशि दर्ज करें", emailPlace: "अपना ईमेल पता दर्ज करें...", payRazor: "Razorpay से भुगतान करें", payPaddle: "Paddle से भुगतान करें (वैश्विक)", payUpi: "UPI से भुगतान करें (भारत)",
    goldTitle: "🏆 ह्यूमर कप गोल्ड", goldSub: "एक ही समय में एक ही फन की (Fun Key) से 1 से अधिक रूम नहीं बनाए जा सकते।",
    gPerk2: "कस्टम राउंड और कस्टम टाइमर", gPerk3: "अधिक मज़ेदार A.I. परिदृश्य", gPerk4: "आपके लिए प्राथमिकता वाले सर्वश्रेष्ठ A.I. और सार्वजनिक परिदृश्य", gPerk5: "खेलते समय परिदृश्य बदलें", gPerk6: "100% विज्ञापन-मुक्त अनुभव", gPerk7: "ह्यूमर कप के आधिकारिक समर्थक 💙",
    gInput: "पहले से ही Fun Key है? इसे यहां दर्ज करें...", gInstruction: "तुरंत ईमेल पर अपनी Fun Key पाने के लिए GOLD खरीदें!", gActive: "फन की सक्रिय। अब गोल्ड रूम बनाएं।",
    ab1: "ह्यूमर कप में आपका स्वागत है! यह परम रीयल-टाइम मल्टीप्लेयर हास्य प्रतियोगिता है जहां आपकी बुद्धि ताज जीतती है! चाहे आप पार्टी में अपने उबाऊ दोस्तों के साथ हों, अपने नकली सहकर्मियों के साथ ब्रेक ले रहे हों, या बस OnlyFans जैसी मज़ेदार ऑनलाइन गतिविधि (लेकिन टेक्स्ट संस्करण lol) की तलाश में हों - ह्यूमर कप उस अंतहीन मनोरंजन के लिए एकदम सही है। 😼",
    ab2: "इसे असल में कैसे खेलें?:",
    ab3: "आप अपनी तीखी बुद्धि का प्रयोग करें और अन्य वोट करेंगे कि उन्हें यह मज़ेदार लगा या नहीं। आप हर परिदृश्य के बाद दूसरों के साथ अपनी मज़ेदार टिप्पणियों से मुकाबला करते हैं। सबसे मज़ेदार प्रतिक्रिया तथाकथित - ह्यूमर कप जीतती है। 🏆 आप यादें इकट्ठा करने के लिए अंत में खेले गए गेम को सभी के साथ सहेज भी सकते हैं।",
    ab4: "गेमप्ले को और अधिक विस्तार से बताने के लिए: आप हर राउंड में अपने बुद्धि IQ के साथ परिदृश्यों का जवाब देते हैं। 🧠 और हर परिदृश्य के बाद, आप सबसे मज़ेदार प्रतिक्रियाओं के लिए वोट करते हैं और दूसरों के वोट के माध्यम से ह्यूमर XP अर्जित करने के लिए चैट और वोट चरण में अपनी मज़ेदार टिप्पणियों के माध्यम से लड़ाई करते हैं। ⚔️ स्कोरबोर्ड के शीर्ष पर रहने वाला अंत में ह्यूमर कप जीतता है। 🏆🥇",
    ab5: "चरण दर चरण स्पष्टीकरण: होस्ट एक सुरक्षित कमरा बनाता है और एक 4-अंकीय कोड साझा करता है जिसे आप अपने दोस्तों को दे सकते हैं ताकि वे अजीबोगरीब नामों से जुड़ सकें जिससे किसी को पता न चले कि कौन कौन है - पूर्ण गुमनामी। 😈 कमरा बनाने के बाद जब सभी लॉबी में शामिल हो जाते हैं, तो वे चुन सकते हैं कि वे दिए गए विभिन्न विकल्पों के माध्यम से कैसे खेलना चाहते हैं, और आपको बिगाड़ने के लिए उनमें से बहुत सारे हैं। सर्वर होस्ट (जिसने कमरा बनाया है) द्वारा चुने गए विकल्पों के अनुसार काम करता है।",
    ab6: "यदि आप A.I. चुनते हैं, तो हास्यास्पद परिदृश्य A.I. द्वारा बेतरतीब ढंग से उत्पन्न किए जाएंगे - बेतुके सवालों से लेकर मीम-योग्य स्थितियों तक। 🤖",
    ab7: "यदि आप Public चुनते हैं, तो परिदृश्य वैश्विक स्तर पर खिलाड़ियों द्वारा 'सार्वजनिक परिदृश्य' बॉक्स में दर्ज किए गए परिदृश्यों से आएंगे। जाओ और वहां अपने कुछ मज़ेदार परिदृश्य दर्ज करो। अभी! 😠",
    ab8: "Custom विकल्प सबसे प्रफुल्लित करने वाला है। यह लॉबी में मौजूद सभी लोगों को अपने गेम के लिए बेनामी रूप से अपने स्वयं के परिदृश्य दर्ज करने की स्वतंत्रता देता है। 🤫",
    ab9: "सावधान रहें, खेल सरल लेकिन अत्यधिक व्यसनी है। बाद में शिकायत मत करना कि मैंने चेतावनी नहीं दी जब आपको टेक्स्ट नेक सिंड्रोम (Text Neck Syndrome) हो जाए। आप इसे सर्च करेंगे, है ना? 😏",
    ab10: "ह्यूमर कप इतना शानदार क्यों है? ❤️‍🔥 :",
    ab11: "डायनामिक एआई परिदृश्य: उन्नत एआई द्वारा संचालित, आप कभी भी एक ही खेल दो बार खेलने जैसा महसूस नहीं करेंगे।",
    ab12: "खिलाड़ियों के लिए अपने परिदृश्य जमा करें: क्या आपके पास एक चुटकुला है? तो अपने परिदृश्यों को 'सार्वजनिक परिदृश्य' बॉक्स में जोड़ें।",
    ab13: "अपने स्वयं के परिदृश्य बनाएं: लॉबी के कस्टम विकल्प में, आप सभी गुमनाम रूप से कोई भी परिदृश्य लिख सकते हैं।",
    ab14: "वैश्विक भाषाएँ: अंग्रेजी, हिंदी, स्पेनिश, फ्रेंच, मंदारिन और अन्य जैसी दुनिया की कुछ सबसे हॉट भाषाओं में खेलें!",
    ab15: "पारिवारिक या 18+: वह श्रेणी चुनें जो आपके स्क्वाड के अनुकूल हो।",
    ab16: "आज ही अपने हास्य का परीक्षण करें। अपने दोस्तों के बीच अपनी हास्य रैंक का पता लगाएं। एक कमरा बनाएं, दोस्तों के साथ कोड साझा करें, और हास्य की लड़ाई शुरू होने दें!"
  },
  'Spanish': { 
    name: "Tu Nombre Divertido", create: "Crear Sala", createGold: "¡Crear Sala GOLD!", orJoin: "O UNIRSE A UN AMIGO", code: "CÓDIGO", join: "Unirse", rulebook: "👑 Cómo Jugar 👑", rule1: "Escribe tu respuesta humorística en cada escenario.", rule2: "Responde con tus chistes en la ronda de chat.", rule3: "Vota los que te parezcan graciosos.", rule4: "El jugador con más XP gana la Copa.", submitPub: "🌍 Envía tus Escenarios para Humour Cup 🌍", pubDesc: "Estos aparecen aleatoriamente a los jugadores de Humour Cup que optan por escenarios Públicos en el Vestíbulo.", pubPlace: "Escribe tu escenario aquí...", submit: "Enviar", lobby: "Vestíbulo", roomCode: "CÓDIGO DE SALA:", cat: "Categoría:", scen: "Escenarios:", lang: "Idioma:", secret: "🤫 ¡Añadir en secreto!", secPlace: "Escribe un escenario sorpresa...", addPool: "Añadir", totPool: "Total de Escenarios Personalizados:", addCustomAlso: "Añade también tus escenarios a la caja de escenarios Públicos de abajo, si son adecuados.", waitSquad: "Esperando al equipo...", host: "(Anfitrión)", launch: "Lanzar Juego 🚀", waitMore: "Esperando a 1 jugador más...", waitHost: "Esperando al anfitrión...", fetch: "Obteniendo Escenarios...", scenTitle: "Escenario", secLeft: "Segundos Restantes", typeHumour: "Escribe tu humor...", subHumour: "Enviar Humor", waitSlow: "Esperando a los lentos...", chatVote: "Ronda de Chat y Votos", humourBtn: "¡Gracioso!", replyBtn: "Responder", repPlace: "Responder...", send: "Enviar", cancel: "Cancelar", done: "¡Terminé de leer!", waiting: "Esperando...", upcoming: "Próximo", enterRound: "Entrando a la Ronda-", in: "en", seconds: "segundos", load: "Cargando...", results: "Resultados Finales", winners: "Ganadores", winner: "Ganador", scoreboard: "Marcador Final", receipt: "🧾 MATCH RECEIPT", thanks: "¡Gracias por jugar! 🏆", saveRec: "📸 Guardar este recibo", playAgain: "Jugar de nuevo", waitRes: "Esperando al anfitrión...", adminVault: "Bóveda Admin", backHome: "⬅ Volver", noScen: "¡Sin escenarios!", madeBy: "⚡creado por ", toSpark: " para despertar tu humor⚡", privacy: "Política de Privacidad", terms: "Términos de Servicio", contact: "Contáctanos",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "Este desarrollador indie tiene que gestionar servidores, moderación y mantenimiento. Las donaciones mantienen vivos a Humour Cup y mis ideas. 💙", 
    feedbackText: "¿Cómo diablos hago este juego más divertido? Cuéntamelo todo en", chatInst: "Toca '¡Gracioso!' en las respuestas divertidas de los demás.", whatIsHC: "🤔 ¿Qué es Humour Cup?",
    donateClarify: "Compra Humour Cup GOLD para obtener ventajas adicionales. O apóyame donando aquí. 🙏🏻", customAmt: "Cantidad", emailPlace: "Tu correo electrónico...", payRazor: "Pagar vía Razorpay", payPaddle: "Pagar vía Paddle (Global)", payUpi: "Pagar vía UPI (India)",
    goldTitle: "🏆 Humour Cup GOLD", goldSub: "No se puede crear más de 1 Sala al mismo tiempo con esta Fun Key.",
    gPerk2: "Número de rondas y temporizadores personalizados", gPerk3: "Escenarios A.I. más humorísticos", gPerk4: "Mejores escenarios A.I. y Públicos priorizados para ti", gPerk5: "Cambiar escenarios mientras juegas", gPerk6: "Experiencia 100% sin anuncios", gPerk7: "Colaborador oficial de Humour Cup 💙",
    gInput: "¿Ya tienes una clave? Introdúcela aquí...", gInstruction: "¡Compra GOLD para recibir tu Fun Key por correo!", gActive: "Fun Key activada. Crea una Sala GOLD ahora.",
    ab1: "¡Bienvenido a Humour Cup, el juego de competición de humor multijugador en tiempo real donde tu ingenio gana la corona! Ya sea que estés pasando el rato con amigos aburridos, en un descanso con tus falsos compañeros de trabajo, o buscando una actividad divertida como OnlyFans pero en versión texto lol - Humour Cup es perfecto para ese entretenimiento sin fin. 😼",
    ab2: "¿Cómo jugar a esta mi*rda?:",
    ab3: "Ingresas tus agudas respuestas y los demás votan si les parece gracioso. Luchas con tus comentarios humorísticos después de cada escenario. El más gracioso gana la llamada - Humour Cup.🏆 También puedes guardar el juego al final para coleccionar recuerdos.",
    ab4: "Para detallar más la jugabilidad: Respondes a los escenarios en cada ronda con tu coeficiente intelectual de ingenio.🧠 Y después de cada Escenario, votas por las respuestas más divertidas y luchas a través de tus comentarios en una Fase de Chat y Voto para ganar Humour XPs a través de los votos de los demás.⚔️ El que esté en la cima del marcador gana la Humour Cup al final.🏆🥇",
    ab5: "Explicación paso a paso: El anfitrión crea una sala segura y comparte un código de 4 dígitos para unirse con nombres locos para anonimato total.😈 El servidor funciona según las opciones seleccionadas por el Anfitrión.",
    ab6: "Si seleccionas A.I., los escenarios humorísticos serán generados aleatoriamente por la IA.🤖",
    ab7: "Si seleccionas Público, los escenarios serán generados a partir de los ingresados globalmente en la caja. ¡Ve a ingresar algunos de tus escenarios divertidos ahí. ¡Ahora!😠",
    ab8: "La opción Personalizada es la más divertida. Les da a todos la libertad de ingresar sus propios escenarios para el juego (anónimamente🤫).",
    ab9: "Cuidado, el juego es simple pero altamente adictivo. No te quejes más tarde de que no te advertí cuando tengas el Síndrome de Cuello de Texto.😏",
    ab10: "¿Por qué Humour Cup es brutal?❤️‍🔥 :",
    ab11: "Escenarios Dinámicos de IA: Impulsado por IA avanzada, nunca jugarás el mismo juego dos veces.",
    ab12: "Envía tus Escenarios para jugadores de Humour Cup: ¿Tienes un chiste interno? Añade tus propios escenarios a la caja.",
    ab13: "Crea tus propios Escenarios en Humour Cup: En la opción Personalizada, todos pueden escribir cualquier escenario anónimamente.",
    ab14: "Idiomas Globales: ¡Juega en algunos de los idiomas más populares del mundo!",
    ab15: "Familiar o 18+: Elige la categoría que se adapte al ambiente de tu equipo.",
    ab16: "Pon a prueba tu humor hoy. Descubre tu rango de humor entre tus amigos. ¡Crea una sala y deja que comience la batalla del humor!"
  },
  'French': { 
    name: "Votre nom drôle", create: "Créer un Salon", createGold: "Créer un Salon GOLD!", orJoin: "OU REJOINDRE", code: "CODE", join: "Rejoindre", rulebook: "👑 Comment Jouer 👑", rule1: "Écrivez votre réponse humoristique.", rule2: "Répondez avec vos blagues dans le chat.", rule3: "Votez pour ceux que vous trouvez drôles.", rule4: "Le joueur avec le plus d'XP gagne.", submitPub: "🌍 Soumettez vos Scénarios pour Humour Cup 🌍", pubDesc: "Ceux-ci apparaissent aléatoirement aux joueurs optant pour les scénarios Publics dans le Lobby.", pubPlace: "Tapez votre scénario ici...", submit: "Soumettre", lobby: "Lobby", roomCode: "CODE DU SALON:", cat: "Catégorie:", scen: "Scénarios:", lang: "Langue:", secret: "🤫 Ajouter secrètement !", secPlace: "Écrivez un scénario surprise...", addPool: "Ajouter", totPool: "Total personnalisés:", addCustomAlso: "Ajoutez également vos scénarios dans la boîte de scénario Public ci-dessous, si approprié.", waitSquad: "En attente de l'équipe...", host: "(Hôte)", launch: "Lancer le jeu 🚀", waitMore: "En attente d'un joueur...", waitHost: "En attente de l'hôte...", fetch: "Récupération...", scenTitle: "Scénario", secLeft: "Secondes", typeHumour: "Tapez votre humour...", subHumour: "Soumettre l'humour", waitSlow: "En attente des humains lents...", chatVote: "Round de Chat & Vote", humourBtn: "Drôle !", replyBtn: "Répondre", repPlace: "Répondre...", send: "Envoyer", cancel: "Annuler", done: "J'ai fini !", waiting: "En attente...", upcoming: "À venir", enterRound: "Entrée au Round-", in: "dans", seconds: "secondes", load: "Chargement...", results: "Résultats Finaux", winners: "Gagnants", winner: "Gagnant", scoreboard: "Tableau de bord", receipt: "🧾 MATCH RECEIPT", thanks: "Merci d'avoir joué ! 🏆", saveRec: "📸 Sauvegarder ce reçu", playAgain: "Rejouer", waitRes: "En attente de l'hôte...", adminVault: "Vue Admin", backHome: "⬅ Retour", noScen: "Pas de scénarios !", madeBy: "⚡créé par ", toSpark: " pour éveiller votre humour⚡", privacy: "Politique de confidentialité", terms: "Conditions d'utilisation", contact: "Nous contacter",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "Ce développeur indé doit gérer les serveurs, la modération et la maintenance. Les dons maintiennent Humour Cup et mes idées en vie. 💙", 
    feedbackText: "Comment diable puis-je rendre ce jeu plus amusant ? Dites-moi tout à", chatInst: "Appuyez sur 'Drôle !' sur les réponses amusantes des autres.", whatIsHC: "🤔 Qu'est-ce que Humour Cup ?",
    donateClarify: "Achetez Humour Cup GOLD pour des avantages supplémentaires. Ou soutenez-moi en faisant un don ici. 🙏🏻", customAmt: "Montant", emailPlace: "Votre adresse e-mail...", payRazor: "Payer via Razorpay", payPaddle: "Payer via Paddle (Global)", payUpi: "Payer via UPI (Inde)",
    goldTitle: "🏆 Humour Cup GOLD", goldSub: "Plus d'un salon ne peut pas être créé avec cette Fun Key en même temps.",
    gPerk2: "Nombre de rounds et minuteries personnalisés", gPerk3: "Scénarios A.I. plus humoristiques", gPerk4: "Meilleurs scénarios A.I. et Publics classés par ordre de priorité", gPerk5: "Changer de scénario en jouant", gPerk6: "100% sans publicité", gPerk7: "Supporter officiel de Humour Cup 💙",
    gInput: "Vous avez déjà une clé ? Entrez-la ici...", gInstruction: "Achetez GOLD pour recevoir votre Fun Key par e-mail !", gActive: "Fun Key activée. Créez un salon GOLD maintenant.",
    ab1: "Bienvenue dans Humour Cup, l'ultime jeu de compétition d'humour multijoueur en temps réel où votre esprit gagne la couronne ! Que vous traîniez avec vos amis ennuyeux, preniez une pause avec vos faux collègues, ou cherchiez simplement une activité amusante en ligne comme OnlyFans mais en version texte lol - Humour Cup est parfait pour ce divertissement sans fin. 😼",
    ab2: "Comment vraiment jouer à ce truc ?:",
    ab3: "Vous entrez votre esprit vif et les autres votent s'ils le trouvent humoristique. Vous vous battez avec vos commentaires humoristiques après chaque scénario avec d'autres. Le plus humoristique gagne la soi-disant - Humour Cup.🏆 Vous pouvez également enregistrer la partie jouée à la fin, pour collectionner des souvenirs.",
    ab4: "Pour élaborer davantage le gameplay : Vous répondez aux scénarios à chaque tour avec votre QI d'esprit.🧠 Et après chaque Scénario, vous votez pour les réponses les plus humoristiques et vous vous battez à travers vos commentaires dans une phase de discussion et de vote pour gagner des XP Humour.⚔️ Celui en haut du tableau de bord gagne la Humour Cup à la fin.🏆🥇",
    ab5: "Explication étape par étape : L'hôte crée une salle sécurisée et partage un code unique à 4 chiffres pour que personne ne sache qui est qui - anonymat total.😈 Une fois que tout le monde a rejoint le lobby, ils peuvent sélectionner comment ils veulent jouer grâce aux différentes options données. Le serveur fonctionne selon les options sélectionnées par l'Hôte.",
    ab6: "Si vous sélectionnez A.I., alors les scénarios humoristiques seront générés aléatoirement par l'IA allant de questions hypothétiques absurdes à des situations dignes de mèmes.🤖",
    ab7: "Si vous sélectionnez Public, les scénarios seront générés à partir de ceux saisis par les joueurs mondialement. Allez y entrer quelques-uns de vos scénarios amusants. Maintenant !😠",
    ab8: "L'option Personnalisée (Custom) est la plus hilarante. Elle vous donne à tous la liberté de saisir vos propres scénarios pour votre jeu (anonymement🤫).",
    ab9: "Attention, le jeu est simple mais très addictif. Ne vous plaignez pas plus tard que je ne vous ai pas prévenu du Syndrome du Cou de Texte. Vous chercheriez ça, n'est-ce pas ?😏",
    ab10: "Pourquoi Humour Cup est génial ?❤️‍🔥 :",
    ab11: "Scénarios IA dynamiques : Propulsé par une IA avancée, vous ne jouerez jamais deux fois au même jeu.",
    ab12: "Soumettez vos Scénarios pour les joueurs : Vous avez une blague d'initié ? - Alors ajoutez vos propres scénarios à la boîte.",
    ab13: "Créez vos propres Scénarios : Dans l'option Personnalisée, vous pouvez tous écrire des scénarios anonymement.",
    ab14: "Langues Mondiales : Jouez dans certaines des langues les plus chaudes du monde comme l'Anglais, l'Hindi, l'Espagnol, le Français, le Mandarin, et plus !",
    ab15: "Familial ou 18+ : Choisissez la catégorie qui correspond à l'ambiance de votre groupe. Vous êtes libre de jouer comme vous le souhaitez.",
    ab16: "Testez votre humour aujourd'hui. Découvrez votre classement d'humour parmi vos amis. Créez une salle, partagez le code, et que la bataille d'humour commence !"
  },
  'Mandarin': { 
    name: "你的搞笑名字", create: "创建房间", createGold: "创建黄金房间！", orJoin: "或加入朋友", code: "代码", join: "加入", rulebook: "👑 怎么玩 👑", rule1: "在每个场景上写下你的幽默回应。", rule2: "在聊天回合中回复你的幽默段子。", rule3: "为你觉得好笑的投票。", rule4: "拥有最高幽默XP的玩家获胜。", submitPub: "🌍 为Humour Cup玩家提交你的幽默场景 🌍", pubDesc: "这些场景会随机出现给在大厅选择公开场景的Humour Cup玩家。", pubPlace: "在这里输入你的场景...", submit: "提交", lobby: "大厅", roomCode: "房间代码：", cat: "类别：", scen: "场景：", lang: "语言：", secret: "🤫 秘密添加！", secPlace: "写一个惊喜场景...", addPool: "添加到池中", totPool: "自定义场景总数：", addCustomAlso: "如果合适的话，也将您的自定义幽默场景添加到下方的公开场景框中。", waitSquad: "等待队伍...", host: "(房主)", launch: "开始游戏 🚀", waitMore: "等待至少一名玩家...", waitHost: "等待房主开始...", fetch: "获取场景中...", scenTitle: "场景", secLeft: "剩余秒数", typeHumour: "输入你的幽默...", subHumour: "提交", waitSlow: "等待较慢的玩家...", chatVote: "聊天和投票回合", humourBtn: "好笑！", replyBtn: "回复", repPlace: "回复...", send: "发送", cancel: "取消", done: "我读完了！", waiting: "等待中...", upcoming: "即将到来", enterRound: "进入回合-", in: "还有", seconds: "秒", load: "加载中...", results: "最终结果", winners: "赢家", winner: "赢家", scoreboard: "最终记分牌", receipt: "🧾 MATCH RECEIPT", thanks: "感谢游玩！🏆", saveRec: "📸 保存收据", playAgain: "再玩一次", waitRes: "等待房主...", adminVault: "管理员", backHome: "⬅ 返回", noScen: "暂无场景！", madeBy: "⚡由 ", toSpark: " 制作，点燃你的幽默⚡", privacy: "隐私政策", terms: "服务条款", contact: "联系我们",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "这个独立开发者需要处理服务器、审核和维护。捐款能让 Humour Cup 和我的灵感存活下去。💙", 
    feedbackText: "我到底该怎么让这游戏更好玩？在这里告诉我一切", chatInst: "点击其他人搞笑回答旁边的“好笑！”。", whatIsHC: "🤔 什么是 Humour Cup？",
    donateClarify: "购买 Humour Cup GOLD 以获得额外特权。或者请在这里捐赠来支持我。🙏🏻", customAmt: "输入金额", emailPlace: "您的电子邮件地址...", payRazor: "通过 Razorpay 支付", payPaddle: "通过 Paddle 支付 (全球)", payUpi: "通过 UPI 支付 (印度)",
    goldTitle: "🏆 Humour Cup 黄金版", goldSub: "不能同时使用此Fun Key创建超过1个房间。",
    gPerk2: "自定义回合数和计时器", gPerk3: "更幽默的AI场景", gPerk4: "为您优先推荐最佳的AI和公共场景", gPerk5: "在游玩时更改场景", gPerk6: "100%无广告体验", gPerk7: "Humour Cup 官方支持者 💙",
    gInput: "已有密钥？在此输入...", gInstruction: "购买 GOLD 后，您的 Fun Key 将立即发送到您的邮箱！", gActive: "Fun Key已激活。现在创建黄金房间。",
    ab1: "欢迎来到Humour Cup，这是一个终极实时多人幽默竞技游戏，你的机智将为你赢得王冠！无论你是和无聊的朋友在聚会上消磨时间，还是和虚伪的同事休息，或者只是寻找像文字版OnlyFans一样有趣的在线活动，哈哈 - Humour Cup 正适合那种无尽的娱乐。😼",
    ab2: "这游戏到底怎么玩？：",
    ab3: "你输入机智的回答，其他人觉得搞笑就会投票。在每个场景后，你会和其他人通过搞笑评论进行交锋。最搞笑的人赢得所谓的 - Humour Cup。🏆 游戏结束时你还可以保存和大家一起玩的游戏，作为美好回忆。",
    ab4: "详细玩法：你在每轮中用你的智商回应场景。🧠 在每个场景后，你为最搞笑的回答投票，并在聊天投票阶段通过你的搞笑评论与其他玩家对战，赚取Humour XP。⚔️ 最终积分榜榜首赢得Humour Cup。🏆🥇",
    ab5: "分步解释：房主创建一个安全的房间并分享一个4位数的代码，你可以把代码给朋友，让他们用疯狂的名字加入，这样没人知道谁是谁 - 完全匿名。😈 所有人加入大厅后，可以选择怎么玩。服务器将根据房主选择的选项运行。",
    ab6: "如果选择A.I.，幽默场景将由AI随机生成，从荒谬的假设问题到日常尴尬，再到奇怪的短信和梗图般的状况。🤖",
    ab7: "如果选择Public，场景将随机从全球玩家提交的“为Humour Cup玩家提交你的幽默场景”框中生成。去那里写几个你觉得好笑的场景吧。现在就去！😠",
    ab8: "Custom（自定义）选项是最搞笑的。它给了大厅里所有人自由输入自己场景的权利（匿名🤫）。",
    ab9: "注意，游戏很简单但很容易上瘾。不要以后抱怨我没警告过你会得“短信脖”（Text Neck Syndrome）。你会去搜这个的，对吧？😏",
    ab10: "为什么Humour Cup这么燃？❤️‍🔥 :",
    ab11: "动态AI场景：由先进的AI驱动，你永远不会感觉在玩两次完全相同的游戏。",
    ab12: "提交你的场景：有个内部梗？那就把你自己的场景添加到框中。",
    ab13: "创建你自己的场景：在自定义选项中，你们都可以匿名写下任何场景。",
    ab14: "全球语言：支持世界上最热门的语言，如英语、印地语、西班牙语、法语、中文等！",
    ab15: "全年龄或18禁：选择适合你们团队氛围的类别。随你怎么玩，随你怎么写。",
    ab16: "今天就来测试你的幽默感。看看你在朋友中的幽默排名。创建房间，分享代码，让幽默对决开始吧！"
  },
  'Arabic': { 
    name: "اسمك المضحك", create: "إنشاء غرفة", createGold: "إنشاء غرفة GOLD!", orJoin: "أو الانضمام", code: "رمز", join: "انضمام", rulebook: "👑 كيف تلعب 👑", rule1: "اكتب ردك المضحك على كل سيناريو.", rule2: "رد بنكاتك في جولة الدردشة.", rule3: "صوت لمن تجده مضحكًا.", rule4: "اللاعب صاحب أعلى نقاط يفوز.", submitPub: "🌍 أرسل سيناريوهاتك المضحكة للاعبي Humour Cup 🌍", pubDesc: "تظهر هذه السيناريوهات عشوائيًا للاعبي Humour Cup الذين يختارون السيناريوهات العامة في اللوبي.", pubPlace: "اكتب هنا...", submit: "إرسال", lobby: "اللوبي", roomCode: "رمز الغرفة:", cat: "الفئة:", scen: "السيناريوهات:", lang: "اللغة:", secret: "🤫 أضف سرا!", secPlace: "اكتب مفاجأة...", addPool: "إضافة", totPool: "المجموع:", addCustomAlso: "أضف سيناريوهاتك المضحكة المخصصة إلى مربع السيناريو العام أدناه أيضًا ، إذا كانت مناسبة.", waitSquad: "في انتظار الفريق...", host: "(مضيف)", launch: "ابدأ اللعبة 🚀", waitMore: "في انتظار لاعب آخر...", waitHost: "في انتظار المضيف...", fetch: "جاري الجلب...", scenTitle: "سيناريو", secLeft: "ثواني", typeHumour: "اكتب نكتتك...", subHumour: "إرسال", waitSlow: "في انتظار الباقين...", chatVote: "الدردشة والتصويت", humourBtn: "مضحك!", replyBtn: "رد", repPlace: "رد...", send: "إرسال", cancel: "إلغاء", done: "انتهيت!", waiting: "انتظار...", upcoming: "القادم", enterRound: "دخول الجولة-", in: "في", seconds: "ثانية", load: "تحميل...", results: "النتائج", winners: "الفائزون", winner: "الفائز", scoreboard: "النقاط", receipt: "🧾 MATCH RECEIPT", thanks: "شكرا للعب! 🏆", saveRec: "📸 حفظ الإيصال", playAgain: "العب مرة أخرى", waitRes: "في انتظار المضيف...", adminVault: "المسؤول", backHome: "⬅ رجوع", noScen: "لا توجد سيناريوهات!", madeBy: "⚡صنع بواسطة ", toSpark: " لإشعال حس الفكاهة لديك⚡", privacy: "سياسة الخصوصية", terms: "شروط الخدمة", contact: "اتصل بنا",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "يحتاج هذا المطور المستقل إلى التعامل مع الخوادم والإشراف والصيانة. التبرعات تبقي Humour Cup وأفكاري على قيد الحياة. 💙", 
    feedbackText: "كيف بحق الجحيم أجعل هذه اللعبة أكثر متعة؟ أخبرني بكل شيء على", chatInst: "انقر على 'مضحك!' للردود المضحكة للآخرين.", whatIsHC: "🤔 ما هو Humour Cup؟",
    donateClarify: "اشترِ Humour Cup GOLD للحصول على بعض الامتيازات الإضافية. أو يرجى دعمي بالتبرع هنا. 🙏🏻", customAmt: "المبلغ", emailPlace: "أدخل بريدك الإلكتروني...", payRazor: "ادفع عبر Razorpay", payPaddle: "ادفع عبر Paddle (عالمي)", payUpi: "ادفع عبر UPI (الهند)",
    goldTitle: "🏆 Humour Cup GOLD", goldSub: "لا يمكن إنشاء أكثر من غرفة واحدة باستخدام مفتاح المرح هذا في نفس الوقت.",
    gPerk2: "عدد جولات ومؤقتات مخصصة", gPerk3: "سيناريوهات ذكاء اصطناعي أكثر فكاهة", gPerk4: "أفضل سيناريوهات الذكاء الاصطناعي والعامة ذات الأولوية لك", gPerk5: "تغيير السيناريوهات أثناء اللعب", gPerk6: "تجربة خالية من الإعلانات 100%", gPerk7: "داعم رسمي لـ Humour Cup 💙",
    gInput: "هل لديك مفتاح بالفعل؟ أدخله هنا...", gInstruction: "اشتر GOLD للحصول على مفتاح المرح الخاص بك عبر البريد الإلكتروني على الفور!", gActive: "تم تفعيل مفتاح المرح. قم بإنشاء غرفة GOLD الآن.",
    ab1: "مرحبًا بك في Humour Cup، لعبة مسابقة الكوميديا الجماعية في الوقت الفعلي حيث يفوز ذكاؤك بالتاج! سواء كنت تتسكع مع أصدقائك المملين في حفلة، أو تأخذ استراحة مع زملائك المزيفين في العمل، أو تبحث فقط عن نشاط ممتع عبر الإنترنت مثل OnlyFans ولكن بنسخة نصية هههه - Humour Cup مناسب تمامًا لهذا الترفيه اللامتناهي. 😼",
    ab2: "كيف تلعب هذا الشيء حقًا؟:",
    ab3: "أنت تدخل ذكائك الحاد ويصوت الآخرون إذا وجدوه مضحكًا. أنت تقاتل بتعليقاتك المضحكة بعد كل سيناريو مع الآخرين. الشخص الأكثر إضحاكًا يفوز بما يسمى - Humour Cup. 🏆 يمكنك أيضًا حفظ اللعبة التي لعبتها مع الجميع في النهاية لجمع الذكريات.",
    ab4: "لتفصيل طريقة اللعب أكثر: أنت ترد على السيناريوهات في كل جولة بمعدل ذكائك. 🧠 وبعد كل سيناريو، تصوت للردود الأكثر إضحاكًا وتقاتل من خلال تعليقاتك في مرحلة الدردشة والتصويت لكسب Humour XP من خلال أصوات الآخرين. ⚔️ من يتصدر لوحة النتائج يفوز بكأس Humour Cup في النهاية. 🏆🥇",
    ab5: "شرح خطوة بخطوة: ينشئ المضيف غرفة آمنة ويشارك رمزًا فريدًا مكونًا من 4 أرقام يمكنك إعطاؤه لأصدقائك للانضمام بأسماء مجنونة حتى لا يعرف أحد من هو من - إخفاء هوية تام. 😈 بمجرد انضمام الجميع إلى اللوبي، يمكنهم تحديد الطريقة التي يريدون اللعب بها. يعمل الخادم وفقًا للخيارات التي حددها المضيف.",
    ab6: "إذا اخترت A.I.، فسيتم إنشاء السيناريوهات بشكل عشوائي بواسطة الذكاء الاصطناعي بدءًا من الأسئلة الافتراضية السخيفة إلى المواقف الغريبة. 🤖",
    ab7: "إذا حددت عام، فسيتم إنشاء السيناريوهات عشوائيًا من السيناريوهات التي أدخلها اللاعبون عالميًا. اذهب وأدخل بعض السيناريوهات المضحكة هناك. الآن! 😠",
    ab8: "يعد الخيار المخصص هو الخيار الأكثر إمتاعًا. إنه يمنحكم جميعًا الحرية في إدخال السيناريوهات الخاصة بكم (بشكل مجهول 🤫).",
    ab9: "احذر، اللعبة بسيطة ولكنها تسبب الإدمان بشدة. لا تشتكي لاحقًا من أنني لم أحذرك عندما تصاب بمتلازمة نص الرقبة (Text Neck Syndrome). سوف تبحث عن ذلك، أليس كذلك؟ 😏",
    ab10: "لماذا Humour Cup رائع؟ ❤️‍🔥 :",
    ab11: "سيناريوهات ذكاء اصطناعي ديناميكية: مدعوم بذكاء اصطناعي متقدم، لن تشعر أبدًا أنك تلعب نفس اللعبة مرتين.",
    ab12: "أرسل سيناريوهاتك: هل لديك نكتة داخلية؟ - إذن أضف سيناريوهاتك الخاصة.",
    ab13: "اصنع سيناريوهاتك الخاصة: في الخيار المخصص، يمكنكم جميعًا كتابة أي سيناريوهات بشكل مجهول.",
    ab14: "لغات عالمية: العب بأكثر اللغات شيوعًا مثل الإنجليزية، الهندية، الإسبانية والمزيد!",
    ab15: "ملائم للعائلة أو 18+: اختر الفئة التي تناسب أجواء فريقك.",
    ab16: "اختبر حس الفكاهة لديك اليوم. اكتشف ترتيبك في الفكاهة بين أصدقائك. أنشئ غرفة ودع معركة الفكاهة تبدأ!"
  },
  'Portuguese': { 
    name: "Seu Nome Engraçado", create: "Criar Sala", createGold: "Criar Sala GOLD!", orJoin: "OU ENTRAR", code: "CÓDIGO", join: "Entrar", rulebook: "👑 Como Jogar 👑", rule1: "Escreva sua resposta humorística.", rule2: "Responda no chat após cada cenário.", rule3: "Vote nas mais engraçadas.", rule4: "O jogador com mais XP ganha.", submitPub: "🌍 Envie seus Cenários para o Humour Cup 🌍", pubDesc: "Estes aparecem aleatoriamente para os jogadores do Humour Cup que optam por cenários Públicos no Lobby.", pubPlace: "Digite seu cenário aqui...", submit: "Enviar", lobby: "Lobby", roomCode: "CÓDIGO DA SALA:", cat: "Categoria:", scen: "Cenários:", lang: "Idioma:", secret: "🤫 Adicionar em segredo!", secPlace: "Escreva um cenário surpresa...", addPool: "Adicionar", totPool: "Total de cenários:", addCustomAlso: "Adicione também seus cenários à caixa de cenário Público abaixo, se adequado.", waitSquad: "Esperando a equipe...", host: "(Host)", launch: "Lançar Jogo 🚀", waitMore: "Esperando mais 1 jogador...", waitHost: "Esperando o host...", fetch: "Buscando Cenários...", scenTitle: "Cenário", secLeft: "Segundos Restantes", typeHumour: "Digite seu humor...", subHumour: "Enviar Humor", waitSlow: "Esperando os lentos...", chatVote: "Rodada de Chat e Votos", humourBtn: "Engraçado!", replyBtn: "Responder", repPlace: "Responder...", send: "Enviar", cancel: "Cancelar", done: "Terminei de ler!", waiting: "Esperando...", upcoming: "Próximo", enterRound: "Entrando na Rodada-", in: "em", seconds: "segundos", load: "Carregando...", results: "Resultados Finais", winners: "Vencedores", winner: "Vencedor", scoreboard: "Placar Final", receipt: "🧾 MATCH RECEIPT", thanks: "Obrigado por jogar! 🏆", saveRec: "📸 Salvar este recibo", playAgain: "Jogar Novamente", waitRes: "Esperando o host...", adminVault: "Cofre Admin", backHome: "⬅ Voltar", noScen: "Sem cenários!", madeBy: "⚡criado por ", toSpark: " para despertar seu humor⚡", privacy: "Política de Privacidade", terms: "Termos de Serviço", contact: "Contate-Nos",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "Este desenvolvedor indie precisa lidar com servidores, moderação e manutenção. As doações mantêm o Humour Cup e minhas ideias vivos. 💙", 
    feedbackText: "Como diabos eu deixo esse jogo mais divertido? Me conte tudo em", chatInst: "Toque em 'Engraçado!' nas respostas divertidas dos outros.", whatIsHC: "🤔 O que é o Humour Cup?",
    donateClarify: "Compre o Humour Cup GOLD para obter vantagens extras. Ou, por favor, me apoie doando aqui. 🙏🏻", customAmt: "Valor", emailPlace: "Seu endereço de e-mail...", payRazor: "Pagar via Razorpay", payPaddle: "Pagar via Paddle (Global)", payUpi: "Pagar via UPI (Índia)",
    goldTitle: "🏆 Humour Cup GOLD", goldSub: "Não é possível criar mais de 1 Sala com esta Fun Key ao mesmo tempo.",
    gPerk2: "Rodadas e Temporizadores Personalizados", gPerk3: "Cenários de I.A. mais hilários", gPerk4: "Os melhores cenários de I.A. e Públicos priorizados", gPerk5: "Mudar cenários durante o jogo", gPerk6: "100% Sem Anúncios", gPerk7: "Apoiador Oficial do Humour Cup 💙",
    gInput: "Já tem uma chave? Insira aqui...", gInstruction: "Compre GOLD para receber sua Fun Key por e-mail instantaneamente!", gActive: "Fun Key ativada. Crie uma Sala GOLD agora.",
    ab1: "Bem-vindo ao Humour Cup, o melhor jogo de competição de humor multijogador em tempo real, onde sua inteligência vence a coroa! Esteja você saindo com seus amigos chatos em uma festa, fazendo uma pausa com seus falsos colegas de trabalho ou apenas procurando por uma atividade online divertida como o OnlyFans, mas em versão de texto, rs - Humour Cup é ideal para esse entretenimento sem fim. 😼",
    ab2: "Como jogar essa p*rra realmente?:",
    ab3: "Você insere sua sagacidade e os outros votam se acham engraçado. Você batalha com seus comentários humorísticos após cada cenário com os outros. O mais bem humorado ganha a chamada - Humour Cup.🏆 Você também pode salvar o jogo no final para guardar memórias.",
    ab4: "Para elaborar mais a jogabilidade: Você responde aos cenários em cada rodada com o seu QI de humor.🧠 E após cada Cenário, você vota nas respostas mais bem humoradas e batalha através dos seus comentários em uma Fase de Chat para ganhar Humour XPs.⚔️ Quem estiver no topo ganha a Taça.🏆🥇",
    ab5: "Explicação passo a passo: O anfitrião cria uma sala e compartilha um código de 4 dígitos para anonimato total.😈 O servidor funciona com base nas opções selecionadas pelo Host.",
    ab6: "Se você selecionar A.I., os cenários humorísticos serão gerados aleatoriamente pela I.A. 🤖",
    ab7: "Se você selecionar Public, os cenários serão gerados a partir daqueles inseridos pelos jogadores globalmente. Vá inserir os seus! 😠",
    ab8: "A opção Custom é a mais hilária. Dá a todos a liberdade de entrar com seus próprios cenários anonimamente.🤫",
    ab9: "Cuidado, o jogo é simples, mas altamente viciante. Cuidado com a Síndrome do Pescoço de Texto. Você vai pesquisar isso, né? 😏",
    ab10: "Por que Humour Cup é f*da?❤️‍🔥 :",
    ab11: "Cenários Dinâmicos: Desenvolvido por IA avançada, você nunca jogará o mesmo jogo duas vezes.",
    ab12: "Envie seus Cenários: Adicione seus próprios cenários à caixa Pública.",
    ab13: "Crie seus próprios Cenários: Na opção Custom, todos podem escrever cenários anonimamente.",
    ab14: "Idiomas Globais: Jogue nos idiomas mais populares do mundo!",
    ab15: "Family Friendly ou 18+: Escolha a categoria que combina com a sua equipe.",
    ab16: "Teste seu humor hoje. Crie uma sala, compartilhe o código e que a batalha comece!"
  },
  'German': { 
    name: "Dein lustiger Name", create: "Raum erstellen", createGold: "GOLD Raum erstellen!", orJoin: "ODER BEITRETEN", code: "CODE", join: "Beitreten", rulebook: "👑 Wie man spielt 👑", rule1: "Schreibe deine humorvolle Antwort.", rule2: "Antworte mit Witzen in der Chat-Runde.", rule3: "Stimme für die lustigsten ab.", rule4: "Der Spieler mit den meisten XP gewinnt.", submitPub: "🌍 Reiche deine Szenarien für Humour Cup ein 🌍", pubDesc: "Diese erscheinen zufällig für Humour Cup-Spieler, die sich in der Lobby für öffentliche Szenarien entscheiden.", pubPlace: "Tippe dein Szenario hier...", submit: "Einreichen", lobby: "Lobby", roomCode: "RAUMCODE:", cat: "Kategorie:", scen: "Szenarien:", lang: "Sprache:", secret: "🤫 Heimlich hinzufügen!", secPlace: "Schreibe ein Überraschungs-Szenario...", addPool: "Hinzufügen", totPool: "Gesamte eigene Szenarien:", addCustomAlso: "Fügen Sie Ihre Szenarien nach Möglichkeit auch der Box für öffentliche Szenarien unten hinzu.", waitSquad: "Warten auf das Team...", host: "(Host)", launch: "Spiel starten 🚀", waitMore: "Warten auf 1 weiteren Spieler...", waitHost: "Warten auf den Host...", fetch: "Lade Szenarien...", scenTitle: "Szenario", secLeft: "Sekunden übrig", typeHumour: "Tippe deinen Humor...", subHumour: "Humor einreichen", waitSlow: "Warten auf die Langsamen...", chatVote: "Chat & Abstimmung", humourBtn: "Witzig!", replyBtn: "Antworten", repPlace: "Antworten...", send: "Senden", cancel: "Abbrechen", done: "Ich bin fertig!", waiting: "Warten...", upcoming: "Kommend", enterRound: "Runde-", in: "in", seconds: "Sekunden", load: "Lädt...", results: "Endergebnisse", winners: "Gewinner", winner: "Gewinner", scoreboard: "Endstand", receipt: "🧾 MATCH RECEIPT", thanks: "Danke fürs Spielen! 🏆", saveRec: "📸 Beleg speichern", playAgain: "Nochmal spielen", waitRes: "Warten auf Host...", adminVault: "Admin-Tresor", backHome: "⬅ Zurück", noScen: "Noch keine Szenarien!", madeBy: "⚡erstellt von ", toSpark: " um deinen Humor zu wecken⚡", privacy: "Datenschutzrichtlinie", terms: "Nutzungsbedingungen", contact: "Kontaktiere uns",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "Dieser Indie-Entwickler muss sich um Server, Moderation und Wartung kümmern. Spenden halten Humour Cup und meine Ideen am Leben. 💙", 
    feedbackText: "Wie zum Teufel mache ich dieses Spiel spaßiger? Sag mir alles unter", chatInst: "Tippe bei den lustigen Antworten der anderen auf 'Witzig!'.", whatIsHC: "🤔 Was ist der Humour Cup?",
    donateClarify: "Kaufe Humour Cup GOLD für einige zusätzliche Vorteile. Oder unterstütze mich bitte, indem du hier spendest. 🙏🏻", customAmt: "Betrag", emailPlace: "Deine E-Mail-Adresse...", payRazor: "Mit Razorpay bezahlen", payPaddle: "Mit Paddle bezahlen (Global)", payUpi: "Mit UPI bezahlen (Indien)",
    goldTitle: "🏆 Humour Cup GOLD", goldSub: "Es kann nicht mehr als 1 Raum gleichzeitig mit diesem Fun Key erstellt werden.",
    gPerk2: "Benutzerdefinierte Runden & Timer", gPerk3: "Noch witzigere KI-Szenarien", gPerk4: "Beste KI- & Public-Szenarien priorisiert", gPerk5: "Szenarien während des Spiels ändern", gPerk6: "100% Werbefrei", gPerk7: "Offizieller Supporter 💙",
    gInput: "Hast du schon einen Key? Hier eingeben...", gInstruction: "Kaufe GOLD, um deinen Fun Key sofort per E-Mail zu erhalten!", gActive: "Fun Key aktiviert. Erstelle jetzt einen GOLD Raum.",
    ab1: "Willkommen beim Humour Cup, dem ultimativen Echtzeit-Multiplayer-Humor-Wettbewerbsspiel, bei dem dein Witz die Krone gewinnt! Ob du nun auf einer Party mit deinen langweiligen Freunden abrumhängst, eine Pause mit deinen falschen Arbeitskollegen machst oder einfach nur eine spaßige Online-Aktivität suchst wie OnlyFans, aber als Textversion lol - Humour Cup ist genau richtig für diese endlose Unterhaltung. 😼",
    ab2: "Wie spielt man diesen Mist wirklich?:",
    ab3: "Du gibst deinen scharfen Verstand ein und die anderen stimmen ab. Du kämpfst mit deinen Kommentaren gegen andere. Der Humorvollste gewinnt den Humour Cup.🏆 Du kannst am Ende auch das gespielte Spiel speichern.",
    ab4: "Um das Gameplay genauer zu erklären: Du reagierst auf die Szenarien in jeder Runde mit deinem Witz-IQ.🧠 Du kämpfst in einer Chat- und Abstimmungsphase mit deinen humorvollen Kommentaren.⚔️ Der Erste gewinnt den Humour Cup.🏆🥇",
    ab5: "Schritt für Schritt Erklärung: Der Host erstellt einen sicheren Raum und teilt einen 4-stelligen Code. Totale Anonymität.😈 Der Server arbeitet nach den vom Host ausgewählten Optionen.",
    ab6: "Wenn du A.I. wählst, werden die humorvollen Szenarien zufällig von der KI generiert.🤖",
    ab7: "Wenn du Public wählst, werden die Szenarien aus den von Spielern weltweit eingegebenen Szenarien generiert. Trag dort jetzt deine lustigen Szenarien ein!😠",
    ab8: "Die Custom-Option ist die lustigste. Jeder gibt anonym eigene Szenarien ein.🤫",
    ab9: "Achtung, extrem süchtig machend. Beschwer dich später nicht über das Text-Nacken-Syndrom. Du googelst das jetzt, oder?😏",
    ab10: "Warum ist Humour Cup geil?❤️‍🔥 :",
    ab11: "Dynamische KI-Szenarien: Dank fortschrittlicher KI fühlt es sich nie an, als würdest du zweimal dasselbe Spiel spielen.",
    ab12: "Reiche deine Szenarien ein: Füge deine eigenen Szenarien hinzu.",
    ab13: "Erstelle deine eigenen Szenarien: In der Custom-Option könnt ihr alle anonym Szenarien schreiben.",
    ab14: "Globale Sprachen: Spiele auf Englisch, Hindi, Spanisch, Französisch, Mandarin und mehr!",
    ab15: "Familienfreundlich oder 18+: Wähle die Kategorie, die zu deiner Gruppe passt.",
    ab16: "Teste deinen Humor noch heute. Erstelle einen Raum und lass die Humor-Schlacht beginnen!"
  },
  'Japanese': { 
    name: "あなたの面白い名前", create: "ルームを作成", createGold: "GOLDルームを作成！", orJoin: "または参加", code: "コード", join: "参加", rulebook: "👑 遊び方 👑", rule1: "各お題に面白い回答を書きます。", rule2: "チャットでジョークを返信します。", rule3: "面白いものに投票します。", rule4: "XPが最も多いプレイヤーの勝ちです。", submitPub: "🌍 Humour Cupプレイヤーのためにお題を送信 🌍", pubDesc: "これらはロビーで公開お題を選択したHumour Cupプレイヤーにランダムに出題されます。", pubPlace: "ここにお題を入力...", submit: "送信", lobby: "ロビー", roomCode: "ルームコード:", cat: "カテゴリー:", scen: "お題:", lang: "言語:", secret: "🤫 こっそり追加！", secPlace: "サプライズお題を書く...", addPool: "追加", totPool: "カスタムお題の合計:", addCustomAlso: "適切であれば、下の公開お題ボックスにもカスタムのお題を追加してください。", waitSquad: "チームを待っています...", host: "(ホスト)", launch: "ゲーム開始 🚀", waitMore: "あと1人待っています...", waitHost: "ホストを待っています...", fetch: "お題を取得中...", scenTitle: "お題", secLeft: "残り秒数", typeHumour: "ユーモアを入力...", subHumour: "送信", waitSlow: "他のプレイヤーを待っています...", chatVote: "チャット＆投票", humourBtn: "面白い！", replyBtn: "返信", repPlace: "返信...", send: "送信", cancel: "キャンセル", done: "読み終わりました！", waiting: "待機中...", upcoming: "次", enterRound: "ラウンド-", in: "開始まで", seconds: "秒", load: "ロード中...", results: "最終結果", winners: "勝者", winner: "勝者", scoreboard: "最終スコアボード", receipt: "🧾 MATCH RECEIPT", thanks: "遊んでくれてありがとう！🏆", saveRec: "📸 このレシートを保存", playAgain: "もう一度プレイ", waitRes: "ホストを待っています...", adminVault: "管理者", backHome: "⬅ 戻る", noScen: "まだお題がありません！", madeBy: "⚡作成者 ", toSpark: " あなたのユーモアを刺激するために⚡", privacy: "プライバシーポリシー", terms: "利用規約", contact: "お問い合わせ",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "この個人開発者はサーバー、モデレーション、保守を管理する必要があります。寄付はHumour Cupと私のアイデアを存続させます。💙", 
    feedbackText: "どうすればこのゲームをもっと面白くできる？ここで全部教えて", chatInst: "他の人の面白い回答に「面白い！」をタップしてください。", whatIsHC: "🤔 Humour Cupとは？",
    donateClarify: "追加の特典のためにHumour Cup GOLDを購入してください。または、ここで寄付をして私をサポートしてください。🙏🏻", customAmt: "金額", emailPlace: "メールアドレス...", payRazor: "Razorpayで支払う", payPaddle: "Paddleで支払う (グローバル)", payUpi: "UPIで支払う (インド)",
    goldTitle: "🏆 Humour Cup GOLD", goldSub: "このFun Keyで同時に複数のルームを作成することはできません。",
    gPerk2: "カスタムラウンドとタイマー", gPerk3: "よりユーモラスなAIお題", gPerk4: "ベストなAIとパブリックお題を優先的に提供", gPerk5: "プレイ中にお題を変更", gPerk6: "100% 広告なし", gPerk7: "Humour Cup 公式サポーター 💙",
    gInput: "すでにキーをお持ちですか？ここに入力...", gInstruction: "GOLDを購入すると、Fun Keyがメールで即座に届きます！", gActive: "Fun Keyが有効になりました。今すぐGOLDルームを作成してください。",
    ab1: "Humour Cupへようこそ！あなたの機知が王冠を獲得する究極のリアルタイムマルチプレイヤーユーモア競争ゲームです！退屈な友達とパーティーで遊んだり、偽物の同僚と休憩したり、テキスト版OnlyFans(笑)のような楽しいオンラインアクティビティを探している場合でも - Humour Cupはその無限のエンターテイメントに最適です。😼",
    ab2: "このクソゲーの本当の遊び方：",
    ab3: "鋭い機知を入力し、他の人がそれを面白いと思ったら投票します。お題の後にユーモアのあるコメントで他の人と戦います。最も面白い人がいわゆる - Humour Cupを獲得します。🏆 最後にみんなで遊んだゲームを保存して、思い出を集めることもできます。",
    ab4: "ゲームプレイをさらに詳しく説明すると：各ラウンドであなたの機知IQでお題に答えます。🧠 そして、チャットと投票フェーズでのユーモアのあるコメントを通じて戦い、他の人からの投票を通じてHumour XPを獲得します。⚔️ スコアボードの一番上にいる人が最終的にHumour Cupを獲得します。🏆🥇",
    ab5: "ステップバイステップの説明：ホストが安全な部屋を作成し、4桁のコードを共有します。完全な匿名性です。😈 サーバーはホストが選択したオプションとして機能します。",
    ab6: "A.I.を選択すると、ユーモアのあるお題がAIによってランダムに生成されます。🤖",
    ab7: "Publicを選択すると、世界中のプレイヤーが入力したお題からランダムに生成されます。さあ、あなたの面白いお題をそこに入力しに行きましょう。今すぐ！😠",
    ab8: "Customオプションは最も陽気なものです。ロビーにいる全員に、ゲームの独自のお題を（匿名で🤫）入力する自由を与えます。",
    ab9: "注意してください、ゲームは非常に中毒性があります。スマホ首（Text Neck Syndrome）になった時に文句を言わないでください。今検索するでしょ？😏",
    ab10: "Humour Cupの魅力❤️‍🔥 :",
    ab11: "ダイナミックなAIお題：高度なAIを搭載しているため、全く同じゲームを2回プレイしていると感じることはありません。",
    ab12: "お題を送信：内輪ネタがある？ - ならば自分のお題を追加してください。",
    ab13: "独自のお題を作成：Customオプションでは、全員が匿名でどんなお題でも書くことができます。",
    ab14: "グローバル言語：世界で最もホットな言語でプレイできます！",
    ab15: "全年齢または18禁：チームの雰囲気に合ったカテゴリーを選択してください。",
    ab16: "今日、あなたのユーモアをテストしてください。部屋を作成し、コードを共有して、ユーモアの戦いを始めましょう！"
  },
  'Korean': { 
    name: "재미있는 이름", create: "방 만들기", createGold: "GOLD 방 만들기!", orJoin: "또는 참가", code: "코드", join: "참가", rulebook: "👑 플레이 방법 👑", rule1: "각 시나리오에 재미있는 답변을 쓰세요.", rule2: "채팅 라운드에서 농담을 주고받으세요.", rule3: "재미있는 것에 투표하세요.", rule4: "가장 많은 XP를 얻은 사람이 승리합니다.", submitPub: "🌍 Humour Cup 플레이어를 위한 시나리오 제출 🌍", pubDesc: "이 시나리오들은 로비에서 공개 시나리오를 선택한 Humour Cup 플레이어에게 무작위로 나타납니다.", pubPlace: "여기에 시나리오를 입력하세요...", submit: "제출", lobby: "로비", roomCode: "방 코드:", cat: "카테고리:", scen: "시나리오:", lang: "언어:", secret: "🤫 몰래 추가하기!", secPlace: "깜짝 시나리오 쓰기...", addPool: "추가", totPool: "총 커스텀 시나리오:", addCustomAlso: "적절한 경우 아래의 공개 시나리오 상자에도 맞춤형 시나리오를 추가하세요.", waitSquad: "팀을 기다리는 중...", host: "(방장)", launch: "게임 시작 🚀", waitMore: "1명 더 기다리는 중...", waitHost: "방장을 기다리는 중...", fetch: "시나리오 가져오는 중...", scenTitle: "시나리오", secLeft: "초 남음", typeHumour: "유머를 입력하세요...", subHumour: "제출", waitSlow: "다른 플레이어 기다리는 중...", chatVote: "채팅 및 투표 라운드", humourBtn: "웃겨요!", replyBtn: "답글", repPlace: "답글...", send: "보내기", cancel: "취소", done: "다 읽었어요!", waiting: "대기 중...", upcoming: "다음", enterRound: "라운드-", in: "시작까지", seconds: "초", load: "로딩 중...", results: "최종 결과", winners: "우승자들", winner: "우승자", scoreboard: "최종 점수판", receipt: "🧾 MATCH RECEIPT", thanks: "플레이해주셔서 감사합니다! 🏆", saveRec: "📸 이 영수증 저장", playAgain: "다시 플레이", waitRes: "방장을 기다리는 중...", adminVault: "관리자 금고", backHome: "⬅ 뒤로", noScen: "아직 시나리오가 없습니다!", madeBy: "⚡제작: ", toSpark: " 당신의 유머를 자극하기 위해⚡", privacy: "개인정보 처리방침", terms: "서비스 약관", contact: "문의하기",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "이 1인 개발자는 서버, 모니터링, 유지보수를 감당해야 합니다. 후원금은 Humour Cup과 제 아이디어를 살아있게 합니다. 💙", 
    feedbackText: "어떻게 해야 이 게임을 더 재밌게 만들 수 있을까요? 여기에 다 말해주세요", chatInst: "서로의 재미있는 답변에 '웃겨요!'를 탭하세요.", whatIsHC: "🤔 Humour Cup이 무엇인가요?",
    donateClarify: "추가 혜택을 원하시면 Humour Cup GOLD를 구매해주세요. 아니면 여기서 후원하여 저를 지원해주세요. 🙏🏻", customAmt: "금액", emailPlace: "이메일 주소...", payRazor: "Razorpay 결제", payPaddle: "Paddle 결제 (글로벌)", payUpi: "UPI 결제 (인도)",
    goldTitle: "🏆 Humour Cup GOLD", goldSub: "이 Fun Key로 동시에 1개 이상의 방을 만들 수 없습니다.",
    gPerk2: "커스텀 라운드 및 타이머", gPerk3: "더 재미있는 AI 시나리오", gPerk4: "엄선된 AI 및 공개 시나리오 우선 제공", gPerk5: "게임 중 시나리오 변경", gPerk6: "100% 광고 없는 환경", gPerk7: "Humour Cup 공식 서포터 💙",
    gInput: "이미 키가 있나요? 여기에 입력하세요...", gInstruction: "GOLD를 구매하시면 이메일로 즉시 Fun Key를 보내드립니다!", gActive: "Fun Key가 활성화되었습니다. 지금 GOLD 방을 만드세요.",
    ab1: "Humour Cup에 오신 것을 환영합니다! 당신의 재치가 왕관을 차지하는 궁극의 실시간 멀티플레이어 유머 경쟁 게임입니다! 파티에서 지루한 친구들과 어울리거나, 가식적인 직장 동료들과 휴식을 취하거나, 아니면 텍스트 버전의 OnlyFans ㅋㅋ 같은 재미있는 온라인 활동을 찾고 있든 - Humour Cup은 끝없는 즐거움에 딱 맞습니다. 😼",
    ab2: "이 게임을 진짜로 어떻게 하나요?:",
    ab3: "날카로운 재치를 입력하고 다른 사람들이 재밌다고 생각하면 투표합니다. 각 시나리오 이후 유머러스한 댓글로 다른 사람들과 배틀합니다. 가장 웃긴 사람이 소위 - Humour Cup을 우승합니다.🏆 추억을 수집하기 위해 마지막에 모두와 함께 한 게임을 저장할 수도 있습니다.",
    ab4: "게임 플레이를 더 자세히 설명하자면: 당신은 각 라운드에서 재치 IQ로 시나리오에 응답합니다.🧠 그리고 채팅 및 투표 단계에서 유머러스한 댓글을 통해 다른 사람들의 투표를 받아 Humour XP를 얻습니다.⚔️ 스코어보드 맨 위에 있는 사람이 우승합니다.🏆🥇",
    ab5: "단계별 설명: 방장이 안전한 방을 만들고 4자리 코드를 공유합니다. 완전한 익명성입니다.😈 서버는 방장이 선택한 옵션에 따라 작동합니다.",
    ab6: "A.I.를 선택하면 황당한 가상 질문부터 밈이 될 만한 상황까지 AI가 무작위로 시나리오를 생성합니다.🤖",
    ab7: "Public을 선택하면 전 세계 유저들이 제출한 시나리오가 나옵니다. 지금 당장 재밌는 시나리오를 입력하러 가세요!😠",
    ab8: "Custom 옵션은 가장 웃긴 모드입니다. 로비에 있는 모두가 자신의 시나리오를 (익명으로🤫) 입력할 수 있습니다.",
    ab9: "주의하세요. 게임은 중독성이 강합니다. 거북목 증후군(Text Neck Syndrome)에 걸렸을 때 경고하지 않았다고 나중에 불평하지 마세요. 찾아보실 거죠?😏",
    ab10: "Humour Cup이 쩌는 이유❤️‍🔥 :",
    ab11: "다이내믹 AI 시나리오: 진보된 AI로 구동되어 두 번 같은 게임을 하는 느낌을 받지 못할 것입니다.",
    ab12: "플레이어를 위한 시나리오 제출: 내부 조크가 있나요? 시나리오를 추가하세요.",
    ab13: "나만의 시나리오 만들기: 커스텀 옵션에서 모두가 익명으로 시나리오를 작성할 수 있습니다.",
    ab14: "글로벌 언어 지원: 다양한 언어 지원!",
    ab15: "전체 이용가 또는 18세 이상: 팀의 분위기에 맞는 카테고리를 선택하세요.",
    ab16: "지금 바로 유머 배틀을 시작하세요!"
  },
  'Indonesian': { 
    name: "Nama Lucumu", create: "Buat Ruang", createGold: "Buat Ruang GOLD!", orJoin: "ATAU GABUNG", code: "KODE", join: "Gabung", rulebook: "👑 Cara Bermain 👑", rule1: "Tulis respons lucumu.", rule2: "Balas dengan candaan di ronde obrolan.", rule3: "Pilih yang menurutmu lucu.", rule4: "Pemain dengan XP terbanyak menang.", submitPub: "🌍 Kirimkan Skenario untuk pemain Humour Cup 🌍", pubDesc: "Ini muncul secara acak kepada pemain Humour Cup yang memilih skenario Publik di Lobi.", pubPlace: "Ketik skenariomu di sini...", submit: "Kirim", lobby: "Lobi", roomCode: "KODE RUANG:", cat: "Kategori:", scen: "Skenario:", lang: "Bahasa:", secret: "🤫 Tambah diam-diam!", secPlace: "Tulis skenario kejutan...", addPool: "Tambah", totPool: "Total Skenario Khusus:", addCustomAlso: "Tambahkan skenario khususmu ke kotak skenario Publik di bawah ini juga, jika cocok.", waitSquad: "Menunggu skuad...", host: "(Host)", launch: "Mulai Game 🚀", waitMore: "Menunggu 1 pemain lagi...", waitHost: "Menunggu host...", fetch: "Mengambil Skenario...", scenTitle: "Skenario", secLeft: "Detik Tersisa", typeHumour: "Ketik lucumu...", subHumour: "Kirim Kelucuan", waitSlow: "Menunggu yang lambat...", chatVote: "Ronde Obrolan & Pilih", humourBtn: "Lucu!", replyBtn: "Balas", repPlace: "Balas...", send: "Kirim", cancel: "Batal", done: "Saya Selesai Membaca!", waiting: "Menunggu...", upcoming: "Mendatang", enterRound: "Masuk Ronde-", in: "dalam", seconds: "detik", load: "Memuat...", results: "Hasil Akhir", winners: "Pemenang", winner: "Pemenang", scoreboard: "Papan Skor", receipt: "🧾 MATCH RECEIPT", thanks: "Terima kasih sudah bermain! 🏆", saveRec: "📸 Simpan struk ini", playAgain: "Main Lagi", waitRes: "Menunggu Host...", adminVault: "Brankas Admin", backHome: "⬅ Kembali", noScen: "Belum ada skenario!", madeBy: "⚡dibuat oleh ", toSpark: " untuk memancing humormu⚡", privacy: "Kebijakan Privasi", terms: "Ketentuan Layanan", contact: "Hubungi Kami",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "Developer indie ini harus menangani server, moderasi, dan pemeliharaan. Donasi membuat Humour Cup dan ide-ideku tetap hidup. 💙", 
    feedbackText: "Gimana caranya bikin game ini lebih seru? Kasih tau semuanya di", chatInst: "Ketuk 'Lucu!' pada respons lucu pemain lain.", whatIsHC: "🤔 Apa itu Humour Cup?",
    donateClarify: "Beli Humour Cup GOLD untuk beberapa fitur tambahan. Atau dukung aku dengan berdonasi di sini. 🙏🏻", customAmt: "Jumlah", emailPlace: "Alamat email kamu...", payRazor: "Bayar via Razorpay", payPaddle: "Bayar via Paddle (Global)", payUpi: "Bayar via UPI (India)",
    goldTitle: "🏆 Humour Cup GOLD", goldSub: "Lebih dari 1 Ruang tidak dapat dibuat dengan Fun Key yang sama pada saat bersamaan.",
    gPerk2: "Custom Jumlah Ronde & Timer", gPerk3: "Skenario AI yang Lebih Lucu", gPerk4: "Prioritas Skenario AI & Publik Terbaik", gPerk5: "Ubah Skenario saat Bermain", gPerk6: "100% Bebas Iklan", gPerk7: "Supporter Resmi Humour Cup 💙",
    gInput: "Udah punya Fun Key? Masukin di sini...", gInstruction: "Beli GOLD untuk dapetin Fun Key yang dikirim langsung ke emailmu!", gActive: "Fun Key aktif. Buat Ruang GOLD sekarang.",
    ab1: "Selamat datang di Humour Cup, game kompetisi humor multiplayer real-time pamungkas di mana kecerdasanmu memenangkan mahkota! Baik kamu nongkrong dengan teman yang membosankan, atau istirahat dengan rekan kerja palsumu, atau sekadar mencari aktivitas online menyenangkan seperti OnlyFans tapi versi teks lol - Humour Cup sangat tepat untuk hiburan tanpa akhir itu. 😼",
    ab2: "Bagaimana cara mainin game ini?:",
    ab3: "Kamu masukin kecerdasan tajammu dan yang lain voting kalau mereka menganggapnya lucu. Kamu bertarung dengan komentar lucumu setelah setiap skenario. Yang paling lucu memenangkan yang disebut - Humour Cup.🏆 Kamu juga bisa nyimpen game yang kamu mainin sama semuanya di akhir.",
    ab4: "Untuk merinci gameplay lebih lanjut: Kamu merespons skenario di setiap putaran dengan IQ kecerdasanmu.🧠 Dan bertarung melalui komentar lucumu di Fase Obrolan untuk mendapatkan Humour XP.⚔️ Yang di atas papan skor menang.🏆🥇",
    ab5: "Penjelasan langkah demi langkah: Host bikin ruang aman dan bagikan kode 4 digit anonim total.😈 Setelah semua masuk lobi, server bekerja sesuai opsi Host.",
    ab6: "Jika pilih A.I., skenario lucu akan di-generate AI.🤖",
    ab7: "Jika pilih Public, skenario muncul dari pemain global. Ayo masukin skenario lucumu sekarang!😠",
    ab8: "Opsi Custom paling kocak. Bebas masukin skenario sendiri secara anonim.🤫",
    ab9: "Awas, game ini simpel tapi bikin candu. Jangan ngeluh kena Text Neck Syndrome ya. Kamu bakal nyari itu kan?😏",
    ab10: "Kenapa Humour Cup keren?❤️‍🔥 :",
    ab11: "Skenario AI Dinamis: Didukung AI canggih, nggak akan kerasa main game yang sama dua kali.",
    ab12: "Kirim Skenariomu: Punya jokes tongkrongan? Tambahkan ke kotak Publik.",
    ab13: "Buat Skenariomu sendiri: Di opsi Custom, kalian semua bisa nulis skenario apapun secara anonim.",
    ab14: "Bahasa Global: Main dalam bahasa Inggris, Hindi, Spanyol, dll!",
    ab15: "Ramah Keluarga atau 18+: Pilih kategori yang pas buat kalian.",
    ab16: "Uji humormu hari ini. Buat ruang dan mulai pertarungannya!"
  },
  'Russian': { 
    name: "Твое смешное имя", create: "Создать комнату", createGold: "Создать GOLD комнату!", orJoin: "ИЛИ ПРИСОЕДИНИТЬСЯ", code: "КОД", join: "Вход", rulebook: "👑 Как играть 👑", rule1: "Напиши смешной ответ на сценарий.", rule2: "Отвечай шутками в чате.", rule3: "Голосуй за самые смешные.", rule4: "Игрок с наибольшим XP побеждает.", submitPub: "🌍 Предложите Сценарии для игроков Humour Cup 🌍", pubDesc: "Они выпадают игрокам Humour Cup, выбравшим публичные сценарии в Лобби.", pubPlace: "Введи свой сценарий здесь...", submit: "Отправить", lobby: "Лобби", roomCode: "КОД КОМНАТЫ:", cat: "Категория:", scen: "Сценарии:", lang: "Язык:", secret: "🤫 Добавить тайно!", secPlace: "Напиши сценарий-сюрприз...", addPool: "Добавить", totPool: "Всего сценариев:", addCustomAlso: "Добавьте свои забавные сценарии также в окно публичных сценариев ниже.", waitSquad: "Ждем команду...", host: "(Хост)", launch: "Запуск 🚀", waitMore: "Ждем еще 1 игрока...", waitHost: "Ждем хоста...", fetch: "Получение...", scenTitle: "Сценарий", secLeft: "Секунд осталось", typeHumour: "Введи шутку...", subHumour: "Отправить", waitSlow: "Ждем остальных...", chatVote: "Чат и Голосование", humourBtn: "Смешно!", replyBtn: "Ответить", repPlace: "Ответить...", send: "Отправить", cancel: "Отмена", done: "Я прочитал!", waiting: "Ожидание...", upcoming: "Следующий", enterRound: "Начало раунда-", in: "через", seconds: "секунд", load: "Загрузка...", results: "Результаты", winners: "Победители", winner: "Победитель", scoreboard: "Счет", receipt: "🧾 MATCH RECEIPT", thanks: "Спасибо за игру! 🏆", saveRec: "📸 Сохранить этот чек", playAgain: "Играть снова", waitRes: "Ждем хоста...", adminVault: "Хранилище Админа", backHome: "⬅ Назад", noScen: "Нет сценариев!", madeBy: "⚡создано ", toSpark: " чтобы разжечь твой юмор⚡", privacy: "Конфиденциальность", terms: "Условия", contact: "Связаться с нами",
    donateBtn: "Support me to grow\nHumour Cup", 
    donateText: "Этому инди-разработчику нужно оплачивать серверы, модерацию и поддержку. Донаты помогают Humour Cup и моим идеям жить. 💙", 
    feedbackText: "Как, черт возьми, сделать эту игру веселее? Расскажите мне все по адресу", chatInst: "Нажимайте 'Смешно!' на забавные ответы друг друга.", whatIsHC: "🤔 Что такое Humour Cup?",
    donateClarify: "Купите Humour Cup GOLD для получения дополнительных бонусов. Или, пожалуйста, поддержите меня донатом здесь. 🙏🏻", customAmt: "Сумма", emailPlace: "Ваш email...", payRazor: "Оплатить через Razorpay", payPaddle: "Оплатить через Paddle (Мир)", payUpi: "Оплатить через UPI (Индия)",
    goldTitle: "🏆 Humour Cup GOLD", goldSub: "С этим Fun Key нельзя создать более 1 комнаты одновременно.",
    gPerk2: "Свои раунды и таймеры", gPerk3: "Более смешные сценарии ИИ", gPerk4: "Лучшие ИИ и публичные сценарии", gPerk5: "Смена сценариев во время игры", gPerk6: "100% без рекламы", gPerk7: "Официальный спонсор 💙",
    gInput: "Уже есть ключ? Введите его здесь...", gInstruction: "Купите GOLD, чтобы немедленно получить Fun Key на email!", gActive: "Fun Key активирован. Создайте GOLD комнату.",
    ab1: "Добро пожаловать в Humour Cup, многопользовательскую игру, где ваш острый ум выигрывает корону! Тусите ли вы со скучными друзьями, делаете перерыв с фальшивыми коллегами или ищете аналог OnlyFans в текстовом виде лол — эта игра для вас. 😼",
    ab2: "Как вообще в это играть?:",
    ab3: "Вы вводите остроумные ответы, а остальные голосуют. Вы сражаетесь своими комментариями. Самый смешной забирает Кубок!🏆 Вы также можете сохранить игру в конце.",
    ab4: "Подробнее: Вы отвечаете на сценарии, используя свой IQ.🧠 Затем в чате бьетесь комментариями и зарабатываете XP.⚔️ Первый в таблице побеждает.🏆🥇",
    ab5: "Шаг за шагом: Хост создает комнату и делится 4-значным кодом. Заходите под дурацкими именами — полная анонимность.😈 Выбирайте режим в лобби, и сервер запустит игру.",
    ab6: "Если выбрать A.I., ИИ сгенерирует безумные сценарии.🤖",
    ab7: "Если Public, сценарии берутся из тех, что игроки добавили в базу. Иди и добавь свои!😠",
    ab8: "Custom (свои) — самый смешной вариант. Все в лобби анонимно пишут свои сценарии.🤫",
    ab9: "Осторожно, затягивает. Не жалуйтесь на синдром компьютерной шеи (погуглите, ага?).😏",
    ab10: "Почему Humour Cup крут?❤️‍🔥 :",
    ab11: "Динамичный ИИ: Игры никогда не повторяются.",
    ab12: "Предложите сценарии: Есть шутка для своих? Добавь в базу.",
    ab13: "Свои сценарии: В Custom режиме каждый пишет свой бред.",
    ab14: "Глобальные языки: Играйте на английском, русском, испанском и других!",
    ab15: "Для всех или 18+: Выбирай категорию под компанию.",
    ab16: "Проверь свой юмор сегодня. Создай комнату и начни битву!"
  }
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
    if (room?.state === 'CHAT_PHASE' || room?.state === 'ANSWER_PHASE') {
      const interval = setInterval(() => setTimeLeft(Math.max(0, Math.ceil(((room.roundData?.endTime || Date.now()) - Date.now()) / 1000))), 200);
      return () => clearInterval(interval);
    } else if (room?.state === 'INTERMISSION') {
      const interval = setInterval(() => setTimeLeft(Math.max(0, Math.ceil(((room.roundData?.intermissionEndTime || Date.now()) - Date.now()) / 1000))), 200);
      return () => clearInterval(interval);
    }
  }, [room]);

  useEffect(() => {
    // TICKING SOUND NOW AT 10 SECONDS
    if ((room?.state === 'ANSWER_PHASE' || room?.state === 'CHAT_PHASE') && timeLeft > 0 && timeLeft <= 10) {
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
      <div style={{
        ...styles.devCardGreen, 
        backgroundColor: '#10b981', 
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
          background: '#1a1a1a', 
          color: '#ffffff', 
          marginTop: '0', 
          padding: '12px 24px', 
          display: 'flex',          
          justifyContent: 'center',
          alignItems: 'center',      
          width: '90%',
          borderRadius: '50px',
          border: '4px solid #1a1a1a',
          boxShadow: '0px 6px 0px #ff9900'
        }}>
          <span style={{ 
            fontFamily: "'Fredoka One', cursive", 
            letterSpacing: '1px', 
            textAlign: 'center', 
            lineHeight: '1.2', 
            fontSize: 'clamp(16px, 5vw, 22px)' 
          }}>
            {t('donateBtn')}
          </span>
        </button>

      </div>

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
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap');

        /* --- GLOBAL LAYOUT LOCKS --- */
        * { box-sizing: border-box; } 
        html, body { overflow-x: hidden; margin: 0; padding: 0; width: 100%; min-height: 100vh; }

        .btn-3d { transition: transform 0.1s ease, box-shadow 0.1s ease; }

        .btn-3d:active:not(:disabled) { transform: translateY(6px); box-shadow: 0px 0px 0px transparent !important; }
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
        .custom-scroll::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
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
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px'
        }}>
          <div style={{
            position: 'relative',
            backgroundColor: '#FFC200', padding: '25px 20px', borderRadius: '24px', border: '5px solid #1a1a1a', 
            boxShadow: '10px 10px 0px #1a1a1a', maxWidth: '450px', width: '100%', maxHeight: '85vh',
            display: 'flex', flexDirection: 'column', animation: 'popIn 0.3s ease-out'
          }}>
            
            <div style={{ display: 'inline-block', backgroundColor: '#fff', border: '3px solid #1a1a1a', borderRadius: '12px', padding: '8px 16px', marginBottom: '20px', boxShadow: '4px 4px 0px #1a1a1a', alignSelf: 'center', flexShrink: 0 }}>
              <h2 style={{ fontSize: 'clamp(18px, 5vw, 24px)', margin: 0, color: '#1a1a1a', fontWeight: '900', fontFamily: "'Kalam', cursive", textTransform: 'uppercase', whiteSpace: 'nowrap'}}>☕ Support The Dev</h2>
            </div>
            
            <div className="custom-scroll" style={{ overflowY: 'auto', paddingRight: '5px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{backgroundColor: '#fff', border: '3px solid #1a1a1a', borderRadius: '12px', padding: '15px', marginBottom: '20px', textAlign: 'left', flexShrink: 0}}>
                 <p style={{margin: 0, fontWeight: '800', fontSize: '14px', lineHeight: '1.5', color: '#1a1a1a'}}>{t('donateClarify')}</p>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', flexShrink: 0}}>
                 <div style={{display: 'flex', border: '3px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#333'}}>
                    <select style={{...styles.dropdown, border: 'none', borderRadius: 0, flex: '0 0 auto', width: '80px', backgroundColor: '#1a1a1a', textAlign: 'center', padding: '10px', fontSize: '20px'}}>
                      <option>₹</option><option>$</option><option>€</option>
                    </select>
                    <input type="number" min="1" id="donateAmt" placeholder={t('customAmt')} value={donateAmount} onChange={(e) => setDonateAmount(e.target.value)} style={{...styles.input, marginBottom: '0', border: 'none', borderRadius: 0, flex: 1}} />
                 </div>
                 <input type="email" id="donateEmail" placeholder={t('emailPlace')} value={donateEmail} onChange={(e) => setDonateEmail(e.target.value)} style={{...styles.input, marginBottom: '0'}} />
              </div>
              
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0}}>
                 <button onClick={() => handleDonate('razorpay')} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: '#3b82f6', color: '#fff', fontSize: '16px', padding: '15px'}}>{t('payRazor')}</button>
                 <button onClick={() => handleDonate('paddle')} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: '#10b981', color: '#fff', fontSize: '16px', padding: '15px'}}>{t('payPaddle')}</button>
                 <button onClick={() => {setShowDonateModal(false); setShowUpiModal(true);}} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: '#1a1a1a', color: '#fff', fontSize: '16px', padding: '15px'}}>{t('payUpi')}</button>
              </div>
            </div>

            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              <button onClick={() => setShowDonateModal(false)} style={{
                 backgroundColor: '#e5e7eb', border: '2px solid #1a1a1a', borderRadius: '50px',
                 padding: '6px 20px', fontSize: '14px', fontWeight: '900', color: '#1a1a1a', cursor: 'pointer',
                 boxShadow: '2px 2px 0px #1a1a1a'
              }}>✖ CLOSE</button>
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
            backgroundColor: '#fff', padding: '25px 20px', 
            borderRadius: '24px', border: '5px solid #1a1a1a', 
            boxShadow: '10px 10px 0px #1a1a1a', maxWidth: '500px', width: '100%', maxHeight: '85vh', 
            display: 'flex', flexDirection: 'column',
            animation: 'popIn 0.3s ease-out'
          }}>
            
            <h2 style={{fontFamily: '"Fredoka One", cursive', fontSize: 'clamp(24px, 6vw, 32px)', color: '#ff9900', margin: '0 0 15px 0', textShadow: '2px 2px 0px #1a1a1a, -1px -1px 0px #1a1a1a, 1px -1px 0px #1a1a1a, -1px 1px 0px #1a1a1a', whiteSpace: 'nowrap', textAlign: 'center', flexShrink: 0}}>
              🏆 Humour Cup GOLD
            </h2>
            
            <div className="custom-scroll" style={{ overflowY: 'auto', paddingRight: '5px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{
                  textAlign: 'left', marginBottom: '20px', padding: '15px', backgroundColor: '#fef3c7', 
                  borderRadius: '12px', border: '3px solid #1a1a1a', flexShrink: 0
              }}>
                 <p style={{fontWeight: '900', color: '#ef4444', fontSize: '18px', margin: '0 0 5px 0', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', animation: 'pulse 1.5s infinite'}}>🚀 Coming Soon 🚀</p>
                 <p style={{fontWeight: '900', color: '#1a1a1a', fontSize: '16px', margin: '0 0 10px 0', textAlign: 'center'}}>Unlock these Perks:</p>
                 <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
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

                      <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px'}}>
                          <input id="goldKeyInputBox" name="goldKey" placeholder={t('gInput')} value={goldKeyInput} onChange={(e) => setGoldKeyInput(e.target.value)} style={{...styles.input, marginBottom: '0', fontSize: '16px', padding: '15px', width: '100%', textAlign: 'center', boxSizing: 'border-box'}} />
                          <button onClick={handleActivateGold} className="btn-3d" style={{...styles.primaryBtn, backgroundColor: '#1a1a1a', color: '#ff9900', borderColor: '#1a1a1a', width: '100%', fontSize: '16px', padding: '15px'}}>ACTIVATE FUN KEY</button>
                      </div>
                   </>
                )}
                
                <p style={{fontSize: '11px', color: '#ef4444', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center'}}>{t('goldSub')}</p>

              </div>
            </div>

            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              <button onClick={() => setShowGoldModal(false)} style={{
                 backgroundColor: '#e5e7eb', border: '2px solid #1a1a1a', borderRadius: '50px',
                 padding: '6px 20px', fontSize: '14px', fontWeight: '900', color: '#1a1a1a', cursor: 'pointer',
                 boxShadow: '2px 2px 0px #1a1a1a'
              }}>✖ CLOSE</button>
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
          border: '3px solid #1a1a1a', boxShadow: '2px 2px 0px #ff9900', fontSize: '14px', fontWeight: '900', cursor: 'pointer',
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
            <div style={styles.headingBox}>
               <h2 style={styles.headingBoxTitle}>🌱 SEEDING DATA</h2>
            </div>
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
              <div style={{...styles.headingBox, transform: 'rotate(1deg)'}}>
                 <h2 style={{...styles.headingBoxTitle, fontSize: '24px'}}>🌍 USER SUBMISSIONS ({formatNum(adminPublicScenarios.length)})</h2>
              </div>
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

            <div style={styles.sectionDivider}></div>

            <div style={{ width: '100%', marginTop: '10px', marginBottom: '25px' }}>
              <button 
                onClick={() => { playSound('click'); setIsAboutOpen(!isAboutOpen); }} 
                className="btn-3d" 
                style={{
                  width: '100%', 
                  padding: '20px', 
                  backgroundColor: isAboutOpen ? '#1a1a1a' : '#ffffff', 
                  color: isAboutOpen ? '#FFC200' : '#1a1a1a', 
                  border: '4px solid #1a1a1a', 
                  borderRadius: isAboutOpen ? '16px 16px 0 0' : '16px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  boxShadow: isAboutOpen ? 'none' : '6px 6px 0px #1a1a1a',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: '900', fontSize: 'clamp(18px, 5vw, 24px)', whiteSpace: 'nowrap' }}>
                  {t('whatIsHC')}
                </span>
                <span style={{ fontSize: '20px', transform: isAboutOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>▼</span>
              </button>

              <div style={{
                maxHeight: isAboutOpen ? '2500px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.5s ease-in-out',
                width: '100%',
              }}>
                <div style={{
                  backgroundColor: '#ffffff', border: '4px solid #1a1a1a', borderTop: 'none', 
                  borderRadius: '0 0 16px 16px', padding: '30px', textAlign: 'left', color: '#1a1a1a', 
                  boxShadow: '6px 6px 0px #1a1a1a'
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
              </div>
            </div>

            <div style={styles.sectionDivider}></div>

            {renderSupportCards()}
          </>
        )}

        {room?.state === 'LOBBY' && (
          <>
            <button onClick={() => window.location.reload()} className="btn-3d" style={{
               position: 'absolute', top: '20px', left: '20px', backgroundColor: '#fff', border: '3px solid #1a1a1a', borderRadius: '12px', padding: '8px 15px', fontWeight: '900', fontSize: '14px', cursor: 'pointer', boxShadow: '2px 2px 0px #1a1a1a', zIndex: 10
            }}>⬅ HOME</button>
          
            <div style={styles.headingBox}>
               <h2 style={styles.headingBoxTitle}>{t('lobby')}</h2>
            </div>
            
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

                 {room.settings.source === 'Public' && (
                   <div style={{flex: '1 1 100%', marginTop: '10px'}}>
                      <p style={{fontSize: '12px', fontWeight: 'bold', color: '#10b981', backgroundColor: '#e5e7eb', padding: '10px', borderRadius: '8px', border: '2px dashed #1a1a1a', margin: 0, lineHeight: '1.4'}}>
                        The humorous scenarios entered by the Humour Cup players will come randomly to you. You can enter yours in the Submit box at the bottom.
                      </p>
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

            <h3 style={{color: '#1a1a1a', fontWeight: '900', marginBottom: '5px'}}>
              {t('waitSquad')} ({room.players.length} Joined)
            </h3>
            <p style={{fontSize: '13px', fontWeight: 'bold', color: '#333', marginTop: '0', marginBottom: '20px', padding: '0 10px'}}>
              Share the ROOM CODE with your friends to play together! This is a private room, not global matchmaking.
            </p>
            
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
                {room.settings.namesRevealed ? "🙈 Hide Player Names" : "👁️ Reveal Player Names (Alphabetically)"}
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
            <div style={styles.headingBox}>
               <h2 style={styles.headingBoxTitle}>{t('fetch')}</h2>
            </div>
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
              <div style={styles.headingBox}>
                 <h2 style={styles.headingBoxTitle}>{t('scenTitle')} {currentRound}</h2>
              </div>
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
              <div style={styles.headingBox}>
                 <h2 style={styles.headingBoxTitle}>{t('chatVote')}</h2>
                 <p style={styles.headingBoxSubtitle}>Reply with your humour punches and vote.</p>
                 <p style={styles.headingBoxHighlight}>{t('chatInst')}</p>
              </div>
              
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
              
              <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '400px', zIndex: 100 }}>
                <button onClick={handleDone} className="btn-3d" style={{
                   ...(isDone ? styles.doneBtnActive : styles.primaryBtn),
                   boxShadow: '0px 8px 0px #1a1a1a',
                   padding: '18px'
                }}>
                   {isDone ? t('undone') : t('done')}
                </button>
              </div>

              <div style={{ marginTop: '30px', paddingBottom: '80px', width: '100%', textAlign: 'center' }}>
                 <p style={{fontWeight: 'bold', color: '#1a1a1a'}}>{isDone ? `${t('waiting')} (${donePlayers.length}/${room.players.length})` : ''}</p>
              </div>
            </>
          );
        })()}

        {room?.state === 'INTERMISSION' && (() => {
          const sortedPlayers = [...room.players].sort((a,b) => b.score - a.score);
          const nextRound = (room.roundData?.roundNumber || 1) + 1;
          return (
            <>
              <div style={styles.headingBox}>
                 <h2 style={styles.headingBoxTitle}>{t('scenTitle')} {nextRound} {t('upcoming')}</h2>
              </div>
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
              
              {isHost ? <button onClick={handlePlayAgain} className="btn-3d" style={{...styles.primaryBtn, fontSize: '28px', padding: '30px', backgroundColor: '#10b981', color: '#fff', marginBottom: '30px'}}>{t('playAgain')}</button> : <h3 className="animate-bounce" style={{...styles.loadingText, marginBottom: '30px'}}>{t('waitRes')}</h3>}

              <div style={styles.headingBox}>
                 <h2 style={styles.headingBoxTitle}>{isTie ? t('winners') : t('winner')}</h2>
              </div>
              
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

              <div style={styles.sectionDivider}></div>
              
              <div style={{ marginTop: '20px', width: '100%' }}>
                {renderSubmitScenarioBox()}
              </div>
              
              <div style={styles.sectionDivider}></div>

              {renderSupportCards()}

            </>
          );
        })()}
      </div>

      <div style={{
        marginBottom: '40px', 
        backgroundColor: '#ff9900',
        padding: '12px 20px', 
        borderRadius: '50px 20px 60px 25px / 20px 60px 25px 50px', /* This creates the blob shape! */
        border: '3px solid #1a1a1a', /* Thickened slightly to match the comic theme */
        boxShadow: '4px 4px 0px #1a1a1a', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: 'fit-content', 
        maxWidth: '95%', 
        textAlign: 'center',
        zIndex: 1,
        marginTop: 'auto' /* This ensures it always gets pushed to the bottom of the screen */
      }}>
        <div style={{ 
          fontSize: '0.8rem', 
          color: '#ffffff', 
          fontWeight: 'bold',
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
              fontWeight: 'bold', 
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
  
  aboutText: { fontSize: '16px', fontWeight: '500', lineHeight: '1.6', marginBottom: '15px', fontFamily: "'Nunito', sans-serif" },
  aboutBullet: { display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '16px', fontWeight: '500', lineHeight: '1.5', fontFamily: "'Nunito', sans-serif" },

  headingBox: { backgroundColor: '#fff', border: '4px solid #1a1a1a', borderRadius: '16px', padding: '20px', display: 'inline-block', boxShadow: '8px 8px 0px #1a1a1a', marginBottom: '30px', transform: 'rotate(-1deg)', width: '100%', maxWidth: '500px', textAlign: 'center' },
  headingBoxTitle: { fontFamily: "'Bangers', cursive", fontSize: '38px', color: '#ff9900', fontWeight: '900', margin: '0', textTransform: 'uppercase', textShadow: '2px 2px 0px #1a1a1a, -1px -1px 0px #1a1a1a, 1px -1px 0px #1a1a1a, -1px 1px 0px #1a1a1a', letterSpacing: '2px' },
  headingBoxSubtitle: { color: '#1a1a1a', fontSize: '16px', fontWeight: '800', margin: '10px 0 5px 0' },
  headingBoxHighlight: { color: '#ef4444', fontSize: '14px', fontWeight: '900', margin: '0' },

  container: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '80px 20px 40px 20px', boxSizing: 'border-box' },
  
  mainCard: { background: '#ffffff', padding: '40px', borderRadius: '24px', width: '100%', border: '4px solid #1a1a1a', boxShadow: '10px 10px 0px #1a1a1a' },
  
  input: { backgroundColor: '#333333', color: '#ffffff', width: '100%', padding: '20px', borderRadius: '12px', border: '3px solid #1a1a1a', fontSize: '20px', marginBottom: '25px', fontWeight: 'bold', outline: 'none' },
  smallInput: { backgroundColor: '#333333', color: '#ffffff', flex: 1, padding: '20px', borderRadius: '12px', border: '3px solid #1a1a1a', fontSize: '20px', fontWeight: 'bold', outline: 'none', textTransform: 'uppercase', minWidth: 0 },
  textarea: { backgroundColor: '#333333', color: '#ffffff', width: '100%', height: '150px', padding: '20px', borderRadius: '16px', border: '3px solid #1a1a1a', fontSize: '20px', marginBottom: '25px', fontWeight: 'bold', outline: 'none', resize: 'none' },
  primaryBtn: { width: '100%', padding: '22px', borderRadius: '12px', border: '3px solid #1a1a1a', backgroundColor: '#ffffff', color: '#1a1a1a', fontSize: '22px', fontWeight: '900', cursor: 'pointer', boxShadow: '6px 6px 0px #1a1a1a', textTransform: 'uppercase' },
  secondaryBtn: { padding: '18px 24px', borderRadius: '12px', border: '3px solid #1a1a1a', backgroundColor: '#ffffff', color: '#1a1a1a', fontSize: '18px', fontWeight: '900', cursor: 'pointer', boxShadow: '4px 4px 0px #1a1a1a' },
  startBtn: { width: '100%', padding: '25px', borderRadius: '16px', border: '4px solid #1a1a1a', backgroundColor: '#10b981', color: '#ffffff', fontSize: '24px', fontWeight: '900', cursor: 'pointer', boxShadow: '8px 8px 0px #1a1a1a', marginTop: '30px' },
  doneBtnActive: { width: '100%', padding: '22px', borderRadius: '12px', border: '3px solid #1a1a1a', backgroundColor: '#fbbf24', color: '#1a1a1a', fontSize: '20px', fontWeight: '900', cursor: 'pointer' },
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
    fontSize: '38px', color: '#ffffff', marginBottom: '30px', fontWeight: '900', fontFamily: "'Kalam', cursive", textTransform: 'uppercase', textAlign: 'center', textShadow: '3px 3px 0px #1a1a1a, -2px -2px 0px #1a1a1a, 2px -2px 0px #1a1a1a, -2px 2px 0px #1a1a1a, 2px 2px 0px #1a1a1a', transform: 'rotate(-2deg)', display: 'inline-block'
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