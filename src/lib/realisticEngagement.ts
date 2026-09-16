// src/lib/realisticEngagement.ts

export interface RealisticComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface RealisticEngagement {
  likesCount: number;
  commentsCount: number;
  commentsList: RealisticComment[];
  suggestedReaction: string;
}

// 15 Categories × 3 Languages (Bengali, Hindi, English)
const CATEGORY_DATA: Record<string, { emojis: string[]; bn: string[]; hi: string[]; en: string[] }> = {
  funny: {
    emojis: ['😂', '🔥', '💯'],
    bn: [
      'হেসে হেসে পেট ফেটে গেল ভাই 😂',
      'এটা তো একদম আমার জীবনের সাথে মিলে গেল lol',
      'সেরা কনফেশন ছিল এটা ভাই 😂',
      'হাসি আর থামছে না সত্যি 🤣',
      'আজকের দিনের সেরা পোস্ট এটা!',
      'ভাই চরম বলেছো একদম 💀'
    ],
    hi: [
      'Bhai has has ke bura haal ho gaya 😂',
      'Ye to exact mere sath bhi hua tha lol',
      'Relatable max bhai 😂',
      'Hansi nahi ruk rahi yaar 🤣',
      'Epic level confession tha ye!',
      'Meme material mil gaya aaj ka 💀'
    ],
    en: [
      'Lmao this is way too accurate 😂',
      'I cannot stop laughing at this lol',
      'Literally me every single day 💀',
      'Too funny haha!',
      'This made my entire day 😂',
      'I am crying laughing right now 🤣'
    ]
  },
  sad: {
    emojis: ['😢', '💔', '🤗'],
    bn: [
      'কথাগুলো একদম বুক ছুঁয়ে গেল, নিজেকে শক্ত রেখো।',
      'এই শহরে একলা লড়াই করা মানুষগুলোর গল্পটা এমনই হয়।',
      'প্রতিটি লাইনে নিজের জীবনের প্রতিচ্ছবি দেখতে পেলাম।',
      'তুমি একা নও বন্ধু, সময় সব ক্ষতের মলম হয়ে যাবে।',
      'একদম সত্যি কথা, মুখে হাসি রাখা যে কত কঠিন তা ভুক্তভোগীই জানে।',
      'ভেঙে পড়ো না, রাতের অন্ধকারের পরেই নতুন ভোরের আলো ফোটে।'
    ],
    hi: [
      'हर लाइन से तुम्हारा दर्द महसूस हो रहा है भाई, हिम्मत रखना।',
      'बिल्कुल सच कहा, जिम्मेदारियां इंसान को चुप करा देती हैं।',
      'खुद को कभी अकेला मत समझना, वक्त हर दर्द कम कर देता है।',
      'दिल हल्का कर लिया करो दोस्त, इतना बोझ अकेले उठाना आसान नहीं।',
      'यह दौर भी गुजर जाएगा मेरे भाई, मजबूत बने रहो।',
      'तूफान के बाद ही शांति आती है, खुद पर भरोसा मत खोना।'
    ],
    en: [
      'Felt every single word of this. Please stay strong.',
      'Carrying this alone is exhausting. Sending you warmth.',
      'It takes so much courage to be this honest with yourself.',
      'You are never as alone as your midnight thoughts make you feel.',
      'This resonated deeply. Take things one step at a time.',
      'Healing isn’t linear, but you are handling it better than you think.'
    ]
  },
  love: {
    emojis: ['❤️', '🤗', '🔥'],
    bn: [
      'কত সুন্দর একটা অনুভূতি ❤️',
      'সত্যিকারের ভালোবাসা বোধহয় এমনই হয়।',
      'পড়ে মুখে এক চিলতে হাসি চলে এলো 🥰',
      'ভগবান তোমাদের দুজনকে সবসময় ভালো রাখুক ❤️',
      'খুব মিষ্টি একটা গল্প, ভালোবাসায় থেকো।'
    ],
    hi: [
      'कितना प्यारा कन्फेशन है ❤️',
      'बस यही तो सच्चा प्यार है यार',
      'पढ़ के चेहरे पर स्माइल आ गई 🥰',
      'नज़र ना लगे, सो स्वीट ❤️',
      'ऐसा प्यार किस्मत वालों को मिलता है।'
    ],
    en: [
      'This is the sweetest thing I read today ❤️',
      'So pure and heartfelt 🥰',
      'True love still exists! Beautiful story.',
      'Rooting for both of you ❤️',
      'So wholesome and warm.'
    ]
  },
  crush: {
    emojis: ['❤️', '😮', '🔥'],
    bn: [
      'আর দেরি না করে মনের কথাটা বলেই ফেলো ভাই 😉',
      'ক্রাশের এই ফিলিংসটা সত্যিই জীবনের সেরা অনুভূতি!',
      'বুকের মধ্যে চেপে না রেখে একবার বলেই দেখো ❤️',
      'দেরি করলে কিন্তু অন্য কেউ সুযোগ নিয়ে নেবে!',
      'মনের কথা বলে ফেলাটাই সবচেয়ে বুদ্ধিমানের কাজ।'
    ],
    hi: [
      'भाई बोल दो उसको, कब तक चुप रहोगे!',
      'हिम्मत करके कह डालो, क्या पता वो भी इंतज़ार कर रही हो 😉',
      'क्रश वाली फीलिंग सबसे अलग होती है यार',
      'पूछ लो एक बार, रिग्रेट से बेहतर है बोल देना ❤️',
      'ऑल द बेस्ट भाई, जाकर दिल की बात बोलो!'
    ],
    en: [
      'Just confess it to them already! You got this 😉',
      'Better to shoot your shot than regret later ❤️',
      'Crush butterflies are the best and worst feeling!',
      'Go for it, you never know until you try!',
      'Rooting for you to tell them soon!'
    ]
  },
  regret: {
    emojis: ['💔', '😢', '🙏'],
    bn: [
      'ভুল মানুষেরই হয়, নিজেকে ক্ষমা করে এগিয়ে যাও বন্ধু।',
      'যেটা ঘটে গেছে সেটা তো বদলানো যাবে না, বর্তমানকে দেখো।',
      'ভুল স্বীকার করাটাই সৎ মনের পরিচয় 🙏',
      'নিজেকে এত কষ্ট দিও না, এটা থেকে শিক্ষা নিয়ে চলো।'
    ],
    hi: [
      'गलतियां सब से होती हैं, खुद को माफ कर दो दोस्त।',
      'जो बीत गया उसे बदला नहीं जा सकता, आगे बढ़ो।',
      'पास्ट को छोड़ कर आगे देखो, सब सही होगा 🙏',
      'रियलाइज करना ही सुधरने की पहली सीढ़ी है।'
    ],
    en: [
      'We all make mistakes, please forgive yourself 🙏',
      'What is done is done, focus on moving forward.',
      'It takes courage to acknowledge this. Respect.',
      'Don’t carry that heavy guilt forever.'
    ]
  },
  family: {
    emojis: ['🤗', '❤️', '🙏'],
    bn: [
      'পরিবারের চেয়ে আপন আর কেউ হয় না এই দুনিয়ায়।',
      'একটু বসে কথা বলো, সব দূরত্ব মিটে যাবে।',
      'বাবা-মায়ের রাগ বেশিদিন থাকে না, ধৈর্য ধরো ❤️',
      'দিনশেষে পরিবারই মানুষের সবচেয়ে বড় শক্তি।'
    ],
    hi: [
      'फैमिली से बढ़कर कुछ नहीं होता यार।',
      'बात करके सुलझाने की कोशिश करो, सब ठीक होगा।',
      'घर वालों का गुस्सा ज्यादा देर नहीं रहता, संभल जाएगा।',
      'परिवार ही आखिरी सहारा होता है ❤️'
    ],
    en: [
      'Family matters are always complicated, hang in there.',
      'Try talking it out gently, communication heals things.',
      'Family is everything at the end of the day ❤️',
      'Hope things get sorted out with your family soon.'
    ]
  },
  friendship: {
    emojis: ['🤗', '💯', '❤️'],
    bn: [
      'আসল বন্ধু ভাগ্যে থাকলে তবেই পাওয়া যায় ভাই 💯',
      'ভুল বোঝাবুঝি হলে ফোন করে মিটিয়ে নাও, ইগো এনো না।',
      'বন্ধু মানেই তো জীবনের সব পাগলামির সঙ্গী!',
      'এমন বন্ধুদের কখনো হাতছাড়া হতে দিও না ❤️'
    ],
    hi: [
      'सच्चे दोस्त किस्मत से मिलते हैं यार 💯',
      'अगर मिसअंडरस्टैंडिंग है तो कॉल करके क्लियर कर लो।',
      'दोस्ती में ईगो नहीं आना चाहिए भाई।',
      'दोस्त ही तो जिंदगी की सबसे बड़ी ताकत होते हैं ❤️'
    ],
    en: [
      'True friends are so rare, cherish them 💯',
      'If it is a misunderstanding, just call and clear it out.',
      'Never let ego come between real friendship.',
      'Real ones always stick around no matter what ❤️'
    ]
  },
  career: {
    emojis: ['👏', '🔥', '💯'],
    bn: [
      'কঠোর পরিশ্রম কখনো বিফলে যায় না, লেগে থাকো 💯',
      'সব সফল মানুষকেই এই কঠিন সময়ের মধ্য দিয়ে যেতে হয়।',
      'নিজের দক্ষতার ওপর বিশ্বাস রাখো, ভালো সুযোগ আসবেই 👏',
      'কষ্ট করো ভাই, সাফল্য ঠিক একদিন ধরা দেবে।'
    ],
    hi: [
      'मेहनत करते रहो भाई, सफलता जरूर मिलेगी 💯',
      'हर सफल इंसान इस दौर से गुजरता है, लगे रहो।',
      'कंसिस्टेंसी मत छोड़ना, रिजल्ट आएगा! 👏',
      'मेहनत कभी बेकार नहीं जाती दोस्त, भरोसा रखो।'
    ],
    en: [
      'Hard work always pays off. Keep pushing! 💯',
      'Every setback is a setup for a comeback 👏',
      'Stay consistent with your hustle and vision.',
      'Respect the grind, success will follow.'
    ]
  },
  college: {
    emojis: ['😂', '💯', '🔥'],
    bn: [
      'কলেজের এই দিনগুলো পরে খুব মিস করবে ভাই 😂',
      'ক্লাস বাঙ্ক আর ক্যান্টিনের আড্ডা... আহা কী দিন!',
      'পরীক্ষার চিন্তা বাদ দাও, জীবনটা উপভোগ করো 💯',
      'পুরোনো কলেজ জীবনের স্মৃতি মনে করিয়ে দিলে একদম!'
    ],
    hi: [
      'ये कॉलेज के दिन बाद में बहुत याद आएंगे यार 😂',
      'बंक मारने और दोस्तों के साथ चिल करने के दिन हैं ये!',
      'एग्जाम की टेंशन छोड़ो, लाइफ एंजॉय करो 💯',
      'हॉस्टल लाइफ की याद दिला दी भाई!'
    ],
    en: [
      'You are going to miss these college days so much later! 😂',
      'Hahaha campus life drama is unmatched lol',
      'Make memories while you can, exams will pass! 💯',
      'Pure nostalgia!'
    ]
  },
  secrets: {
    emojis: ['😮', '🙏', '💯'],
    bn: [
      'এটা সত্যি অনেক বড় একটা গোপন কথা, বলার জন্য সাহস লাগে।',
      'এখানে বলে মনটা হালকা করে নিলে, চিন্তা নেই সব গোপন থাকবে।',
      'পড়ে তো একদম চমকে গেলাম 😮',
      'মনের ভেতরের পাথরটা নামিয়ে দিয়ে খুব ভালো করেছো।'
    ],
    hi: [
      'ये सच में बहुत बड़ा सीक्रेट था, हिम्मत चाहिए बोलने के लिए।',
      'यहाँ बोल कर दिल हल्का हो गया होगा, सब कॉन्फिडेंशियल है।',
      'भाई ये सुन कर तो होश उड़ गए 😮',
      'सच बोलने का दम सबमें नहीं होता, रिस्पेक्ट।'
    ],
    en: [
      'Takes crazy courage to confess this. Respect.',
      'Glad you got this off your chest anonymously.',
      'Wow, this was genuinely shocking to read 😮',
      'Your secret is safe here, let it go now.'
    ]
  },
  motivation: {
    emojis: ['🔥', '👏', '💯'],
    bn: [
      'দারুণ একটা কথা বলেছো ভাই, মন ছুঁয়ে গেল 👏',
      'খুব অনুপ্রেরণামূলক একটা পোস্ট, অনেক কিছু শেখার আছে।',
      'প্রতিটি মানুষের এই উপলব্ধিটা থাকা খুব জরুরি 💯',
      'মনোবল শক্ত রাখো, নতুন দিনের সূচনা হবেই।'
    ],
    hi: [
      'क्या बात कही है भाई, दिल जीत लिया 👏',
      'बहुत बढ़िया थॉट है, इंस्पायरिंग!',
      'हर किसी को ये बात समझनी चाहिए 💯',
      'माइंडसेट ही सब कुछ तय करता है, बिल्कुल सही!'
    ],
    en: [
      'Incredible perspective, pure wisdom 👏',
      'This was genuinely inspiring to read today.',
      'Spot on! Needed this reminder today 💯',
      'Keep inspiring with words like this 🔥'
    ]
  },
  rant: {
    emojis: ['🔥', '😮', '💯'],
    bn: [
      'তোমার এই ক্ষোভ একদম স্বাভাবিক, যেকোনো মানুষেরই রাগ হতো।',
      'মনের ভেতরের সব ক্ষোভ উগরে দাও, শান্তি পাবে।',
      'সত্যিই মাথা খারাপ করে দেওয়ার মতো একটা ব্যাপার!',
      'গভীর শ্বাস নাও ভাই, ফালতু মানুষের জন্য নিজের শান্তি নষ্ট কোরো না।'
    ],
    hi: [
      'आपका गुस्सा होना बिल्कुल नेचुरल है इस बात पे।',
      'दिल का भड़ास निकल गया ना, अब शांति से सोचो।',
      'भाई सच में दिमाग खराब कर देने वाली बात है ये!',
      'फालतू लोगों के चक्कर में अपना मूड खराब मत करो।'
    ],
    en: [
      'Your frustration is completely valid honestly.',
      'Glad you vented it out. Take a deep breath now.',
      'That is genuinely infuriating, protect your peace.',
      'Do not let toxic stuff disturb your calm 💯'
    ]
  },
  latenight: {
    emojis: ['❤️', '🤗', '😢'],
    bn: [
      'রাতের নিস্তব্ধতায় মনের পুরোনো স্মৃতিগুলো এভাবেই ভিড় করে।',
      'রাত দুটোয় এত ওভারথিংকিং কোরো না ভাই, শান্তিতে ঘুমাও।',
      'রাতের নির্জনতা মানুষের আসল অনুভূতি সামনে নিয়ে আসে।',
      'ঘুমিয়ে পড়ো বন্ধু, কাল একটা নতুন দিন অপেক্ষা করছে।'
    ],
    hi: [
      'रात के वक्त ही सारे डीप थॉट्स दिमाग में आते हैं।',
      'ओवरथिंकिंग मत करो दोस्त, आराम से सो जाओ।',
      'रात के सन्नाटे में सच बाहर आता है।',
      'सो जाओ भाई, सुबह सब बेहतर लगेगा।'
    ],
    en: [
      'Late night thoughts hit differently every single time.',
      'Do not overthink at 2 AM, get some restful sleep.',
      'Deep thoughts hit hardest in the silence of the night.',
      'Rest your mind tonight, tomorrow is a new canvas.'
    ]
  },
  relationship: {
    emojis: ['❤️', '💔', '🤗'],
    bn: [
      'যেকোনো সম্পর্কে কথা বলা আর পারস্পরিক সম্মান সবচেয়ে জরুরি ❤️',
      'সামনাসামনি বসে কথা বলে নাও, ভুল বোঝাবুঝি কেটে যাবে।',
      'নিজের আত্মসম্মান কখনো কারো সামনে বিসর্জন দিও না।',
      'যে মানুষটা তোমার মূল্য বোঝে তাকে কখনোই হারিও না।'
    ],
    hi: [
      'रिश्तों में कम्युनिकेशन और म्यूचुअल रिस्पेक्ट सबसे जरूरी है ❤️',
      'सामने बैठकर बात करो, गलतफहमियां दूर हो जाएंगी।',
      'अपनी सेल्फ-रेस्पेक्ट कभी मत गिरने देना किसी के आगे।',
      'जो इंसान आपकी कद्र करे वही साथ रहने लायक है।'
    ],
    en: [
      'Communication and mutual respect are non-negotiable ❤️',
      'Have an honest talk face to face, it clarifies everything.',
      'Never compromise on your self-respect in any relation.',
      'Know your worth and never settle for breadcrumbs.'
    ]
  },
  general: {
    emojis: ['👏', '❤️', '💯'],
    bn: [
      'একদম খাঁটি কথা বলেছো, তোমার সাথে একমত 👏',
      'সুন্দর আর সহজ-সরল একটা কনফেশন, ভালো লাগলো।',
      'নিজের খেয়াল রেখো বন্ধু, অনেক শুভকামনা।',
      'শেয়ার করার জন্য ধন্যবাদ ❤️'
    ],
    hi: [
      'बिल्कुल सही और सच्ची बात कही आपने 👏',
      '100% सहमत हूँ आपकी बात से भाई।',
      'अच्छा कन्फेशन था, शेयर करने के लिए शुक्रिया।',
      'ध्यान रखो अपना दोस्त ❤️'
    ],
    en: [
      'Completely agree with this 👏',
      'Well said, respect for sharing your thoughts.',
      'Thanks for putting this out there.',
      'Very true and grounded confession 💯'
    ]
  }
};

const BENGALI_NAMES = ['MeghBalika', 'KolkataGhumonto', 'BhalobasharKobi', 'NisshoPothik', 'ChaKhorKolkata', 'Anamika_99', 'Nil_Kabbo', 'EkaPothik', 'ShoroterMegh', 'BongBari'];
const HINDI_NAMES = ['KhamoshMusafir', 'DilliWalaShayar', 'TanhaiKaSafar', 'SukoonKiKhoj', 'RasteKeMusafir', 'ZindagiDiary', 'AlfaazMere', 'BefikraRooh', 'Pahadi परिंदा', 'DesiChai'];
const ENGLISH_NAMES = ['SilentVoyager', 'NeonDrifter', 'MidnightEcho', 'QuietRebel', 'CityLightsSoul', 'AuraSeeker', 'SolitaryThinker', 'UrbanSoul', 'VelvetEcho', 'EchoChamber'];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getRealisticEngagement(post: any): RealisticEngagement {
  const rawTime = post.createdAt || post.timestamp || post.time;
  let postTime = Date.now();
  if (typeof rawTime === 'number') {
    postTime = rawTime < 10000000000 ? rawTime * 1000 : rawTime;
  } else if (typeof rawTime === 'string') {
    const parsed = Date.parse(rawTime);
    if (!isNaN(parsed)) postTime = parsed;
  }

  const postId = String(post.id || post.text || 'seed_default');
  const hash = hashString(postId);
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - postTime) / (1000 * 60)));

  // 1. FIXED PROGRESSION: 0-3 Min par EXACT ZERO LIKES (Fake start avoided)
  let calculatedLikes = 0;
  let targetCommentsCount = 0;

  if (elapsedMinutes < 3) {
    calculatedLikes = 0;
    targetCommentsCount = 0;
  } else if (elapsedMinutes >= 3 && elapsedMinutes < 6) {
    calculatedLikes = 1;
    targetCommentsCount = 0;
  } else if (elapsedMinutes >= 6 && elapsedMinutes < 12) {
    calculatedLikes = (hash % 2 === 0) ? 2 : 1;
    targetCommentsCount = (hash % 3 === 0) ? 1 : 0;
  } else if (elapsedMinutes >= 12 && elapsedMinutes < 30) {
    calculatedLikes = 3 + (hash % 4);
    targetCommentsCount = 1 + (hash % 2);
  } else if (elapsedMinutes >= 30 && elapsedMinutes < 120) {
    calculatedLikes = 7 + (hash % 12);
    targetCommentsCount = 2 + (hash % 3);
  } else {
    calculatedLikes = 18 + (hash % 35);
    targetCommentsCount = 3 + (hash % 3); // Max 5 unique comments
  }

  const finalLikes = Math.max(Number(post.likesCount || post.likes || 0), calculatedLikes);

  // 2. Language Detection: Bengali vs Hindi vs English
  const text = String(post.text || post.content || post.body || '');
  const city = String(post.city || '');
  const isBengali = /[\u0980-\u09FF]/.test(text) || ['Kolkata', 'Dhaka', 'Howrah', 'Chittagong', 'Siliguri'].includes(city);
  const isHindi = /[\u0900-\u097F]/.test(text) || ['Delhi', 'Mumbai', 'Lucknow', 'Jaipur', 'Pune', 'Patna', 'Bhopal'].includes(city) || ['bhai', 'yaar', 'mera', 'meri', 'kya', 'nahi'].some(w => text.toLowerCase().includes(w));

  const langKey = isBengali ? 'bn' : isHindi ? 'hi' : 'en';
  const namesPool = isBengali ? BENGALI_NAMES : isHindi ? HINDI_NAMES : ENGLISH_NAMES;

  // 3. Category Detection
  const catRaw = String(post.category || '').toLowerCase().trim();
  const textLower = text.toLowerCase();
  let matchedKey = 'general';

  if (catRaw.includes('fun') || catRaw.includes('humor') || textLower.includes('lol') || textLower.includes('হাসি')) {
    matchedKey = 'funny';
  } else if (catRaw.includes('sad') || catRaw.includes('pain') || textLower.includes('কষ্ট') || textLower.includes('दर्द')) {
    matchedKey = 'sad';
  } else if (catRaw.includes('crush') || textLower.includes('ক্রাশ')) {
    matchedKey = 'crush';
  } else if (catRaw.includes('love') || catRaw.includes('romance') || textLower.includes('ভালোবাসা') || textLower.includes('प्यार')) {
    matchedKey = 'love';
  } else if (catRaw.includes('regret') || catRaw.includes('guilt') || textLower.includes('ভুল') || textLower.includes('गलती')) {
    matchedKey = 'regret';
  } else if (catRaw.includes('family') || catRaw.includes('parent') || textLower.includes('পরিবার') || textLower.includes('परिवार')) {
    matchedKey = 'family';
  } else if (catRaw.includes('friend') || textLower.includes('বন্ধু') || textLower.includes('दोस्त')) {
    matchedKey = 'friendship';
  } else if (catRaw.includes('career') || catRaw.includes('job') || textLower.includes('চাকরি') || textLower.includes('नौकरी')) {
    matchedKey = 'career';
  } else if (catRaw.includes('college') || catRaw.includes('school') || textLower.includes('কলেজ') || textLower.includes('स्कूल')) {
    matchedKey = 'college';
  } else if (catRaw.includes('secret') || catRaw.includes('dark') || textLower.includes('গোপন') || textLower.includes('सीक्रेट')) {
    matchedKey = 'secrets';
  } else if (catRaw.includes('motivat') || textLower.includes('অনুপ্রেরণা') || textLower.includes('प्रेरणा')) {
    matchedKey = 'motivation';
  } else if (catRaw.includes('rant') || catRaw.includes('anger') || textLower.includes('রাগ') || textLower.includes('गुस्सा')) {
    matchedKey = 'rant';
  } else if (catRaw.includes('night') || textLower.includes('রাত') || textLower.includes('रात')) {
    matchedKey = 'latenight';
  } else if (catRaw.includes('relation') || catRaw.includes('dating') || catRaw.includes('সম্পর্ক') || textLower.includes('ब्रेकअप')) {
    matchedKey = 'relationship';
  }

  const categoryBundle = CATEGORY_DATA[matchedKey] || CATEGORY_DATA.general;
  const rawComments = [...categoryBundle[langKey]];
  const chosenEmoji = categoryBundle.emojis[hash % categoryBundle.emojis.length];

  // 4. ANTI-DUPLICATE SHUFFLE (No repeating comments on the same post)
  const shuffledComments = [...rawComments];
  const shuffledNames = [...namesPool];

  for (let i = shuffledComments.length - 1; i > 0; i--) {
    const j = (hash + i * 7) % (i + 1);
    [shuffledComments[i], shuffledComments[j]] = [shuffledComments[j], shuffledComments[i]];
  }

  for (let i = shuffledNames.length - 1; i > 0; i--) {
    const j = (hash + i * 11) % (i + 1);
    [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
  }

  // 5. Generate unique comments list
  const commentsList: RealisticComment[] = [];
  const finalCommentCount = Math.min(targetCommentsCount, shuffledComments.length);

  for (let i = 0; i < finalCommentCount; i++) {
    const isAnon = (hash + i) % 3 === 0;
    const author = isAnon ? 'Anonymous' : shuffledNames[i % shuffledNames.length];

    const commentTimeOffset = Math.floor((elapsedMinutes * 60 * 1000) * (0.25 + (i * 0.15)));
    const cTime = Math.max(postTime, postTime + commentTimeOffset);
    const diffMins = Math.max(1, Math.floor((Date.now() - cTime) / 60000));
    const timeStr = diffMins < 60 ? `${diffMins}m ago` : `${Math.floor(diffMins / 60)}h ago`;

    commentsList.push({
      id: `rc_${postId}_${i}`,
      author,
      text: shuffledComments[i], // Har comment 100% Unique
      createdAt: timeStr
    });
  }

  return {
    likesCount: finalLikes,
    commentsCount: Math.max(Number(post.commentsCount || 0), commentsList.length),
    commentsList,
    suggestedReaction: chosenEmoji
  };
}
