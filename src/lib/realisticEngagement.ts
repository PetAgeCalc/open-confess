// src/lib/realisticEngagement.ts

export interface RealisticComment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

const BENGALI_COMMENTS = [
  'কথাগুলো একদম বুক ছুঁয়ে গেল, নিজেকে শক্ত রেখো।',
  'এই শহরে একলা লড়াই করা মানুষগুলোর গল্পটা এমনই হয়।',
  'প্রতিটি লাইনে নিজের জীবনের প্রতিচ্ছবি দেখতে পেলাম।',
  'তুমি একা নও বন্ধু, সময় সব ক্ষতের মলম হয়ে যাবে।',
  'একদম সত্যি কথা, মুখে হাসি রাখা যে কত কঠিন তা ভুক্তভোগীই জানে।',
  'ভেঙে পড়ো না, রাতের অন্ধকারের পরেই নতুন ভোরের আলো ফোটে।',
  'খুব চেনা অনুভূতি... আমরা সবাই বোধহয় এমন কোনো যুদ্ধ লড়ছি।',
  'মনটা হালকা করার জন্য ধন্যবাদ, তোমার জন্য অনেক শুভকামনা।'
];

const HINDI_COMMENTS = [
  'हर लाइन से तुम्हारा दर्द महसूस हो रहा है भाई, हिम्मत रखना।',
  'बिल्कुल सच कहा, जिम्मेदारियां इंसान को चुप करा देती हैं।',
  'खुद को कभी अकेला मत समझना, वक्त हर दर्द कम कर देता है।',
  'दिल हल्का कर लिया करो दोस्त, इतना बोझ अकेले उठाना आसान नहीं।',
  'सटीक बात लिखी है, सोशल मीडिया पर सब खुश दिखते हैं अंदर से सब टूटे हैं।',
  'तूफान के बाद ही शांति आती है, खुद पर भरोसा मत खोना।',
  'यह दौर भी गुजर जाएगा मेरे भाई, मजबूत बने रहो।',
  'सच बयां किया है आपने, आज के वक्त में असली सुकून मिलना मुश्किल है।'
];

const ENGLISH_COMMENTS = [
  'Felt every single word of this. Please stay strong.',
  'Carrying this alone is exhausting. Sending you warmth.',
  'It takes so much courage to be this honest with yourself.',
  'You are never as alone as your midnight thoughts make you feel.',
  'This resonated deeply. Take things one step at a time.',
  'Healing isn’t linear, but you are handling it better than you think.',
  'Thank you for sharing this. Rooting for you from afar.',
  'One day, you will look back and be proud that you never gave up.'
];

const BENGALI_NAMES = ['MeghBalika', 'KolkataGhumonto', 'BhalobasharKobi', 'NisshoPothik', 'ChaKhorKolkata', 'Anamika_99', 'Nil_Kabbo', 'EkaPothik'];
const HINDI_NAMES = ['KhamoshMusafir', 'DilliWalaShayar', 'TanhaiKaSafar', 'SukoonKiKhoj', 'RasteKeMusafir', 'ZindagiDiary', 'AlfaazMere', 'BefikraRooh'];
const ENGLISH_NAMES = ['SilentVoyager', 'NeonDrifter', 'MidnightEcho', 'QuietRebel', 'CityLightsSoul', 'AuraSeeker', 'SolitaryThinker', 'UrbanSoul'];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getRealisticEngagement(post: any) {
  const rawTime = post.createdAt || post.timestamp || post.time;
  let postTime = Date.now();
  if (typeof rawTime === 'number') {
    postTime = rawTime < 10000000000 ? rawTime * 1000 : rawTime;
  } else if (typeof rawTime === 'string') {
    const parsed = Date.parse(rawTime);
    if (!isNaN(parsed)) postTime = parsed;
  }

  const postId = String(post.id || 'seed_default');
  const hash = hashString(postId);
  const elapsedMinutes = Math.max(1, Math.floor((Date.now() - postTime) / (1000 * 60)));

  // Time based natural progression
  let calculatedLikes = 0;
  let calculatedCommentsCount = 0;

  if (elapsedMinutes < 15) {
    calculatedLikes = Math.floor(hash % 4) + Math.floor(elapsedMinutes * 0.4);
    calculatedCommentsCount = elapsedMinutes > 8 ? 1 : 0;
  } else if (elapsedMinutes < 60) {
    calculatedLikes = 6 + Math.floor(hash % 8) + Math.floor(elapsedMinutes * 0.3);
    calculatedCommentsCount = 1 + Math.floor(hash % 3);
  } else if (elapsedMinutes < 1440) {
    calculatedLikes = 25 + Math.floor(hash % 25) + Math.min(60, Math.floor(elapsedMinutes * 0.05));
    calculatedCommentsCount = 3 + Math.floor(hash % 5);
  } else {
    calculatedLikes = 55 + Math.floor(hash % 60);
    calculatedCommentsCount = 6 + Math.floor(hash % 6);
  }

  const finalLikes = Math.max(Number(post.likesCount || post.likes || 0), calculatedLikes);

  // Language auto detection for 100% matching comments
  const text = String(post.text || post.content || post.body || '');
  const city = String(post.city || '');
  const isBengali = /[\u0980-\u09FF]/.test(text) || ['Kolkata', 'Dhaka', 'Howrah', 'Chittagong'].includes(city);
  const isHindi = /[\u0900-\u097F]/.test(text) || ['Delhi', 'Mumbai', 'Lucknow', 'Jaipur', 'Pune'].includes(city);

  const commentsPool = isBengali ? BENGALI_COMMENTS : isHindi ? HINDI_COMMENTS : ENGLISH_COMMENTS;
  const namesPool = isBengali ? BENGALI_NAMES : isHindi ? HINDI_NAMES : ENGLISH_NAMES;

  const commentsList: RealisticComment[] = [];
  for (let i = 0; i < calculatedCommentsCount; i++) {
    const itemHash = (hash + i * 17) % commentsPool.length;
    const nameHash = (hash + i * 23) % namesPool.length;
    const author = (hash + i) % 3 === 0 ? 'Anonymous' : namesPool[nameHash];

    const commentTimeOffset = Math.floor((elapsedMinutes * 60 * 1000) * (0.2 + (i * 0.12)));
    const cTime = Math.max(postTime, postTime + commentTimeOffset);
    const diffMins = Math.max(1, Math.floor((Date.now() - cTime) / 60000));
    const timeStr = diffMins < 60 ? `${diffMins}m ago` : `${Math.floor(diffMins / 60)}h ago`;

    commentsList.push({
      id: `synthetic_${postId}_${i}`,
      author,
      text: commentsPool[itemHash],
      createdAt: timeStr
    });
  }

  return {
    likesCount: finalLikes,
    commentsCount: Math.max(Number(post.commentsCount || 0), commentsList.length),
    commentsList
  };
}
