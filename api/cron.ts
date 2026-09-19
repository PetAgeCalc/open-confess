import type { VercelRequest, VercelResponse } from '@vercel/node';

const POSTS_PROJECT_ID = 'open-confees';
const POSTS_API_KEY = 'AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8';
const INTERACTIONS_PROJECT_ID = 'ageless-lamp-461817-i8';
const INTERACTIONS_API_KEY = 'AIzaSyBnbNobd6s1GY9c7bdt6aEhPxP26Wa2VF4';
const CLOUD_NAME = 'xjdv4l6v';

interface RealSource {
  category: string;
  lang: 'English' | 'Hindi' | 'Bengali';
  city: string;
  country: string;
  query: string;
  tags: string;
}

const SOURCES: RealSource[] = [
  // News & Politics
  { category: 'News & Breaking Headlines', lang: 'English', city: 'London', country: 'UK', query: 'world+breaking+news', tags: '#BreakingNews #WorldNews #Headlines' },
  { category: 'News & Breaking Headlines', lang: 'Hindi', city: 'Delhi', country: 'India', query: 'bharat+samachar+breaking', tags: '#ताज़ाखबर #BreakingNews #देशदुनिया' },
  { category: 'News & Breaking Headlines', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'kolkata+khobor+breaking', tags: '#ব্রেকিংনিউজ #আজকেরখবর #কলকাতা' },
  
  // Cricket & Football
  { category: 'Cricket Mania', lang: 'English', city: 'Dubai', country: 'UAE', query: 'international+cricket+match', tags: '#CricketTwitter #MatchDay #ICC' },
  { category: 'Cricket Mania', lang: 'Hindi', city: 'Mumbai', country: 'India', query: 'cricket+ipl+bcci+match', tags: '#CricketHindi #IPL #BCCI' },
  { category: 'Cricket Mania', lang: 'Bengali', city: 'Chittagong', country: 'Bangladesh', query: 'cricket+khela+live', tags: '#ক্রিকেট #টিমবাংলাদেশ #CricketCraze' },
  { category: 'Football & World Sports', lang: 'English', city: 'Manchester', country: 'UK', query: 'premier+league+football', tags: '#FootballLive #UCL #MatchDay' },

  // Entertainment
  { category: 'Entertainment, Cinema & Pop Culture', lang: 'English', city: 'Los Angeles', country: 'USA', query: 'hollywood+movies+box+office', tags: '#CinemaLovers #Hollywood #PopCulture' },
  { category: 'Entertainment, Cinema & Pop Culture', lang: 'Hindi', city: 'Mumbai', country: 'India', query: 'bollywood+cinema+release', tags: '#बॉलीवुड #CinemaReview #BoxOfficeHit' },
  { category: 'Entertainment, Cinema & Pop Culture', lang: 'Bengali', city: 'Kolkata', country: 'India', query: 'tollywood+bangla+cinema', tags: '#টলিউড #বাংলাসিনেমা #বিনোদনবার্তা' },

  // Memes / Funny
  { category: 'Funny, Memes & Sarcasm', lang: 'English', city: 'New York', country: 'USA', query: 'trending+memes+funny', tags: '#FunnyTweet #MemeDaily #Sarcasm' },
  { category: 'Funny, Memes & Sarcasm', lang: 'Hindi', city: 'Pune', country: 'India', query: 'funny+jokes+memes+viral', tags: '#मजेदारमीम्स #देसीह्यूमर #हंसतेरहो' },
  { category: 'Funny, Memes & Sarcasm', lang: 'Bengali', city: 'Howrah', country: 'India', query: 'bangla+comedy+memes+viral', tags: '#মজারপোস্ট #হাসিরট্রিক #বাঙালিমিমস' }
];

// Strict Category Comments
const CATEGORY_COMMENTS: Record<string, { English: string[]; Hindi: string[]; Bengali: string[] }> = {
  'News & Breaking Headlines': {
    English: ['Following this breaking situation closely.', 'Hope the authorities take immediate action.', 'Thanks for the timely update.'],
    Hindi: ['सुबह से इस खबर की चर्चा चल रही है।', 'प्रशासन को तुरंत ध्यान देना चाहिए।', 'सटीक और जरूरी अपडेट भाई।'],
    Bengali: ['সকাল থেকেই এই খবরটা নিয়ে তোলপাড় চলছে।', 'প্রশাসনের দ্রুত ব্যবস্থা নেওয়া দরকার।', 'সঠিক সময় লাইভ আপডেট দেওয়ার জন্য ধন্যবাদ।']
  },
  'Cricket Mania': {
    English: ['What an absolute nail-biting encounter!', 'That over was pure cinema.', 'Cricket at its absolute peak!'],
    Hindi: ['क्या गजब का मैच हुआ भाई!', 'लास्ट ओवर में दिल की धड़कनें तेज हो गई थीं।', 'ये खिलाड़ी सच में मैच विनर है।'],
    Bengali: ['কী রোমাঞ্চকর ম্যাচ ছিল কালকের!', 'এই ওভারটা ইতিহাস হয়ে থাকবে।', 'পরের ম্যাচটায় জিততেই হবে আমাদের।']
  },
  'Football & World Sports': {
    English: ['Pure class and determination on the pitch.', 'That goal was unbelievable!', 'The stadium atmosphere was electric.'],
    Hindi: ['क्या शानदार खेल दिखाया टीम ने!', 'रोंगटे खड़े कर देने वाला मैच था।', 'फुटबॉल का असली रोमांच यही है।'],
    Bengali: ['ইনজুরি টাইমের গোলটা অবিশ্বাস্য ছিল!', 'স্টেডিয়ামের পরিবেশটা দেখার মতো ছিল।', 'দারুণ ট্যাকটিকাল গেম খেলেছে।']
  },
  'Entertainment, Cinema & Pop Culture': {
    English: ['Loved the visual direction and acting!', 'Booking tickets for this weekend for sure.', 'Truly worth all the hype.'],
    Hindi: ['फर्स्ट डे देखा था, पूरा पैसा वसूल!', 'अभिनय सच में काबिले तारीफ था।', 'गाने भी बहुत कमाल के बने हैं।'],
    Bengali: ['সিনেমাটা অসাধারণ হয়েছে, সবার দেখা উচিত!', 'ব্যাকগ্রাউন্ড মিউজিকটা পুরো গায়ে কাঁটা দিল।', 'উইকএন্ডের প্ল্যান রেডি হয়ে গেল।']
  },
  'Funny, Memes & Sarcasm': {
    English: ['I cannot stop laughing at this!', 'The accuracy in this hurts.', 'Shared to my group chat immediately!'],
    Hindi: ['हंसते-हंसते लोटपोट हो गए!', 'ये तो मेरे ही दोस्त की हरकत लग रही है।', 'सेंस ऑफ ह्यूमर कमाल है भाई आपका।'],
    Bengali: ['হাসতে হাসতে পেট ব্যথা হয়ে গেল ভাই!', 'একদম নিখুঁত কমেডি টাইমিং।', 'বন্ধুদের গ্রুপে এখনই পাঠাচ্ছি হাসির জন্য।']
  }
};

const BENGALI_USERNAMES = ['ChaKhorKolkata', 'Anamika_99', 'ShohorerChithi', 'KolkataMemes', 'EkaPothik', 'PadmaPar'];
const HINDI_USERNAMES = ['DilliWalaShayar', 'MemeBoiIndia', 'ZindagiDiary', 'ChaiLoverAmit', 'SapnoKaShehar', 'KhamoshMusafir'];
const GLOBAL_USERNAMES = ['SilentVoyager', 'MidnightEcho', 'CityLightsSoul', 'PixelNomad', 'DailyByte', 'CafeHopperJoe'];

function getUsername(lang: 'English' | 'Hindi' | 'Bengali'): string {
  if (Math.random() < 0.35) return 'Anonymous';
  if (lang === 'Bengali') return BENGALI_USERNAMES[Math.floor(Math.random() * BENGALI_USERNAMES.length)];
  if (lang === 'Hindi') return HINDI_USERNAMES[Math.floor(Math.random() * HINDI_USERNAMES.length)];
  return GLOBAL_USERNAMES[Math.floor(Math.random() * GLOBAL_USERNAMES.length)];
}

function detectLang(text: string): 'English' | 'Hindi' | 'Bengali' {
  if (/[\u0980-\u09FF]/.test(text)) return 'Bengali';
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi';
  return 'English';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const target = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    
    // Live Real News/Topic Fetching from Google News RSS
    const hlCode = target.lang === 'Bengali' ? 'bn' : target.lang === 'Hindi' ? 'hi' : 'en-IN';
    const glCode = target.lang === 'English' ? 'US' : 'IN';
    const rssUrl = `https://news.google.com/rss/search?q=${target.query}+when:24h&hl=${hlCode}&gl=${glCode}&ceid=${glCode}:${hlCode}`;
    const rssJsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    let realHeadline = '';
    let realMediaPhoto = '';

    try {
      const feedRes = await fetch(rssJsonUrl, { signal: AbortSignal.timeout(4500) });
      if (feedRes.ok) {
        const feedData = await feedRes.json();
        const items = feedData.items || [];
        for (const item of items) {
          if (item.title && item.title.length > 20) {
            realHeadline = item.title.split(' - ')[0]; // Source name hatana
            
            // Image extract karna
            if (item.enclosure && item.enclosure.link && !item.enclosure.link.endsWith('.mp4')) {
              realMediaPhoto = item.enclosure.link;
            } else if (item.description) {
              const m = item.description.match(/src="([^"]+)"/i);
              if (m && m[1]) realMediaPhoto = m[1];
            }
            if (realHeadline) break;
          }
        }
      }
    } catch (e) {}

    // Agar RSS image na de toh us specific category ki exact real photo (No puppy/dog photo in news!)
    if (!realMediaPhoto) {
      const tagMap: Record<string, string> = {
        'News & Breaking Headlines': 'breaking-news',
        'Cricket Mania': 'cricket-match',
        'Football & World Sports': 'football-stadium',
        'Entertainment, Cinema & Pop Culture': 'movie-theater',
        'Funny, Memes & Sarcasm': 'funny-meme'
      };
      const cleanTag = tagMap[target.category] || 'world-city';
      realMediaPhoto = `https://loremflickr.com/720/480/${cleanTag}?random=${Date.now() % 1000}`;
    }

    // AI se 90-100 words ka proper ground-reality tweet
    const topicText = realHeadline || `${target.category} ground discussion in ${target.city}`;
    const langRule = target.lang === 'Bengali' ? 'Bengali (বাংলা হরফ)' : target.lang === 'Hindi' ? 'Hindi (देवनागरी)' : 'English';

    const prompt = `Write a viral real-world citizen post for X (formerly Twitter) about: "${topicText}".
Location: ${target.city}, ${target.country}.
Language: Strictly ${langRule}.
STRICT MANDATORY RULES:
1. TOTAL WORD COUNT: MUST be strictly between 90 and 100 words. (Do not write a short summary).
2. TONE: Common citizen eyewitness voice, authentic reaction, no greetings, no robotic setups.
3. HASHTAGS: Finish with 3-4 trending hashtags: ${target.tags} #${target.city.replace(/\s+/g, '')}.
4. Return raw text only.`;

    let postText = '';
    try {
      const aiRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${Date.now()}&model=openai`, {
        signal: AbortSignal.timeout(6000)
      });
      if (aiRes.ok) {
        const raw = (await aiRes.text()).trim().replace(/^["']|["']$/g, '');
        if (raw && !raw.includes('error') && raw.split(/\s+/).filter(Boolean).length >= 75) {
          postText = raw;
        }
      }
    } catch (e) {}

    // Full 90-100 words fallback agar AI late kare (Headline ke saath jud kar real lagega)
    if (!postText) {
      if (target.lang === 'Bengali') {
        postText = `আজকের সকালে ${target.city} শহরে "${topicText}" নিয়ে মানুষের মধ্যে ব্যাপক আলোচনা ও আলোড়ন তৈরি হয়েছে। প্রত্যক্ষদর্শীদের মতে পরিস্থিতি কিন্তু সাধারণ মানুষের পক্ষে বেশ জটিল হয়ে উঠছে। সামাজিক মাধ্যমে প্রত্যেকেই নিজেদের মতামত প্রকাশ করছেন এবং প্রশাসনের কার্যকর ভূমিকার অপেক্ষায় রয়েছেন। ডিজিটাল যুগের বড় বড় প্রতিশ্রুতির তুলনায় বাস্তব জীবনের অভিজ্ঞতা একেবারেই আলাদা। পরিকাঠামোর সঠিক সংস্কার না হলে সাধারণ নাগরিকের সমস্যা দূর হবে না। এই বিষয়ে অবিলম্বে সবার একজোট হয়ে সঠিক পদক্ষেপ চাওয়া উচিত। ${target.tags} #${target.city.replace(/\s+/g, '')}`;
      } else if (target.lang === 'Hindi') {
        postText = `आज सुबह ${target.city} से सामने आई खबर "${topicText}" ने आम नागरिकों और सोशल मीडिया पर सभी का ध्यान खींच लिया है। जमीनी स्तर पर मौजूद लोग इस स्थिति को लेकर लगातार अपनी चिंता व्यक्त कर रहे हैं। रोजमर्रा की भागदौड़ में ऐसी घटनाएं जनता के सब्र का कड़ा इम्तिहान लेती हैं। सरकारी दावों और जमीनी हकीकत के बीच का यह अंतर साफ दिखाई देता है। जब तक बुनियादी व्यवस्थाओं में सुधार नहीं होगा, तब तक आम इंसान राहत की सांस नहीं ले पाएगा। प्रशासन को इस दिशा में तुरंत जिम्मेदारी लेनी चाहिए। ${target.tags} #${target.city.replace(/\s+/g, '')}`;
      } else {
        postText = `Significant conversations are erupting across ${target.city} today regarding "${topicText}" as local citizens actively debate the ongoing developments on ground. Eyewitness accounts emphasize that transparent accountability and swift administrative intervention are desperately required right now. While visionary promises are routinely shared online, the tangible day-to-day challenges experienced by common residents reflect an entirely different truth. Systematic structural reforms must be implemented promptly to restore stability and secure long-term public welfare. ${target.tags} #${target.city.replace(/\s+/g, '')}`;
      }
    }

    // Cloudinary auto compression to ~50KB
    const imageUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/fetch/f_auto,q_auto:eco,w_720,h_480,c_fill/${encodeURIComponent(realMediaPhoto)}`;

    // Save in Main Firestore DB ('open-confees')
    const nowIso = new Date().toISOString();
    const nowTime = Date.now();
    const author = getUsername(target.lang);

    const postRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions?key=${POSTS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            authorName: { stringValue: author },
            author: { stringValue: author },
            text: { stringValue: postText },
            body: { stringValue: postText },
            content: { stringValue: postText },
            imageUrl: { stringValue: imageUrl },
            image: { stringValue: imageUrl },
            city: { stringValue: target.city },
            country: { stringValue: target.country },
            category: { stringValue: target.category },
            likesCount: { integerValue: '0' },
            likes: { integerValue: '0' },
            commentsCount: { integerValue: '0' },
            comments: { integerValue: '0' },
            createdAt: { stringValue: nowIso },
            createdA: { stringValue: nowIso },
            timestamp: { integerValue: String(nowTime) }
          }
        })
      }
    );

    const postDoc = await postRes.json();
    const newPostId = postDoc.name?.split('/').pop();

    // Natural Slow Comments & Likes Growth
    try {
      const listRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions?pageSize=15&key=${POSTS_API_KEY}`
      );
      const listData = await listRes.json();
      const documents = listData.documents || [];

      for (const doc of documents) {
        const pId = doc.name?.split('/').pop();
        if (!pId || pId === newPostId) continue;

        const fields = doc.fields || {};
        const pText = fields.text?.stringValue || fields.body?.stringValue || '';
        const pCategory = fields.category?.stringValue || 'News & Breaking Headlines';
        const currentComments = parseInt(fields.commentsCount?.integerValue || fields.comments?.integerValue || '0', 10);
        const currentLikes = parseInt(fields.likesCount?.integerValue || fields.likes?.integerValue || '0', 10);
        const pLang = detectLang(pText);

        if (Math.random() < 0.22 && currentComments < 15) {
          const catPool = CATEGORY_COMMENTS[pCategory] || CATEGORY_COMMENTS['News & Breaking Headlines'];
          const commentPool = catPool[pLang] || catPool['English'];
          const commentContent = commentPool[Math.floor(Math.random() * commentPool.length)];
          const commenterName = getUsername(pLang);

          await fetch(
            `https://firestore.googleapis.com/v1/projects/${INTERACTIONS_PROJECT_ID}/databases/(default)/documents/comments?key=${INTERACTIONS_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fields: {
                  confessionId: { stringValue: pId },
                  postId: { stringValue: pId },
                  authorName: { stringValue: commenterName },
                  author: { stringValue: commenterName },
                  text: { stringValue: commentContent },
                  body: { stringValue: commentContent },
                  createdAt: { stringValue: new Date().toISOString() }
                }
              })
            }
          ).catch(() => {});

          const addedLikes = Math.random() < 0.6 ? 1 : 2;
          const newLikes = currentLikes + addedLikes;
          const newComments = currentComments + 1;

          await fetch(
            `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions/${pId}?updateMask.fieldPaths=commentsCount&updateMask.fieldPaths=comments&updateMask.fieldPaths=likesCount&updateMask.fieldPaths=likes&key=${POSTS_API_KEY}`,
            {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fields: {
                  commentsCount: { integerValue: String(newComments) },
                  comments: { integerValue: String(newComments) },
                  likesCount: { integerValue: String(newLikes) },
                  likes: { integerValue: String(newLikes) }
                }
              })
            }
          ).catch(() => {});
          break;
        }
      }
    } catch (err) {}

    return res.status(200).json({
      success: true,
      id: newPostId,
      category: target.category,
      headline: realHeadline,
      wordCount: postText.split(/\s+/).filter(Boolean).length
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
