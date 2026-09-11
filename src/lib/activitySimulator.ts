import { Confession } from '../types';

interface SimulatedPostItem {
  id: string;
  category: 'deep' | 'funny' | 'intelligent' | 'incident' | 'motivational' | 'finance';
  text: string;
  author: string;
  city: string;
  country: string;
  rawImage: string;
  possibleComments: string[];
}

const USED_POST_IDS_KEY = 'openconfess_used_post_registry_v9';
const LIVE_SIMULATED_POSTS_KEY = 'openconfess_live_simulated_posts_v9';
const LAST_SIMULATION_TIMESTAMP_KEY = 'openconfess_last_drip_post_time_v9';

const FALLBACK_LIGHTWEIGHT_JPEG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

// =========================================================================
// 50 BALANCED DIVERSE CONFESSIONS (100 - 300 Words)
// Kolkata & Bangladesh = Bangla
// Indian Cities = Balanced Hindi & Indian Urban English
// Worldwide = English (Everyday Life, Culture, Corporate, Quirks)
// =========================================================================
const CURATED_POST_POOL: SimulatedPostItem[] = [
  // ----------------- 1. KOLKATA & BANGLADESH (BANGLA) -----------------
  {
    id: 'bn_post_1',
    category: 'deep',
    city: 'Kolkata',
    country: 'India',
    author: 'সৌম্যদ্বীপ সেনগুপ্ত',
    rawImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=75',
    text: "সবাই ভাবে আমি খুব হাসিখুশি, সফল আর জীবনে কোনো আক্ষেপ নেই। কলকাতায় আমার একটা সুন্দর সাজানো ফ্ল্যাট আছে, একটা নামী আইটি কোম্পানিতে চাকরি আছে, আর উইকেন্ডে বন্ধুদের সাথে ক্যাফেতে আড্ডাও দিই। কিন্তু সত্যিটা হলো, ছয় বছর আগের সেই একটা অহংকারী সিদ্ধান্তের বোঝা আমি আজও রোজ রাতে একলা বয়ে বেড়াই। সেই মানুষটা যখন আমাকে অনুরোধ করেছিল আর মাত্র একবার বসে কথা বলে ভুল বোঝাবুঝি মিটিয়ে নেওয়ার জন্য, আমি আমার অন্ধ রাগের কারণে মুখের ওপর সব সম্পর্কের ইতি টেনে দিয়েছিলাম।\n\nআজ এত বছর পর যখন নিজের ফ্ল্যাটের ব্যালকনিতে একা কফির কাপ হাতে বসি, তখন গঙ্গার ধারের হাওয়া আর রাতের নিস্তব্ধতা আমাকে মনে করিয়ে দেয় যে অহংকার হয়তো জিতে গেছে, কিন্তু আমার জীবনের সমস্ত শান্তি চিরতরে হেরে গেছে। কাউকে এই কষ্টটা বলতে পারি না, কারণ আমার পরিচিত সবাই আমার শক্ত আর আত্মবিশ্বাসী রূপটা দেখতেই অভ্যস্ত। ভেতরে ভেতরে তিলে তিলে নিঃস্ব হয়ে যাওয়াটা বাইরে থেকে হাসিমুখে ঢেকে রাখা যে কতটা যন্ত্রণাদায়ক, তা কেবল সেই বোঝে যে রোজ রাতে নিজের নিঃশব্দ কান্নার সাথে লড়াই করে।",
    possibleComments: [
      'কথাগুলো একদম মনের গভীরে গিয়ে লাগলো। আপনার প্রতি অনেক শ্রদ্ধা।',
      'অহংকার ক্ষণিকের স্বস্তি দেয়, কিন্তু অনুশোচনা সারাজীবন তাড়িয়ে বেড়ায়। ভালো থাকুন।',
      'আমরা অনেকেই এই কষ্টটা নীরবে বয়ে বেড়াই। নিজেকে ক্ষমা করতে শিখুন।'
    ]
  },
  {
    id: 'bn_post_2',
    category: 'deep',
    city: 'Dhaka',
    country: 'Bangladesh',
    author: 'তানভীর হাসান',
    rawImage: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=700&q=75',
    text: "গ্রামের ধুলোমাখা পথ ছেড়ে যখন প্রথম ঢাকায় পা রেখেছিলাম, বুকের ভেতর একটাই জেদ ছিল—আমাকে প্রতিষ্ঠিত হতে হবে, একটা বড় পরিচয় বানাতে হবে। বাবা যখন অসুস্থ শরীর নিয়ে গ্রামে কৃষিকাজ করতেন, তখন মনে মনে পণ করেছিলাম বাবার শেষ বয়সটা রাজার মতো সুখের বানিয়ে দেব। টানা আট বছর দিনরাত এক করে পরিশ্রম করেছি, বহু রাত মেসের ভাঙা চৌকিতে না খেয়ে কাটিয়েছি, নিজের সমস্ত শখ বিসর্জন দিয়ে ক্যারিয়ার গড়েছি।\n\nআজ আমি একটা বহুজাতিক কোম্পানির উচ্চপদে কর্মরত। ধানমন্ডিতে নিজস্ব ফ্ল্যাট আছে, দামি গাড়ি আছে। কিন্তু ভাগ্যের নির্মম পরিহাস দেখুন—যে বাবার মুখের এক চিলতে শান্তির জন্য এই দীর্ঘ লড়াইটা লড়লাম, সেই বাবাই আমার এই সাফল্য দেখার মাত্র দুই মাস আগে ব্রেন স্ট্রোকে মারা গেলেন। আজ যখন অফিস শেষে এই বিশাল ড্রয়িংরুমের নরম সোফায় একা বসি, তখন কাঁচের দেয়াল ভেদ করে শহরের কোলাহল কানে এসে বিঁধে। আমি নিজেকে আয়নায় প্রশ্ন করি—আসলেই কি আমি জিতলাম? যাকে জড়িয়ে ধরে কেঁদে বলার কথা ছিল 'বাবা আমি পেরেছি', সে-ই যখন নেই, তখন এই ব্যাংক ব্যালেন্স আর সামাজিক পদমর্যাদার ওজন পৃথিবীর সবচেয়ে ভারী বোঝা বলে মনে হয়।",
    possibleComments: [
      'পড়ে চোখে জল চলে এলো ভাই। বাবা হয়তো ওপর থেকেই আপনার দিকে তাকিয়ে গর্ব করছেন।',
      'সাফল্য তখনই সুন্দর যখন ভাগ করে নেওয়ার মানুষ পাশে থাকে। শক্ত থাকুন ভাই।'
    ]
  },
  {
    id: 'bn_post_3',
    category: 'funny',
    city: 'Kolkata',
    country: 'India',
    author: 'শুভঙ্কর চক্রবর্তী',
    rawImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=75',
    text: "আমাদের সল্টলেকের আইটি অফিসে যখনই কোনো জটিল প্রজেক্ট ডেডলাইন আসে বা অনসাইট ক্লায়েন্ট উল্টোপাল্টা রিকোয়ারমেন্ট নিয়ে মিটিং ডাকে, টিমের সবাই যখন ভয়ে কাঁপতে থাকে, তখন আমি একটা নিজস্ব মাস্টারস্ট্রোক চালাই। আমি ল্যাপটপের ওয়াইফাই চট করে বন্ধ করে দিই, টার্মিনালে কিছু বিদঘুটে পাইথন স্ক্রিপ্ট খুলে রাখি আর কপালে হাত দিয়ে এমন গভীর টেনশনের ভান করে বসে থাকি যেন গোটা গ্লোবাল ক্লাউড আর্কিটেকচার আমি একাই বাঁচাচ্ছি!\n\nগত সপ্তাহে আমাদের নতুন প্রজেক্ট ডিরেক্টর আমার কেবিনের সামনে এসে উঁকি দিলেন, আমার মনিটরে চোখ বুলিয়ে গম্ভীর মুখে বললেন, 'শুভঙ্কর, তোমার এই ডেডিকেশন সত্যিই শিক্ষণীয়। তুমি আমাদের কোম্পানির রিয়েল অ্যাসেট।' এই বলে তিনি নিজে ক্যান্টিন থেকে ফিল্টার কফি আর স্পেশাল কাজু বরফি এনে আমার টেবিলে রেখে গেলেন! আমি তখন মনে মনে হাসতে হাসতে শেষ, অথচ মুখে কাঁচুমাচু ভাব করে বললাম, 'থ্যাংক ইউ স্যার, সিস্টেমটা স্ট্যাবল রাখার চেষ্টা করছি।' এই অভিনয় করতে গিয়ে আমার কনফিডেন্স এখন এত বেড়ে গেছে যে ভয় হয় কোনোদিন সত্যি সার্ভার বসে গেলে এরা হয়তো আমাকে ন্যাশনাল অ্যাওয়ার্ড দিয়ে দেবে!",
    possibleComments: [
      'ভাইরে ভাই! আপনি তো কর্পোরেট অস্কার পাওয়ার দাবিদার 😂',
      'আমাদের অফিসেও এই টেকনিক কাল থেকে ট্রাই করব ভাবছি!'
    ]
  },
  {
    id: 'bn_post_4',
    category: 'incident',
    city: 'Chittagong',
    country: 'Bangladesh',
    author: 'রাকিবুল হাসান',
    rawImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=75',
    text: "গত মাসে এক দূর সম্পর্কের আত্মীয়ের বিয়েতে গিয়েছিলাম চট্টগ্রামের এক নামকরা কনভেনশন সেন্টারে। কাচ্চি বিরিয়ানির পর মিষ্টির কাউন্টারে গিয়ে দেখলাম স্পেশাল ছানার চমচম আর ক্ষীরসা তখনো সাধারণ মেহমানদের জন্য খোলা হয়নি, কাঁচের শোকেসে তুলে রাখা হয়েছে ভিআইপিদের জন্য।\n\nআমি গম্ভীর মুখে সাফারি স্যুট ঠিক করে কাউন্টারের ছেলেটাকে গিয়ে খুব রাশভারি গলায় বললাম, 'শোনো ছোট ভাই, বরের বাবার বড় খালাতো ভাই লন্ডন থেকে আসছেন, উনি ডায়াবেটিসের কারণে সাধারণ মিষ্টি খান না। এই ক্ষীরসা আর স্পেশাল চমচম চার প্লেট ওই ভিআইপি কর্নারে আমার কাছে পাঠিয়ে দাও।' ছেলেটা ভয়ে এমন স্যালুট দিল যেন আমি প্রধানমন্ত্রীর প্রটোকল অফিসার! সে নিজে প্লেট সাজিয়ে আমার টেবিলে দিয়ে গেল। আমি পুরোটা আরামসে খেয়ে ঢেকুর তুললাম, অথচ আসল সত্যি হলো আমি কনের দূর সম্পর্কের মেঝ খালার পাড়ার প্রতিবেশীর বন্ধু! বিয়ের অনুষ্ঠানে একটু আত্মবিশ্বাস আর ভারিক্কি গলার চেয়ে বড় কোনো ভিআইপি পাস পৃথিবীতে নেই।",
    possibleComments: [
      'কনফিডেন্স লেভেল ইনফিনিটি! বিয়েবাড়ির সেরা গল্প শুনলাম আজ 😂',
      'আপনার কাছ থেকে ট্রেনিং নিতে হবে ভাই, স্পেশাল মিষ্টি খাওয়ার টেকনিক দারুণ!'
    ]
  },
  {
    id: 'bn_post_5',
    category: 'intelligent',
    city: 'Kolkata',
    country: 'India',
    author: 'দেবাশিস মুখোপাধ্যায়',
    rawImage: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=700&q=75',
    text: "আমাদের বর্তমান বাঙালি মধ্যবিত্ত সমাজ এমন এক অদ্ভুত সাংস্কৃতিক দেউলিয়াপনার মধ্য দিয়ে যাচ্ছে যেখানে বাহ্যিক চাকচিক্য আর সোশ্যাল মিডিয়ার ভার্চুয়াল অনুমোদনকে মানুষের ব্যক্তিত্বের আসল মাপকাঠি বানিয়ে ফেলা হয়েছে। আমরা রবীন্দ্রভবনে গিয়ে বইমেলায় ভিড় করি ঠিকই, কিন্তু বাড়ি ফিরে ঘণ্টার পর ঘণ্টা রিলস আর শর্টস স্ক্রোল করে নিজেদের মস্তিষ্কের ধৈর্যকে ধ্বংস করি।\n\nযে সমাজ একজন নিষ্ঠাবান বইপড়া চিন্তাশীল মানুষের চেয়ে দামি ব্র্যান্ডের পোশাক পরা কিংবা সস্তা চটুল কন্টেন্ট বানানো মানুষকে বেশি সামাজিক মান্যতা দেয়, সেই সমাজের উন্নতি কেবল বড় বড় শপিং মল আর কংক্রিটের উড়ালপুলেই দেখা যায়, মানুষের মানসিক সুস্থতায় নয়। যুক্তি দিয়ে আপনি হয়তো ফেসবুকের যেকোনো কমেন্ট বক্সে তর্কে জিতে লাইক কুড়াতে পারবেন, কিন্তু ব্যক্তিজীবনে সম্পর্ক ধরে রাখার জন্য যুক্তির চেয়ে নিঃশব্দ সহমর্মিতা অনেক বেশি মূল্যবান। মানুষ যতক্ষণ না বাহ্যিক প্রদর্শনের মোহ ছেড়ে ভেতরের আত্মোপলব্ধির দিকে তাকাচ্ছে, ততক্ষণ তথাকথিত শিক্ষার সার্টিফিকেট থাকা সত্ত্বেও আমরা অশিক্ষিতই থেকে যাব।",
    possibleComments: [
      'অত্যন্ত সময়োপযোগী এবং খাঁটি বাস্তব কথা দেবাশিসদা। সহমত।',
      'সোশ্যাল মিডিয়ার এই সস্তা চাকচিক্য আমাদের আসল শিকড়কে নষ্ট করছে।'
    ]
  },
  {
    id: 'bn_post_6',
    category: 'incident',
    city: 'Faridpur',
    country: 'Bangladesh',
    author: 'কাজী তানিম আহমেদ',
    rawImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=700&q=75',
    text: "পদ্মা সেতু উদ্বোধনের আগের বছর এক শীতের রাতে ফেরিতে করে নদী পার হচ্ছিলাম। প্রচণ্ড ঘন কুয়াশায় মাঝনদীতে ফেরি থেমে যায়, চারপাশ এত ঠান্ডা আর নিস্তব্ধ ছিল যে নিঃশ্বাস ফেলতেও কষ্ট হচ্ছিল। ফেরির ডেকে এক গৃহহীন মা তাঁর অসুস্থ দুধের শিশুকে কোলে নিয়ে শীতে কাঁপছিলেন, তাঁর গায়ে জড়ানোর মতো পর্যাপ্ত গরম কাপড় ছিল না।\n\nঠিক সেই সময় ফেরির এক চা-বিক্রেতা হকার ছেলে, যার নিজের গায়েও ছিল শুধু একটা পুরনো ছেঁড়া সোয়েটার, সে নিজের গায়ের চাদরটা খুলে নিঃসংকোচে সেই শিশুর মায়ের গায়ে জড়িয়ে দিল। তারপর কেটলি থেকে গরম চা ঢেলে সেই মায়ের হাতে দিয়ে বলল, 'আপা, চা-টা খেয়ে একটু শরীর গরম করেন, বাচ্চার কিছু হবে না ইনশাল্লাহ।' পৃথিবীর বড় বড় স্থাপত্য আর আধুনিক প্রযুক্তি হয়তো মানুষের পথ সহজ করে, কিন্তু এই নিঃস্ব হকার ছেলের মতো ক্ষুদ্র ক্ষুদ্র ভালোবাসাই আসলে মানুষের বেঁচে থাকার পৃথিবীটিকে টিকিয়ে রাখে।",
    possibleComments: [
      'এই সাধারণ মানুষগুলোর মানবিকতাই আমাদের দেশটাকে এখনো বাঁচিয়ে রেখেছে।',
      'পড়ে মনটা ভরে গেল। মনুষ্যত্ব কখনো পোশাকে থাকে না।'
    ]
  },
  {
    id: 'bn_post_7',
    category: 'motivational',
    city: 'Kolkata',
    country: 'India',
    author: 'প্রীতম ঘোষ',
    rawImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=75',
    text: "পরাজয় মানেই কিন্তু জীবনের সমাপ্তি নয়; পরাজয় হলো আরও বেশি প্রস্তুতি, আরও গভীর অভিজ্ঞতা নিয়ে পুনরায় ময়দানে নামার এক রাজকীয় অনুমতি। আমরা মানুষরা সমাজের বেঁধে দেওয়া কৃত্রিম টাইমলাইনের পেছনে ছুটতে গিয়ে নিজেদের নিঃস্ব করে ফেলি—পঁচিশেই প্রতিষ্ঠিত হতে হবে, তিরিশেই বাড়ি বানাতে হবে। কিন্তু জীবন কোনো অঙ্কের সূত্রের বাঁধাধরা ছক মেনে চলে না।\n\nএকদিন যে বটগাছটা প্রচণ্ড কালবৈশাখী ঝড়ে সমস্ত ডালপালা হারিয়ে ন্যাড়া হয়ে যায়, সে কিন্তু মাটির নিচে নিজের শিকড়গুলোকে আরও শক্ত করে আঁকড়ে ধরে রাখে। বসন্ত আসার সাথে সাথেই সেই রিক্ত ডালপালাতেই আবার নতুন সবুজ পাতার মেলা বসে। আপনি যদি এই মুহূর্তে চাকরি হারানো, ব্যবসায় লোকসান কিংবা ব্যক্তিগত কোনো ব্যর্থতার অন্ধকার খাদে দাঁড়িয়ে থাকেন, তবে মনে রাখবেন আপনার এই কঠিন সময়টাই আসলে আপনার চরিত্র গঠন করছে। যে মানুষ নিজের আত্মবিশ্বাসের কাছে কখনো মাথা নত করে না, তাকে পৃথিবীর কোনো প্রতিকূল শক্তি চিরতরে পরাজিত করতে পারে না। নিজের স্বপ্নের প্রতি বিশ্বস্ত থাকুন, অন্ধকার কেটে সুপ্রভাত আসবেই।",
    possibleComments: [
      'আজকের এই ক্লান্ত দিনে আপনার এই লেখাটা খুব দরকার ছিল। ধন্যবাদ প্রীতমদা।',
      'শিকড় শক্ত থাকলে কোনো ঝড়ই শেষ করতে পারে না। দারুণ অনুপ্রেরণা।'
    ]
  },
  {
    id: 'bn_post_8',
    category: 'deep',
    city: 'Sylhet',
    country: 'Bangladesh',
    author: 'মাহবুবুল আলম',
    rawImage: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=700&q=75',
    text: "লন্ডনে প্রবাসী জীবনের পনেরো বছর কেটে গেল। ব্যাংকে যথেষ্ট সঞ্চয় আছে, সিলেটে বিশাল অট্টালিকা বানিয়েছি, দেশে থাকা আত্মীয়-স্বজন সবাই ভাবে লন্ডনে থাকা মানেই স্বর্গীয় সুখ। কিন্তু সত্যিটা হলো, এই দেশের বরফশীতল আবহাওয়ায় একাকীত্বের যে ঠান্ডা হাড় কাঁপিয়ে দেয়, তা কোনো দামি হিটার দিয়ে দূর করা যায় না।\n\nপ্রতিটি ঈদের সকালে যখন ফোনে মা-বাবার কাঁপাকাঁপা কণ্ঠ শুনি আর স্ক্রিনের ওপারে দেশে আনন্দের কোলাহল দেখি, তখন নিজের ফ্ল্যাটের নিস্তব্ধতায় ভেতরটা দুমড়ে-মুচড়ে যায়। টাকার প্রয়োজনে মানুষ দেশ ছাড়ে ঠিকই, কিন্তু বয়স বাড়ার সাথে সাথে বুঝতে পারে মাটির গন্ধ, শৈশবের বন্ধুদের হাসিমুখ আর মায়ের হাতের সাধারণ এক বাটি তরকারির চেয়ে বড় কোনো ঐশ্বর্য এই দুনিয়ায় আর দ্বিতীয়টি হতে পারে না। এই পরবাসী খাঁচায় সোনালি শিকল পরে বন্দি থাকার দীর্ঘশ্বাস কেবল একজন প্রবাসীই উপলব্ধি করতে পারে।",
    possibleComments: [
      'প্রবাসীদের এই নীরব কান্নার কথা কেউ বুঝতে চায় না মাহবুব ভাই।',
      'টাকার কাছে আমরা আমাদের আবেগ আর শিকড় বন্ধক রেখে দিয়েছি। বাস্তব সত্যি।'
    ]
  },

  // ----------------- 2. INDIA (HINDI POSTS) -----------------
  {
    id: 'hi_post_1',
    category: 'deep',
    city: 'Mumbai',
    country: 'India',
    author: 'रोहन शर्मा',
    rawImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=700&q=75',
    text: "छोटे शहर से जब पहली बार मुंबई आया था, तो लगता था कि आजादी इसी को कहते हैं। कोई टोकने वाला नहीं, रात को कितनी भी देर से घर आओ कोई पूछने वाला नहीं, अपनी मर्जी का खाना खाओ और जब मन करे सो जाओ। लेकिन जैसे-जैसे साल बीतते गए, इस तथाकथित आजादी का असली खोखलापन सामने आने लगा।\n\nकल रात करीब दो बजे मुझे अचानक बहुत तेज बुखार आ गया। बदन दर्द से टूट रहा था और सिर फटा जा रहा था। जब मैं पानी की बोतल उठाने के लिए बिस्तर से उठा, तो चक्कर खाकर फर्श पर बैठ गया। उस वक्त मेरे फोन में 600 से ज्यादा कॉन्टैक्ट्स थे, सोशल मीडिया पर हजारों लाइक्स आते थे, लेकिन उस रात मेरे पास एक भी ऐसा इंसान नहीं था जिसे मैं बिना झिझक फोन करके ये कह सकूं कि 'यार, मुझे थोड़ा बुखार है, क्या तुम एक बार पैरासिटामोल ला दोगे?' उस ठंडे फर्श पर अकेले बैठकर मुझे समझ आया कि हम जिसे आत्मनिर्भरता कहते हैं, वो कई बार सिर्फ हमारी बेबसी और अकेलेपन का दूसरा नाम होती है। पैसा और नाम कमाना आसान है, लेकिन ऐसे रिश्ते कमाना बहुत मुश्किल जहां आप बिना किसी झिझक के कमजोर पड़ सकें।",
    possibleComments: [
      'महानगरों की यही कड़वी सच्चाई है दोस्त, लाखों की भीड़ में भी इंसान बिल्कुल अकेला है।',
      'अपना ख्याल रखिए भाई, दवा हमेशा कमरे में पहले से रखा कीजिए।'
    ]
  },
  {
    id: 'hi_post_2',
    category: 'funny',
    city: 'Delhi',
    country: 'India',
    author: 'अमित कुमार सिंह',
    rawImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=75',
    text: "कॉरपोरेट की नौकरी में टिके रहने के लिए आदमी को या तो साधु बनना पड़ता है या बहुत बड़ा कलाकार। करीब आठ महीने पहले जब नई टीम लीडर आई जो सुबह 8:30 बजे से कॉल्स शुरू कर देती थी, तो मैंने बहुत मासूमियत से पूरी टीम के सामने यह झूठ फैला दिया कि मुझे एक बहुत ही दुर्लभ 'सर्कैडियन हियरिंग डिसऑर्डर' है, जिसकी वजह से सुबह 11 बजे से पहले किसी फोन की घंटी बजने पर मुझे भयानक चक्कर आने लगते हैं।\n\nमुझे लगा था कि एचआर वाले मेडिकल पर्चा मांगकर मेरी पोल खोल देंगे। लेकिन करिश्मा देखिए—हमारी टीम लीडर ने इतनी ज्यादा हमदर्दी दिखाई कि पूरे डिपार्टमेंट को सख्त ईमेल कर दिया कि 'अमित को सुबह 11:05 से पहले कोई भी डायरेक्ट कॉल न करे'। अब आलम यह है कि पूरी दुनिया सुबह 9 बजे से ऑफिस की चिक-चिक में पिस रही होती है, और मैं आराम से अपनी बालकनी में बैठकर चाय की चुस्कियों के साथ अखबार पढ़ता हूं। ठीक 11:06 पर मेरा पहला कॉल आता है और वो भी बहुत अदब से पूछते हैं—'अमित जी, क्या आपकी तबीयत स्थिर है? क्या अब हम बात कर सकते हैं?' कभी-कभी मुझे अपनी ही चालाकी पर गर्व होने लगता है!",
    possibleComments: [
      'अमित भाई, यह नुस्खा पेटेंट करवा लो! पूरे देश के एम्प्लॉईज दुआएं देंगे 😂🔥',
      'भाई साहब, इसे कहते हैं 200 IQ मूव! गजब!'
    ]
  },
  {
    id: 'hi_post_3',
    category: 'deep',
    city: 'Pune',
    country: 'India',
    author: 'अदिति कुलकर्णी',
    rawImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=75',
    text: "मैंने पिछले सात साल अपने दोस्तों और परिवार में यह साबित करने में बिता दिए कि मैं बहुत मजबूत हूं और मुझे कभी किसी के सहारे की जरूरत नहीं पड़ती। हर किसी के दुख में मैं मौजूद रहती थी, आधी रात को किसी का रोता हुआ फोन आता तो घंटों समझाती थी, आर्थिक मदद करती थी और सबकी नजरों में एक 'सॉर्टेड' लड़की बनी हुई थी। लेकिन जब आप सबको यह यकीन दिला देते हैं कि आप कभी टूट नहीं सकते, तो लोग यह पूछना ही बंद कर देते हैं कि आप अंदर से कैसे हैं।\n\nकल शाम जब ऑफिस से लौटते वक्त बारिश शुरू हुई, तो मैंने अपनी गाड़ी साइड में लगाई और स्टेयरिंग व्हील पर सिर रखकर फूट-फूटकर रो पड़ी। मुझे किसी खास बात का दुख नहीं था, बस इस बात की गहरी थकान थी कि मुझे हमेशा मजबूत बनकर दिखाना पड़ता है। मुझे एहसास हुआ कि अगर मैं कभी मानसिक रूप से पूरी तरह बिखर भी जाऊं, तो मेरे अपनों को पता ही नहीं चलेगा कि मुझे कैसे संभालना है, क्योंकि मैंने कभी उन्हें अपने आंसू दिखाए ही नहीं। यह बनावटी मजबूती इंसान को अंदर से खोखला कर देती है।",
    possibleComments: [
      'कमजोर होना कोई गुनाह नहीं है अदिति, कभी-कभी अपने लिए भी रो लेना चाहिए।',
      'सच्ची बात कही आपने, हमेशा मजबूत रहने का मुखौटा बहुत भारी होता है।'
    ]
  },
  {
    id: 'hi_post_4',
    category: 'funny',
    city: 'Lucknow',
    country: 'India',
    author: 'विकास श्रीवास्तव',
    rawImage: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=700&q=75',
    text: "मेरे घरवाले पिछले छह महीने से पूरे खानदान में मेरी तारीफों के पुल बांध रहे हैं कि विकास अब बहुत सुधर गया है, रोज शाम को 6 बजे ट्रैकसूट पहनकर पार्क में डेढ़ घंटे तक कड़ी रनिंग और कार्डियो करता है। यहां तक कि मम्मी ने रिश्तेदारों को बोल दिया है कि लड़के का स्टैमिना गजब का हो गया है।\n\nसच्चाई यह है कि मैं पार्क के पिछले दरवाजे से चुपके से निकलकर पास वाली मशहूर चाट की दुकान पर जाता हूं। वहां आराम से बैठकर दो प्लेट गरमा-गरम समोसे, खस्ता कचौड़ी और एक बड़ी कोल्ड ड्रिंक उड़ाता हूं। फिर वापस पार्क आकर किसी बेंच पर बैठकर पसीना पोंछते हुए ऐसे गहरी सांसें लेता हूं जैसे अभी-अभी ओलंपिक का मैराथन जीतकर आया हूं। पिछले हफ्ते वजन नापने वाली मशीन पर जब 2 किलो वजन बढ़ा हुआ निकला, तो मैंने घर में सबको यह कहकर समझा दिया कि 'यह फैट नहीं है, यह हैवी मसल्स का वजन है!' मुझे लगता है झूठ बोलने में भी एक अलग ही स्तर की रचनात्मकता चाहिए होती है।",
    possibleComments: [
      'भारी मसल्स का वजन! भाई साहब इतना खतरनाक जस्टिफिकेशन सिर्फ लखनऊ वाले ही दे सकते हैं 😂',
      'समोसे की खुशबू ही ऐसी है कि कोई भी मैराथन छोड़ दे भाई!'
    ]
  },
  {
    id: 'hi_post_5',
    category: 'incident',
    city: 'Agra',
    country: 'India',
    author: 'दीपक यादव',
    rawImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=700&q=75',
    text: "सर्दियों की रात में करीब दो बजे यमुना एक्सप्रेसवे पर मेरी बाइक का पिछला टायर अचानक पंक्चर हो गया। सुनसान हाईवे, घना कोहरा और कड़ाके की ठंड में डर के मारे मेरे हाथ कांप रहे थे। मोबाइल में नेटवर्क भी नहीं आ रहा था और किसी अनहोनी का डर सता रहा था।\n\nकरीब आधा घंटा खड़े रहने के बाद एक पुराना मालवाहक ट्रक रुका। उसका ड्राइवर नीचे उतरा, उसने बिना कोई सवाल पूछे अपना भारी टूलकिट निकाला, करीब बीस मिनट तक ठंड में ठिठुरते हुए मेरी बाइक का टायर ठीक किया और मुझे अपनी थर्मस से गर्म चाय भी पिलाई। जब मैंने हाथ जोड़कर पैसे देने चाहे, तो उसने मुस्कुराकर मना कर दिया और बोला—'बाबूजी, सफर में इंसान ही इंसान के काम आता है, बस घर पहुंच कर अपनी मां को फोन कर देना।' उस रात मुझे हाईवे पर इंसानियत का असली चेहरा देखने को मिला।",
    possibleComments: [
      'सच्ची इंसानियत आज भी जिंदा है। उस ड्राइवर भाई को दिल से सलाम।',
      'हाईवे पर ऐसे देवदूत मिल जाना किसी चमत्कार से कम नहीं होता।'
    ]
  },
  {
    id: 'hi_post_6',
    category: 'motivational',
    city: 'Patna',
    country: 'India',
    author: 'संजय वर्मा',
    rawImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=75',
    text: "जब मैं 35 साल का था, तब मैंने अपनी सुरक्षित नौकरी छोड़कर कोडिंग और सॉफ्टवेयर डेवलपमेंट सीखने का जोखिम भरा फैसला लिया था। उस वक्त मेरे सभी रिश्तेदारों और दोस्तों ने खुलकर कहा था कि मेरा दिमाग खराब हो चुका है और इस उम्र में नई शुरुआत करना सिर्फ अपने पैरों पर कुल्हाड़ी मारना है। शुरुआती डेढ़ साल इतने कठिन थे कि कई बार रात को सिंटैक्स एरर देखकर रोना आ जाता था और लगता था कि शायद मैंने बहुत बड़ी गलती कर दी।\n\nलेकिन उस मुश्किल दौर में मैंने खुद से सिर्फ एक वादा किया था कि चाहे पूरी दुनिया मेरा मजाक उड़ाए, मैं मैदान छोड़कर नहीं भागूंगा। मैंने रोज सुबह 5 बजे उठकर अभ्यास किया, दर्जनों इंटरव्यूज में रिजेक्शन झेले, और बिना हिम्मत हारे खुद को तराशता रहा। आज जब मैं एक ग्लोबल टेक कंपनी में काम कर रहा हूं, तो वही लोग कहते हैं कि 'संजय की तो किस्मत बहुत अच्छी थी'। यह दुनिया केवल आपकी सफलता को देखती है, उसके पीछे छिपी रातों की मेहनत और आंसुओं को नहीं। इसलिए जब आप गिरें, तो लोगों की परवाह किए बिना खुद उठ खड़े होइए; मेहनत कभी खाली नहीं जाती।",
    possibleComments: [
      '35 की उम्र में ऐसा साहस दिखाना हर किसी के बस की बात नहीं। बहुत प्रेरणादायक!',
      'लोग सिर्फ रिजल्ट देखते हैं, प्रोसेस की तपस्या सिर्फ करने वाला जानता है।'
    ]
  },
  {
    id: 'hi_post_7',
    category: 'funny',
    city: 'Bhopal',
    country: 'India',
    author: 'सौरभ पटवर्धन',
    rawImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=700&q=75',
    text: "हमारे हॉस्टल मेस की दाल इतनी पतली होती थी कि उसमें चेहरा देखकर दाढ़ी बनाई जा सकती थी। इस समस्या से निजात पाने के लिए मैंने अपने तीनों रूममेट्स को एक फर्जी रिसर्च पेपर दिखाकर यह यकीन दिला दिया कि हमारे मेस वाले बाबा जो दाल बनाते हैं, उसमें गुप्त हिमालयी जड़ी-बूटी है जो दिमाग की याददाश्त को 300% तेज कर देती है।\n\nअब तमाशा यह है कि मेरे रूममेट्स रोज बाबा के पैर छूकर दाल मांगते हैं और उन्हें महीने का एक्स्ट्रा टिप भी देते हैं ताकि उन्हें दाल की कटोरी में वो 'रहस्यमयी तत्व' ज्यादा मिले! बाबा भी चौड़े होकर मेस में घूमते हैं कि उनका खाना वैज्ञानिक रूप से सिद्ध हो चुका है। अब दाल भले ही पानी जैसी हो, लेकिन कम से कम हॉस्टल में शांति है और रूममेट्स खुश होकर पढ़ाई में टॉप करने के सपने देख रहे हैं!",
    possibleComments: [
      'बाबा की हिमालयी दाल! हॉस्टल के दिनों की याद दिला दी भाई 😂',
      'इसे कहते हैं प्लेसिवो इफेक्ट का असली मास्टरक्लास!'
    ]
  },
  {
    id: 'hi_post_8',
    category: 'intelligent',
    city: 'Varanasi',
    country: 'India',
    author: 'समीक्षा त्रिवेदी',
    rawImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=700&q=75',
    text: "किताबें और दर्शन हमें ज्ञान नहीं देते; वे केवल हमारे मन में पहले से दबे उन सवालों को शब्द देते हैं जिन्हें हम डर के मारे खुद से पूछने की हिम्मत नहीं जुटा पाते थे। काशी के इन प्राचीन घाटों पर बैठकर जब आप जलती हुई चिताओं और बहती गंगा को देखते हैं, तो जीवन की सारी आपाधापी व्यर्थ लगने लगती है।\n\nहम अपनी पूरी जवानी मकान, पद, प्रतिष्ठा और बैंक बैलेंस को बढ़ाने में झोंक देते हैं, यह सोचकर कि एक दिन सब कुछ सुरक्षित हो जाएगा। लेकिन जीवन की सबसे बड़ी विडंबना यह है कि जब तक इंसान जीने की पूरी तैयारी कर पाता है, तब तक जिंदगी के रंगमंच से पर्दा गिरने का समय आ जाता है। समझदारी इस बात में नहीं है कि आपने दुनिया से कितना बटोरा, बल्कि इस बात में है कि आप अपने जाने के बाद पीछे कितनी शांति और प्रेम छोड़ गए।",
    possibleComments: [
      'मणिकर्णिका और दशाश्वमेध के घाटों का यही शाश्वत सत्य है। बहुत सुंदर विचार।',
      'अहंकार की राख होने में एक पल लगता है। गहरी बात कही आपने।'
    ]
  },

  // ----------------- 3. INDIA (URBAN & CORPORATE ENGLISH) -----------------
  {
    id: 'ind_en_post_1',
    category: 'finance',
    city: 'Bengaluru',
    country: 'India',
    author: 'Vikram Razdan',
    rawImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=75',
    text: "Working in Bengaluru’s startup ecosystem has made me realize how efficiently early-stage founders exploit 23-year-olds with shiny LinkedIn buzzwords. For nearly three years in Koramangala, I put in 15-hour days, worked Saturdays, and slept on office beanbags under the intoxicating illusion that we were 'disrupting consumer logistics.' We treated our founder like an oracle and swallowed the 'we are a family' Kool-Aid completely.\n\nLast month, the series-B funding stalled. Without a single warning, the leadership called an unscheduled 4-minute Google Meet, disabled everyone’s Slack channels, and wiped 40% of the engineering floor. The founders who preached loyalty haven’t replied to an email since. Sitting in my 1BHK looking at my physical therapy prescriptions for chronic cervical spondylitis, I finally understood: you are only 'family' to a corporation as long as their runway stays positive. Your physical health, your 8 hours of sleep, and an undisturbed evening dinner are worth infinitely more than any unvested phantom equity.",
    possibleComments: [
      'Every engineer in Bangalore needs to read this. Health before hustle.',
      'The moment funding drops, the family card disappears instantly.',
      'So glad you walked away with clarity. Startups are business, not religion.'
    ]
  },
  {
    id: 'ind_en_post_2',
    category: 'finance',
    city: 'Hyderabad',
    country: 'India',
    author: 'Arjun Rao',
    rawImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=75',
    text: "I earn in US Dollars working remotely from Hyderabad for an EU fintech company. While my college peers commute three hours daily through Hitec City gridlocks and endure aggressive middle management politics, I write Go microservices in my shorts with high-speed fiber internet and take 2 PM afternoon power naps.\n\nPeople think remote work is an antisocial downgrade, but it returned five years of life back to me. I cook fresh meals with my mother, work out during midday off-peak hours at an empty gym, and haven’t looked at a single toxic office appraisal form in twenty-four months. The traditional 9-to-6 office presence was never about productivity—it was about surveillance. Global remote talent arbitrage is the best thing that ever happened to Indian engineering professionals.",
    possibleComments: [
      'Remote work is an absolute blessing. Commute drains your life force.',
      'Surveillance culture in traditional offices is sickening. Happy for you brother!',
      'True wealth is owning your daily calendar.'
    ]
  },
  {
    id: 'ind_en_post_3',
    category: 'deep',
    city: 'Mumbai',
    country: 'India',
    author: 'Ananya Deshmukh',
    rawImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=700&q=75',
    text: "I attended my school reunion in Bandra last Sunday after twelve years. It was terrifying how conversations within three minutes reduced everyone to competitive resumes: flat sizes in Thane vs Andheri, mutual fund portfolios, and whether your toddler is enrolled in an IB curriculum.\n\nNobody asked, 'Are you at peace? Do you still laugh until your stomach hurts?' We spent four hours exchanging rehearsed corporate smiles and pretending our lives match our polished Instagram highlight reels. On the local train back home, looking at tired office workers resting their foreheads against open windows, I realized we haven't grown up—we just traded classroom report cards for net worth spreadsheets.",
    possibleComments: [
      'Reunions are just glorified status auctions now. So relatable.',
      'That line about trading report cards for spreadsheets hit straight home.'
    ]
  },
  {
    id: 'ind_en_post_4',
    category: 'incident',
    city: 'Pune',
    country: 'India',
    author: 'Kabir Joshi',
    rawImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=75',
    text: "I was stranded on the Pune-Bangalore highway at 11:30 PM with a dead battery and pouring rain. Zero network on my phone, empty trucks roaring past, and my wife was sitting nervous in the passenger seat.\n\nA family in an old Maruti Omni stopped behind us. A Sikh gentleman and his teenage son stepped out into the mud without umbrellas, pulled out jump cables, spent thirty cold minutes troubleshooting our alternator, and got our engine roaring. When I offered 2,000 rupees for their kindness, he held my hands, smiled warmly, and said, 'Beta, help the next stranded person you see on the road; that is our only fee.' Genuine goodness doesn’t shout; it quietly shows up when you are at your most vulnerable.",
    possibleComments: [
      'The Sikh community always shows what true seva looks like. Heartwarming!',
      'Passing it forward is the greatest currency on Indian highways.'
    ]
  },

  // ----------------- 4. WORLDWIDE (ENGLISH: TECH, CULTURE, REALITY) -----------------
  {
    id: 'world_post_1',
    category: 'finance',
    city: 'Seattle',
    country: 'USA',
    author: 'David Chen',
    rawImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=75',
    text: "I work as a Staff Systems Engineer at Big Tech pulling in $375,000 a year. Tech influencers on TikTok make this look like endless matcha lattes, 4-hour workweeks, and early retirement in Lake Tahoe. Let me tell you the dark financial comedy behind closed doors.\n\nAfter 42% disappears into state/federal tax and 401(k), another $4,800 a month goes toward a ridiculous 6.8% mortgage on an unremarkable 1980s suburban box in Bellevue. Last Tuesday, our division held an all-hands where an executive beamed about record AI revenue, followed twelve hours later by automated 6:00 AM termination notices axing 300 tenured engineers. Everyone around me is trapped in golden handcuffs: we took on debt calibrated to our astronomical salaries, so nobody can afford to quit, yet everyone stares at their monitor wondering if their badge will stop scanning tomorrow. High compensation without job security isn’t financial independence—it is just a deluxe panic room.",
    possibleComments: [
      'Golden handcuffs are terrifying. The higher the base, the bigger the cliff.',
      'Corporate loyalty is an engineered myth. Glad someone earning in this bracket called it out.',
      'Spot on. Peace of mind and zero debt beat a $300k W-2 every single day.'
    ]
  },
  {
    id: 'world_post_2',
    category: 'finance',
    city: 'London',
    country: 'United Kingdom',
    author: 'Charlotte Evans',
    rawImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=75',
    text: "London’s silent housing inflation has reduced our entire generation to high-earning financial hostages. I am 31, working as an actuarial consultant in the Square Mile, drawing what was historically considered a very handsome salary. Yet, over 52% of my net income disappears into a drafty two-bedroom flatshare in Peckham where the radiator rattles like a machine gun.\n\nMy father purchased a four-bedroom Victorian detached house with a landscaped garden in Surrey in 1988 on a single mid-level civil service income. Today, two university-educated professionals pulling six figures combined can barely survive the mortgage stress tests without borrowing six-figure deposits from the 'Bank of Gran'. We walk around with designer keep-cups pretending we are thriving urban cosmopolitans, but half the professionals I know are internally terrified they will still be paying arbitrary private landlord fees when their hair turns gray.",
    possibleComments: [
      'Zone 3 flatshare on a senior actuarial salary speaks volumes about London today.',
      'The generational wealth disparity in housing is insane. Hard work doesn’t buy land anymore.',
      'Accurate down to the rattling radiator. Renting dignity is exhausting.'
    ]
  },
  {
    id: 'world_post_3',
    category: 'finance',
    city: 'Singapore',
    country: 'Singapore',
    author: 'Marcus Tan',
    rawImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=700&q=75',
    text: "For the last four years, I have successfully operated a fully remote distributed cloud DevOps boutique while convincing my extended family that I am just a perpetually struggling freelance administrator who barely pays his electric bills. Why? Because the moment Asian relatives suspect you earn high US dollars while sitting in shorts, Chinese New Year transforms into a predatory circus of unsolicited business pitches, wedding loans, and emotional extortion.\n\nI drive an unpolished 2016 Japanese hatchback, wear $10 plain black t-shirts, and live in a modest apartment. Meanwhile, my automated global index portfolio and treasury yields quietly fund enough capital gains to buy luxury condominiums outright. Stealth wealth is the ultimate psychological superpower. When you lose the juvenile urge to prove your financial worth through luxury watches, European badges, and loud social media captions, you buy back 100% of your personal peace.",
    possibleComments: [
      'Stealth wealth is the true flex. The less your relatives know, the happier you live.',
      'Driving an old reliable car while having seven figures in equities is real freedom.',
      'Smartest life choice in Asia. Loud wealth brings drama, quiet wealth brings peace.'
    ]
  },
  {
    id: 'world_post_4',
    category: 'finance',
    city: 'San Francisco',
    country: 'USA',
    author: 'Elena Rostova',
    rawImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=75',
    text: "The tech industry's latest obsession with 'hyper-efficiency' is hilarious theater. My team spent three solid months conducting forty agile alignment meetings, hiring two external McKinsey consultants, and building complex internal telemetry dashboards—all designed to discover how to save $14,000 on cloud server bandwidth.\n\nMeanwhile, in the very same fiscal quarter, our marketing vice president authorized an $800,000 private yacht conference in Miami for thirty executives that produced exactly zero enterprise leads. Corporate budget allocation is completely disconnected from baseline logic. If you are a junior engineer losing sleep over meeting story points or trimming database queries, relax. Half of enterprise tech is just grown adults in branded Patagonia vests inventing arbitrary metrics to justify their continued existence.",
    possibleComments: [
      'The Patagonia vest description is viciously accurate 😂',
      'Saving $14k on AWS while spending $800k on executive offsites is corporate poetry.',
      'This hits so hard. The bureaucracy creates problems just to solve them.'
    ]
  },
  {
    id: 'world_post_5',
    category: 'deep',
    city: 'Toronto',
    country: 'Canada',
    author: 'Marcus Vance',
    rawImage: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=700&q=75',
    text: "I kept my mother's last voicemails saved on an old encrypted hard drive for four years after she passed from dementia. For forty-eight months, I was too terrified to click on those files because I knew hearing her voice would dismantle the fragile emotional fortress I had spent years constructing.\n\nYesterday, while cleaning out my storage room, my laptop glitched and accidentally auto-played an audio recording from November 2020. It wasn't profound or dramatic; she was simply complaining about vegetable prices at the local farmers market and asking if I had remembered to wear my warm coat. Hearing that mundane, gentle motherly nag completely broke me. I pulled over on the side of the highway and wept for forty minutes straight. We construct these towering monuments of resilience, convincing ourselves we have healed, when in truth, grief is just a dormant visitor waiting for a familiar frequency to remind us of everything we permanently lost.",
    possibleComments: [
      'Grief never shrinks, Marcus; our lives just grow around it. Sending warmth.',
      'Those mundane daily check-ins are the things we end up missing the most.',
      'Thank you for sharing this. Made me call my mom immediately.'
    ]
  },
  {
    id: 'world_post_6',
    category: 'funny',
    city: 'Chicago',
    country: 'USA',
    author: 'Natalie Gallagher',
    rawImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=75',
    text: "Last Friday afternoon at 4:45 PM, our regional manager sprang an unscheduled sixty-slide review meeting on the entire department. Realizing I had concert tickets across town at 6:30, I employed an acting stunt I had been rehearsing in the mirror for weeks.\n\nWhenever the manager directed a slide question toward me, I unmuted my microphone and systematically opened and closed my mouth in exaggerated silence while periodically clicking my pen against the desk to simulate digital packet distortion. Within two minutes, the entire executive panel was typing in chat: 'Natalie, your audio interface is completely fried, don't worry, drop off and send your notes on Monday.' I exited the call in under thirty seconds, walked into the pub, and enjoyed my weekend. The key to successful corporate slacking is never complaining about technology; simply let technology appear to complain about you.",
    possibleComments: [
      'The pen-clicking packet loss simulation is elite engineering 😂',
      'Stealing this for our mandatory Friday retrospective next week!'
    ]
  },
  {
    id: 'world_post_7',
    category: 'incident',
    city: 'Munich',
    country: 'Germany',
    author: 'Lukas Weber',
    rawImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=700&q=75',
    text: "Five summers ago, I found myself stranded at a desolate rural railway junction in eastern Romania after a pickpocket stole my travel wallet and passport. I spoke zero Romanian, and the night station master spoke no English or German.\n\nSeeing my visible panic, the elderly station master gently motioned me into his tiny signal room. He pulled out his personal metal thermos of mint tea, sliced a loaf of dense country bread, and handed me enough local currency from his desk drawer to purchase a regional ticket to the embassy in Bucharest. When I offered my silver wristwatch as collateral, he pushed my hand back and pointed toward the ceiling. True benevolence transcended every linguistic barrier that evening.",
    possibleComments: [
      'Kindness is the only universal language that needs no translation.',
      'Stories like this restore faith in pure human empathy.'
    ]
  },
  {
    id: 'world_post_8',
    category: 'motivational',
    city: 'Stockholm',
    country: 'Sweden',
    author: 'Niel Berg',
    rawImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=700&q=75',
    text: "At twenty-eight years old, I experienced the total collapse of my professional and personal life within a four-month window. My bootstrap tech startup dissolved into debt, my savings evaporated, and my five-year engagement ended because the instability became unsustainable. I remember lying on a carpet in an unfurnished apartment convinced that adulthood had permanently defeated me.\n\nDuring that dark season, an elder artisan told me: 'When an oak branch is bent violently under frozen snow, it is not broken; it is storing kinetic vitality to spring back toward the sun.' I swallowed my bruised pride, took low-paying junior freelance work, lived on oats, and rebuilt my craft line by line. Today, at thirty-four, I run a calm, sustainable design studio, married to a true partner. Rock bottom was not my grave; it was the granite bedrock upon which I built an unshakeable character.",
    possibleComments: [
      'Rock bottom as bedrock is a line I will carry with me for a long time.',
      'Thank you for this reminder that seasons change.'
    ]
  },
  {
    id: 'world_post_9',
    category: 'intelligent',
    city: 'Athens',
    country: 'Greece',
    author: 'Dr. Aris Vassiliou',
    rawImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=75',
    text: "The modern internet did not set out to build communities; it engineered digital panopticons designed to turn private insecurity into monetizable ad clicks. In earlier centuries, when a human being experienced an idle afternoon, that boredom acted as the fertile soil for contemplation, philosophy, and creative expression.\n\nToday, the microsecond a pause enters your conscious mind, an algorithm rushes in with fifty hyper-personalized stimuli calibrated precisely to trigger indignation, tribal defensiveness, or envy. We have effectively outsourced our internal emotional equilibrium to commercial servers. The tragedy of our generation is not that we lack information; we are drowning in noise while starving for wisdom. When you systematically strip silence away from human life, you eliminate the only mirror in which a soul can truly examine its own contradictions.",
    possibleComments: [
      'Drowning in noise while starving for wisdom. Brilliant philosophical summary.',
      'Digital panopticon is the most fitting word for current social media.'
    ]
  },
  {
    id: 'world_post_10',
    category: 'funny',
    city: 'London',
    country: 'United Kingdom',
    author: 'Oliver Wright',
    rawImage: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=75',
    text: "Nearly three years ago, my flatmate and I were locked in a war over household chores. I despised vacuuming because our vintage hoover shrieked like an aircraft turbine. To permanently evade my cleaning shift, I covered my ears, looked at him with tragic gravity, and claimed that specific high-pitch frequencies triggered my acute auditory vertigo.\n\nI anticipated him calling my bluff. Instead, he took it with absurdly profound sympathy. He spent an entire weekend researching acoustic sensitivities, discarded the vacuum into the communal skip, and purchased three traditional wooden brooms. For thirty-six continuous months, this man has swept our sprawling four-bedroom Victorian flat purely with brooms and dustpans. Whenever a neighbor upstairs runs a washing machine on spin cycle, he knocks softly on my door, brings me chamomile tea, and asks if my inner ear is holding up. I am trapped in an elaborate farce of my own creation, and if I ever tell him the truth, he will likely murder me with the broom.",
    possibleComments: [
      'The chamomile tea gesture is peak British comedy 😂',
      'You must take this secret to your grave Oliver, no other way out!'
    ]
  },
  {
    id: 'world_post_11',
    category: 'deep',
    city: 'Dublin',
    country: 'Ireland',
    author: 'Clara Byrne',
    rawImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=75',
    text: "The heaviest realization about forgiving someone who never apologized is accepting that you must privately clean up the emotional debris of a storm you didn't create. For three years, I waited for an acknowledgment, a single message acknowledging the cruelty with which they walked out after a decade of shared history.\n\nThat message never came, and it never will. They are currently living their life across town, attending dinners, posting vacations, completely comfortable in the narrative where they were entirely blameless. Last night, I finally deleted the remaining unsent drafts in my inbox and poured out the vintage wine we bought for our cancelled anniversary. True forgiveness isn't absolution for the person who injured you; it is the exhausting, quiet labor of letting go of the hope for a better past so you don't poison your own tomorrow.",
    possibleComments: [
      'Cleaning up debris from a storm you didn’t create... so raw and accurate.',
      'Letting go of a better past is the hardest part. Proud of you Clara.'
    ]
  },
  {
    id: 'world_post_12',
    category: 'intelligent',
    city: 'Kyoto',
    country: 'Japan',
    author: 'Kenji Sato',
    rawImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=75',
    text: "The greatest threat of our era is not that artificial intelligence will surpass human intellect; it is that human beings are voluntarily downgrading their own critical thinking, emotional discernment, and empathy to resemble algorithmic outputs.\n\nWe consume summaries instead of literature, tweets instead of nuanced essays, and algorithmic playlists instead of cohesive albums. By prioritizing hyper-efficiency over depth, we are amputating our capacity for sustained reflection. Machines were meant to liberate humanity to pursue art, philosophy, and compassion; instead, humans are exhausting themselves acting like processors while algorithms generate art.",
    possibleComments: [
      'Humans acting like processors while algorithms generate art. Devastatingly true.',
      'We are losing the art of deep reading and contemplation.'
    ]
  },
  {
    id: 'world_post_13',
    category: 'incident',
    city: 'Rome',
    country: 'Italy',
    author: 'Matteo Rossi',
    rawImage: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=700&q=75',
    text: "I witnessed a minor vehicular collision at an extremely congested roundabout near Trastevere during peak evening traffic. In most metropolises, this would instantly descend into screaming, threats, and police reports.\n\nBoth drivers stepped out of their battered Fiats, evaluated the scratched bumper, looked at each other's tired eyes, and simultaneously sighed. Instead of arguing, one driver pulled out a freshly baked box of cannoli from his backseat, offered it to the other, and they stood on the cobblestones laughing and exchanging bakeries while directing traffic around them. Rome reminded me that afternoon that warmth is a deliberate choice.",
    possibleComments: [
      'Only in Rome does a car accident end with fresh cannoli and laughter 😂❤️',
      'Choosing warmth over rage is true civility.'
    ]
  },
  {
    id: 'world_post_14',
    category: 'motivational',
    city: 'Oslo',
    country: 'Norway',
    author: 'Daniel Kvam',
    rawImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=700&q=75',
    text: "Stop apologizing for outgrowing people, environments, and mindsets that require you to shrink in order to keep them comfortable. You owe your future self the discipline to walk away from spaces that no longer stimulate your evolution.\n\nThe ocean does not apologize for its depth, and mountains do not apologize for their incline. Stand tall in the integrity of your purpose, embrace the solitary stretches of the climb, and understand that peace is far more lucrative than approval.",
    possibleComments: [
      'Peace is far more lucrative than approval. Pure gold.',
      'Needed this reminder as I start my solitary journey this month.'
    ]
  }
];

const ENGAGEMENT_REACTIONS = ['❤️', '🤗', '😢', '👏', '🔥', '😂', '🙏'];

/**
 * Intelligent Script & Region Language Matcher:
 * - Bengali Script, Bangladesh, Kolkata => 'bn' (Bangla)
 * - Devanagari Script => 'hi' (Hindi)
 * - Global locations & Indian English => 'en' (English)
 */
export function detectLanguageFromTextOrLocation(text: string, city: string, country: string): 'bn' | 'hi' | 'en' {
  if (/[\u0980-\u09FF]/.test(text) || country === 'Bangladesh' || city === 'Kolkata') return 'bn';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  return 'en';
}

/**
 * Browser Canvas Image Compressor (strictly under 50KB JPG Base64)
 */
export async function compressUrlToUnder50KB(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_DIM = 750;
        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(FALLBACK_LIGHTWEIGHT_JPEG);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.65;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        while (dataUrl.length > 65000 && quality > 0.2) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      } catch {
        resolve(FALLBACK_LIGHTWEIGHT_JPEG);
      }
    };
    img.onerror = () => resolve(FALLBACK_LIGHTWEIGHT_JPEG);
    img.src = imageUrl;
  });
}

function getUsedPostIds(): Set<string> {
  try {
    const raw = localStorage.getItem(USED_POST_IDS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function recordUsedPostId(id: string) {
  try {
    const used = getUsedPostIds();
    used.add(id);
    localStorage.setItem(USED_POST_IDS_KEY, JSON.stringify(Array.from(used)));
  } catch (e) {
    console.error('Failed to record used post id', e);
  }
}

function getLiveSimulatedPosts(): Confession[] {
  try {
    const raw = localStorage.getItem(LIVE_SIMULATED_POSTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLiveSimulatedPosts(posts: Confession[]) {
  try {
    localStorage.setItem(LIVE_SIMULATED_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save live simulated posts', e);
  }
}

/**
 * PROGRESSIVE ENGAGEMENT ENGINE:
 * 0-10m: Fresh post (0 comments, 2-4 likes)
 * 10-30m: 1 realistic comment unlocks, 6-9 likes
 * 30-90m: 2 comments unlock, 16-24 likes
 * 90m+: All comments unlock, 30+ likes & views
 */
function updateSimulatedPostProgression(posts: Confession[]): Confession[] {
  const now = Date.now();

  return posts.map((post: any) => {
    const poolItem = CURATED_POST_POOL.find((p) => p.id === post.id);
    if (!poolItem) return post;

    const postTime = typeof post.createdAt === 'number' ? post.createdAt : new Date(post.createdAt).getTime() || now;
    const ageInMinutes = Math.max(0, Math.floor((now - postTime) / (60 * 1000)));

    let targetCommentsCount = 0;
    let baseLikes = 2;

    if (ageInMinutes < 10) {
      targetCommentsCount = 0;
      baseLikes = 2 + (post.id.length % 3);
    } else if (ageInMinutes < 30) {
      targetCommentsCount = Math.min(1, poolItem.possibleComments.length);
      baseLikes = 6 + (post.id.length % 4);
    } else if (ageInMinutes < 90) {
      targetCommentsCount = Math.min(2, poolItem.possibleComments.length);
      baseLikes = 16 + (post.id.length % 8);
    } else {
      targetCommentsCount = poolItem.possibleComments.length;
      baseLikes = 30 + (post.id.length % 22);
    }

    const visibleComments = poolItem.possibleComments.slice(0, targetCommentsCount).map((cText, idx) => {
      const commentTime = postTime + (idx + 1) * (14 * 60 * 1000);
      return {
        id: `comm_${post.id}_${idx}`,
        author: 'Anonymous',
        text: cText,
        createdAt: commentTime,
      };
    });

    return {
      ...post,
      likesCount: baseLikes,
      likes: baseLikes,
      commentsCount: visibleComments.length,
      comments: visibleComments.length,
      commentsList: visibleComments,
      viewsCount: Math.max(post.viewsCount || 10, baseLikes * 7 + ageInMinutes * 2),
    };
  });
}

async function buildInitialConfession(item: SimulatedPostItem, timestamp: number): Promise<Confession> {
  const compressedImageJpg = await compressUrlToUnder50KB(item.rawImage);

  return {
    id: item.id,
    authorName: item.author,
    text: item.text,
    city: item.city,
    country: item.country,
    region: `${item.city}, ${item.country}`,
    imageUrl: compressedImageJpg,
    createdAt: timestamp,
    likesCount: 2,
    likes: 2,
    commentsCount: 0,
    comments: 0,
    commentsList: [],
    viewsCount: 15,
    userReaction: ENGAGEMENT_REACTIONS[Math.floor(Math.random() * ENGAGEMENT_REACTIONS.length)],
  } as any;
}

/**
 * DRIP FEED LOGIC: 2-3 POSTS PER HOUR (~22 mins interval)
 * - Auto flushes outdated cache versions to prevent old stuck posts
 * - Automatically sorts so newest post is ALWAYS at the top
 */
export async function syncSimulatedActivity(existingPosts: Confession[]): Promise<Confession[]> {
  const OUTDATED_KEYS = [
    'open_confess_simulated_posts_v3',
    'open_confess_last_sim_date_v3',
    'openconfess_simulated_feed_pool_v2',
    'openconfess_live_simulated_posts_v1',
    'openconfess_live_simulated_posts_v2',
    'openconfess_live_simulated_posts_v3',
    'openconfess_live_simulated_posts_v4',
    'openconfess_live_simulated_posts_v5',
    'openconfess_live_simulated_posts_v6',
    'openconfess_live_simulated_posts_v7',
    'openconfess_live_simulated_posts_v8'
  ];
  OUTDATED_KEYS.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
  });

  let livePosts = getLiveSimulatedPosts();
  const usedIds = getUsedPostIds();
  const now = Date.now();

  // Initial Seed if storage is empty
  if (livePosts.length === 0) {
    const available = CURATED_POST_POOL.filter((p) => !usedIds.has(p.id));
    const firstTwo = available.slice(0, 2);

    for (let idx = 0; idx < firstTwo.length; idx++) {
      const item = firstTwo[idx];
      const pastTime = now - (idx + 1) * 35 * 60 * 1000;
      const post = await buildInitialConfession(item, pastTime);
      livePosts.push(post);
      recordUsedPostId(item.id);
    }

    saveLiveSimulatedPosts(livePosts);
    localStorage.setItem(LAST_SIMULATION_TIMESTAMP_KEY, String(now));
  }

  // 22-minute gap limiter
  const lastPostTime = Number(localStorage.getItem(LAST_SIMULATION_TIMESTAMP_KEY) || 0);
  const DRIP_INTERVAL = 22 * 60 * 1000;

  if (now - lastPostTime >= DRIP_INTERVAL) {
    const freshAvailable = CURATED_POST_POOL.filter((p) => !usedIds.has(p.id));

    if (freshAvailable.length > 0) {
      const nextItem = freshAvailable[0];
      const newDripPost = await buildInitialConfession(nextItem, now);

      livePosts.unshift(newDripPost);
      recordUsedPostId(nextItem.id);
      saveLiveSimulatedPosts(livePosts);
      localStorage.setItem(LAST_SIMULATION_TIMESTAMP_KEY, String(now));
    }
  }

  livePosts = updateSimulatedPostProgression(livePosts);
  saveLiveSimulatedPosts(livePosts);

  const existingIdSet = new Set(existingPosts.map((p) => String(p.id)));
  const filteredSimulated = livePosts.filter((p) => !existingIdSet.has(String(p.id)));

  // Combine and sort strictly by Newest First
  const allPosts = [...existingPosts, ...filteredSimulated];
  return allPosts.sort((a, b) => {
    const timeA = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt).getTime() || 0;
    const timeB = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt).getTime() || 0;
    return timeB - timeA;
  });
}

/**
 * Progressive engagement for newly created user posts
 */
export function scheduleEngagementForNewPost(
  confession: Confession,
  onUpdate: (data: { likesCountIncrement?: number; newComment?: any }) => void
) {
  const postText = (confession as any).text || '';
  const city = (confession as any).city || '';
  const country = (confession as any).country || '';
  const lang = detectLanguageFromTextOrLocation(postText, city, country);

  const reactionComments: Record<string, string[]> = {
    bn: [
      'কথাগুলো একদম মনের গভীরে গিয়ে লাগলো। আপনার প্রতি অনেক শ্রদ্ধা।',
      'আমরা অনেকেই এই কষ্টটা নীরবে বয়ে বেড়াই। ভালো থাকুন আপনি।'
    ],
    hi: [
      'यह बात सीधे दिल को छू गई। बहुत हिम्मत चाहिए ऐसा सच स्वीकार करने के लिए।',
      'आप अकेले नहीं हैं दोस्त, खुद पर भरोसा रखिए।'
    ],
    en: [
      'This resonated with me on such an intimate level. Thank you for speaking your truth.',
      'Quiet battles are often the heaviest to carry. Sending peace.'
    ]
  };

  const pool = reactionComments[lang] || reactionComments.en;

  setTimeout(() => {
    onUpdate({ likesCountIncrement: 1 });
  }, 8000 + Math.random() * 7000);

  setTimeout(() => {
    onUpdate({
      newComment: {
        id: `sim_user_comm_${Date.now()}`,
        author: 'Anonymous',
        text: pool[Math.floor(Math.random() * pool.length)],
        createdAt: Date.now(),
      },
    });
  }, 90000 + Math.random() * 60000);
}
