import type { FriendMessage, DuaItem } from '../types/index.ts';

export const APP_CONFIG = {
  brandName: 'BLACK ROSE MT',
  presentedBy: 'Shona Bhai',
  badgeText: 'From Shona Bhai',
  deadlineISO: '2026-11-17T00:00:00+05:00',
  timezoneName: 'Pakistan Standard Time (Asia/Karachi, UTC+05:00)',
  mediaUrls: {
    mp4VideoPath: '/assets/aistudio/videoplayback__2__8dd731cb.mp4',
    blackScreenAudioVideoId: '-EMmxkqvoPQ',
    birthdaySongVideoId: 'sqkzN2Ye_pk',
  },
};

export const SEVEN_NAMES = [
  { id: 'black-rose-mt', name: 'BLACK ROSE MT', subtitle: 'The Royal Birthday Star' },
  { id: 'primexahmed', name: 'PrimexAhmed', subtitle: 'Gaming Partner & Loyal Brother' },
  { id: 'primexhaxx', name: 'PrimexHaxx', subtitle: 'Strategist & True Companion' },
  { id: 'nexo-gaming', name: 'Nexo gaming', subtitle: 'Squad Energizer & High-Spirit Friend' },
  { id: 'abhixplayz', name: 'AbhixPlayz', subtitle: 'Creative Gamer & Respected Friend' },
  { id: 'msr', name: 'MSR', subtitle: 'Pillar of Respect & Brotherhood' },
  { id: 'vishal', name: 'Vishal', subtitle: 'Warm Heart & Constant Well-Wisher' },
];

export const FINAL_REVEAL_NAME = {
  id: 'shona-bhai',
  name: 'Shona Bhai',
  subtitle: 'Bhai & True Friend',
};

export const FRIEND_MESSAGES: FriendMessage[] = [
  {
    id: 'primexahmed',
    name: 'PrimexAhmed',
    subtitle: 'Gaming Partner & Loyal Brother',
    duaRomanUrdu: 'Meri taraf se BLACK ROSE MT ko janam din bohat bohat mubarak ho! Allah taala aapko hamesha hansta muskurata aur kamyab rakhe. Gaming ke maidan mein aur zindagi ke har imtehan mein aap hamesha top par raho. Bhai ki dhero duayein aapke sath hain!',
    englishWish: 'Wishing you unmatched victories, endless joy, and an inspiring journey ahead.',
    accent: '#B9905A',
  },
  {
    id: 'primexhaxx',
    name: 'PrimexHaxx',
    subtitle: 'Strategist & True Companion',
    duaRomanUrdu: 'Happy Birthday BLACK ROSE MT! Dua hai ke aane wala saal aapke liye be-inteha barkat, zehni sukoon aur taraqqi le kar aaye. Har mushkil aasan ho aur aapka har maqsad poora ho. Aap hum sab ke liye aik behtareen dost hain!',
    englishWish: 'May brilliant intellect, sharp intuition, and lasting peace guide your path always.',
    accent: '#F5E8D5',
  },
  {
    id: 'nexo-gaming',
    name: 'Nexo gaming',
    subtitle: 'Squad Energizer & High-Spirit Friend',
    duaRomanUrdu: 'Zabardast aur damdar Janam Din Mubarak ho BLACK ROSE MT! Squad ki ronaq aur hamesha positive vibe dene wali dost, Allah aapki zindagi ko khushiyon aur roshni se bhar de. Keep shining and dominating!',
    englishWish: 'To our radiant squad legend, keep spreading pure positivity and unstoppable energy.',
    accent: '#E8BFC5',
  },
  {
    id: 'abhixplayz',
    name: 'AbhixPlayz',
    subtitle: 'Creative Gamer & Respected Friend',
    duaRomanUrdu: 'Bohat saari duayein aur dili mubarakbaad BLACK ROSE MT ko! Aapki mehnat aur humble nature hamesha dil jeet leti hai. Dua hai ke har naya din aapke chehre par nayi muskurahat aur nayi kamyabi laye.',
    englishWish: 'May every creative ambition you pursue turn into grand milestones and joy.',
    accent: '#B9905A',
  },
  {
    id: 'msr',
    name: 'MSR',
    subtitle: 'Pillar of Respect & Brotherhood',
    duaRomanUrdu: 'BLACK ROSE MT, aapko janam din ki tahe-dil se mubarakbaad. Dua hai ke aapki izzat, waqar aur sehat mein hamesha barkat rahe. Allah aapko hamesha apni hifazat ke saaye mein rakhe aur har buri nazar se mehfooz farmaye.',
    englishWish: 'Standing with unwavering brotherly respect, wishing you supreme honor and peace.',
    accent: '#F7F3F0',
  },
  {
    id: 'vishal',
    name: 'Vishal',
    subtitle: 'Warm Heart & Constant Well-Wisher',
    duaRomanUrdu: 'A very Happy Birthday to the incredible BLACK ROSE MT! Dil se dua hai ke aapki zindagi mein kabhi gham ka saya na aaye. Aap hamesha aese hi khushiyon ki wajah banti rahein aur bulandiyon ko chhu lein!',
    englishWish: 'Wishing you abundant warmth, great health, and countless happy memories.',
    accent: '#E8BFC5',
  },
];

export const DUAS_LIST: DuaItem[] = [
  {
    id: 'sehat',
    categoryRomanUrdu: 'Sehat Aur Lambi Umar',
    categoryEnglish: 'Vibrant Health & Vitality',
    duaRomanUrdu: 'Allah Taala aapko hamesha kamil aur mustaqil sehat-o-tandurusti ata farmaye, har beemari aur takleef se mehfooz rakhe.',
    meaning: 'May you always enjoy sound health, physical vitality, and boundless energy throughout your life.',
    icon: 'Heart',
  },
  {
    id: 'sukoon',
    categoryRomanUrdu: 'Dil Ka Sukoon-o-Aman',
    categoryEnglish: 'Serenity & Peace of Mind',
    duaRomanUrdu: 'Aapke dil aur zehan ko hamesha aesa sukoon naseeb ho jo kisi pareshani ya gham se mutasir na ho sake.',
    meaning: 'May your heart remain anchored in deep tranquility, clarity, and unshakeable inner peace.',
    icon: 'Feather',
  },
  {
    id: 'hifazat',
    categoryRomanUrdu: 'Ghaibi Hifazat-o-Panaah',
    categoryEnglish: 'Divine Protection',
    duaRomanUrdu: 'Har buri nazar, har hasad aur har sharr se Allah Taala aapko aur aapke apno ko apni khaas hifazat mein rakhe.',
    meaning: 'May you be sheltered under divine protection against every hardship, adversity, and ill will.',
    icon: 'Shield',
  },
  {
    id: 'kamyabi',
    categoryRomanUrdu: 'Azeem Kamyabi-o-Izzat',
    categoryEnglish: 'Unrivaled Success & Honor',
    duaRomanUrdu: 'Aap jis maidan mein bhi qadam rakhein, wahan aapka naam izzat, shaan aur numaya kamyabi ke sath goonje.',
    meaning: 'May your honorable character and diligence open doors of grand success and respect wherever you tread.',
    icon: 'Award',
  },
  {
    id: 'khushiyan',
    categoryRomanUrdu: 'Be-Panaah Khushiyan',
    categoryEnglish: 'Unceasing Joy & Smiles',
    duaRomanUrdu: 'Aapki muskurahat kabhi madham na pade, har subah nayi umeed aur har shaam nayi khushi ka paighaam laye.',
    meaning: 'May genuine laughter, delight, and true joy surround your everyday journey.',
    icon: 'Sparkles',
  },
  {
    id: 'mustaqbil',
    categoryRomanUrdu: 'Roshan Mustaqbil',
    categoryEnglish: 'A Luminous & Blessed Future',
    duaRomanUrdu: 'Aapka aane wala mustaqbil pichle guzre huwe salon se kahin zyada roshan, pur-sukoon aur ba-barkat ho.',
    meaning: 'May every coming chapter of your future be even brighter, richer in purpose, and full of blessing.',
    icon: 'Sun',
  },
];

export const PERSONAL_LETTER_SHONA_BHAI = {
  headerTitle: 'A Special Gift For You',
  fromBadge: 'From Your Shona Bhai',
  letterSalutation: 'Pyari Behna aur Behtareen Dost BLACK ROSE MT,',
  paragraphs: [
    'Janam Din bohat bohat Mubarak ho! Aaj ka yeh din sirf aapki saalgirah nahi, balkay hamare liye khushi aur fakhar ka din hai ke hum aap jaise ba-waqar, naik-dil aur ba-kirdar shakhsiyat ke sath hain.',
    'Aik bhai aur sachay dost ki haisiyat se, meri hamesha yeh dili khwahish aur koshish rehti hai ke aapke chehre par hamesha sachhi muskurahat dekhun. Aapki izzat, aapka sukoon aur aapki khushi hamare liye bohot azeez hai.',
    'Zindagi ke safar mein chahe kitne bhi mor aayein, aap yeh baat hamesha yaad rakhna ke aapka Shona Bhai har dua aur har mod par aik mukhlis bhai aur dost ki tarah hamesha aapke sath khada hai.',
    'Allah Taala aapki zindagi ko dhero barkaton, izzat aur unchi bulandiyon se nawaze. Hamesha hansti muskurati rahein!',
  ],
  signoff: 'Aapka Bhai & Mukhlis Dost,',
  signature: 'Shona Bhai',
};

export const EMOTIONAL_CLOSING = {
  title: 'With Duas, Respect & Pure Friendship',
  brotherlyNote: 'Aapke liye koi dikhawa ya ghair-waqai daaway nahi, balkay aik mukhlis bhai aur sacha dost ban kar sirf aapki behtari aur khushiyon ki dua karta hoon. Aapka ahtraam aur aapki hifazat hamara farz hai.',
  tagline: 'Stay proud, stay blessed, and keep rocking the universe as BLACK ROSE MT!',
};

export const MASTI_TEXT = {
  buttonText: 'Pakro Mujhe! 😜',
  caughtText: 'Acha baba pakar lo! 😄',
  modalTitle: 'Ek Choti Si Masti — Bhai Ki Taraf Se! 😂',
  messageParagraph: 'Hahaha! Thoda bhagna pada na? Par sach to yeh hai ke BLACK ROSE MT ko harane ka to koi soch bhi nahi sakta! Yeh choti si shararat sirf isliye thi ke aapke chehre par aik pyari si muskurahat aa jaye. Hamesha aese hi khilkhilati raho!',
  buttonDismiss: 'Haye Shona Bhai! Chalein aage chalte hain ✨',
};

// Section 12: A Sky Full of Duas 🌙 (Exact 4 Required Duas)
export const REQUIRED_FOUR_DUAS = [
  {
    id: 'dua-1',
    symbol: '🤍',
    title: 'Khushiyan Aur Sukoon',
    text: 'Allah tumhari zindagi ko khushiyon se bhar de, tumhari smile hamesha qaim rahe aur tumhara dil sukoon mein rahe. Ameen. 🤍',
    english: 'May Allah fill your life with boundless happiness, keep your radiant smile eternal, and anchor your heart in deep peace.',
  },
  {
    id: 'dua-2',
    symbol: '🌙',
    title: 'Kamyabi Aur Barkat',
    text: 'Allah tumhari har achi mehnat mein barkat de, tumhare liye kamyabi ke raaste kholay aur tumhein apne khwabon tak pohanchaye. Ameen. 🌙',
    english: 'May Allah bless every sincere effort of yours, open doors of grand triumph, and lead you to your highest aspirations.',
  },
  {
    id: 'dua-3',
    symbol: '🌷',
    title: 'Himmat Aur Asaani',
    text: 'Allah tumhein har pareshani mein himmat, har mushkil mein asaani aur har naye din mein umeed ata farmaye. Ameen. 🌷',
    english: 'May Allah grant you unyielding courage in difficulties, ease in all hardship, and luminous hope with every new dawn.',
  },
  {
    id: 'dua-4',
    symbol: '✨',
    title: 'Roshan Mustaqbil',
    text: 'Allah tumhari jaiz duaon ko qabool farmaye aur tumhara aane wala har saal pehle se zyada khoobsurat banaye. Ameen. ✨',
    english: 'May Allah answer every pure prayer of your heart and make each coming year far more beautiful than the last.',
  },
];

// Section 13: From Shona Bhai, With Duas 💌 (Strictly NO Video, Second Stationery Card)
export const SHONA_BHAI_SECTION6_LETTER = {
  headerTitle: 'From Shona Bhai, With Duas 💗',
  salutation: 'Happy Birthday, BLACK ROSE MT! 🌸',
  paragraphs: [
    'Dua hai ke Allah tumhari zindagi ko khushiyon, sukoon aur kamyabi se bhar de. Tumhare chehre ki smile hamesha qaim rahe aur tumhein zindagi mein woh sab kuch mile jo tumhare haq mein behtar ho.',
    'Zindagi mein kabhi achay din aayenge aur kabhi mushkil waqt bhi hoga. Meri dua hai ke Allah har mushkil mein tumhein himmat de, tumhare dil ko sukoon de aur tumhein hamesha sahi raasta dikhaye.',
    'Tumhari dosti mere liye qeemti hai. Hamesha apni izzat, apni pehchan aur apni khushi ka khayal rakhna. Apne khwabon ke liye mehnat karna aur kabhi apne aap par yaqeen khona mat.',
    'Allah tumhein hamesha apni hifazat mein rakhe. Ameen. 🤍',
    'Hamesha khush rehna, apni smile kabhi mat khona.',
    'Hamesha tumhara Bhai tumhare sath hai, jab bhi dil kare to yaad kar lena.',
    'Tumhari khushi bohat qeemti hai.',
  ],
  signoffPre: 'With duas, respect & friendship,',
  signature: 'Tumhara Pyara Bhai Aur Dost — Shona Bhai 🌹',
};

// Section 15: Final Emotional Lines & Ending Sequence (No "Thank You for Being You")
export const FINAL_EMOTIONAL_LINES = {
  selectedLine1: 'Zindagi ke har mor par, tumhara Bhai tumhare liye dua-go rahega. ❤️‍🩹🌹',
  selectedLine2: 'Jab bhi dil udaas ho, yaad rakhna… tumhare liye dua karne wala tumhara Bhai hamesha yahin hai. 🤍',
  brotherlyMessage:
    'Aapka waqar aur azeem kirdar hamare liye fakhar ka baais hai. Zindagi mein kabhi bhi agar himmat kam parne lage, to hamesha yaad rakhna ke aapka Bhai dil se aapki kamyabi aur hifazat ki dua karta hai. Apni smile hamesha barkarar rakhna aur hamesha aese hi sar utha kar jeena.',
  loveSignoff: 'Love From Your Shona Bhai',
  thankYou3D: 'THANK YOU',
};

// Section 11: Three Playable Games Data
export const GAMES_DATA = {
  trickDoor: {
    title: 'The Trick Door 🚪',
    subtitle: 'Sahi Darwaza Kaunsa Hai?',
    intro: 'BLACK ROSE MT, aapke samnay 3 shahi darwazay hain! Sirf aik darwaza aapko aage le kar jayega. Riddles parh kar sahi darwaza chunein!',
    doors: [
      {
        id: 1,
        title: 'Rose Gold Gate',
        clue: 'Yeh darwaza kehta hai: "Main sab se chamakta hoon par mere peeche choti si bhool bhulaiya hai!"',
        isCorrect: false,
        reaction: 'Arre nahi! Yeh to decoy tha! Dobara socho! 😂',
      },
      {
        id: 2,
        title: 'Royal Champagne Gate',
        clue: 'Yeh darwaza kehta hai: "Jahan sachhi dosti aur mukhlis dua ka noor ho, wahi asli rasta hai."',
        isCorrect: true,
        reaction: 'Wah zabardast! Bilkul sahi darwaza pakra! 🌟',
      },
      {
        id: 3,
        title: 'Deep Berry Gate',
        clue: 'Yeh darwaza kehta hai: "Main bohat pur-asrar hoon par mere peeche koi chabi nahi!"',
        isCorrect: false,
        reaction: 'Oho! Yeh rasta band hai! Doosra darwaza azmao! 😜',
      },
    ],
  },
  memoryTrap: {
    title: 'Memory Trap 👀',
    subtitle: 'Yaad Hai Ya Nahi?',
    intro: 'Chalein dekhte hain aapka zehan kitna tez hai! 3 second ke liye symbols ko yaad rakhein, phir missing symbol batayein!',
    rounds: [
      {
        id: 1,
        symbols: ['🌹 Black Rose', '👑 Shahi Taj', '🎂 Birthday Cake', '⭐ Sitara'],
        missing: '👑 Shahi Taj',
        options: ['👑 Shahi Taj', '💎 Heera', '🌸 Phool'],
      },
      {
        id: 2,
        symbols: ['🎮 Gaming Pad', '💌 Dua Lifafa', '🔥 Candle Flame', '✨ Noor'],
        missing: '💌 Dua Lifafa',
        options: ['🧸 Bear', '💌 Dua Lifafa', '🎈 Balloon'],
      },
    ],
  },
  mindTrap: {
    title: 'Don’t Trust Your Eyes 😈',
    subtitle: 'Dimagh Ka Dhoka',
    intro: 'Dhoka mat khana! Aankhein kuch aur dikhayengi, par dimagh kuch aur kahega!',
    puzzles: [
      {
        id: 1,
        question: 'Agar BLACK ROSE MT aur squad gaming mein utrein, to victory kiski hogi?',
        options: [
          'Opponent team ki',
          'BLACK ROSE MT aur Squad ki 100%!',
          'Kisi ki bhi nahi',
        ],
        correctIndex: 1,
        explanation: 'Bilkul! BLACK ROSE MT ki squad ko koi hara hi nahi sakta! 🔥',
      },
      {
        id: 2,
        question: 'Dunya mein sab se qeemti cheez kya hai jo kabhi khareedi nahi ja sakti?',
        options: [
          'Gold aur Diamonds',
          'Sachha Bhai, Mukhlis Dosti aur Duaein 💖',
          'Gaming PC',
        ],
        correctIndex: 1,
        explanation: 'Kamaal kar diya! Sachha rishta aur duayein hi sab se badi daulat hain!',
      },
    ],
  },
};
