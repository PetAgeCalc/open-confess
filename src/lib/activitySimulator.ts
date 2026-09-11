import { Confession } from '../types';

interface SimulatedPostItem {
  id: string;
  category: 'deep' | 'funny' | 'intelligent' | 'incident' | 'motivational';
  text: string;
  author: string;
  city: string;
  country: string;
  rawImage: string;
}

const USED_POST_IDS_KEY = 'openconfess_used_post_registry_v4';
const LIVE_SIMULATED_POSTS_KEY = 'openconfess_live_simulated_posts_v4';
const LAST_SIMULATION_TIMESTAMP_KEY = 'openconfess_last_drip_post_time_v4';

const FALLBACK_LIGHTWEIGHT_JPEG =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

// =========================================================================
// 50 UNIQUE LONG CONFESSIONS (100 - 300 Words)
// Kolkata & Bangladesh = Bangla
// Other India = Hindi
// Worldwide = English
// =========================================================================
const CURATED_POST_POOL: SimulatedPostItem[] = [
  // ---------------------- 1. DEEP & EMOTIONAL (10 Posts) ----------------------
  {
    id: 'deep_post_1',
    category: 'deep',
    city: 'Kolkata',
    country: 'India',
    author: 'সৌম্যদ্বীপ সেনগুপ্ত',
    rawImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=75',
    text: "সবাই ভাবে আমি খুব হাসিখুশি, সফল আর জীবনে কোনো আক্ষেপ নেই। কলকাতায় আমার একটা সুন্দর সাজানো ফ্ল্যাট আছে, একটা নামী আইটি কোম্পানিতে চাকরি আছে, আর উইকেন্ডে বন্ধুদের সাথে ক্যাফেতে আড্ডাও দিই। কিন্তু সত্যিটা হলো, ছয় বছর আগের সেই একটা অহংকারী সিদ্ধান্তের বোঝা আমি আজও রোজ রাতে একলা বয়ে বেড়াই। সেই মানুষটা যখন আমাকে অনুরোধ করেছিল আর মাত্র একবার বসে কথা বলে ভুল বোঝাবুঝি মিটিয়ে নেওয়ার জন্য, আমি আমার অন্ধ রাগের কারণে মুখের ওপর সব সম্পর্কের ইতি টেনে দিয়েছিলাম।\n\nআজ এত বছর পর যখন নিজের ফ্ল্যাটের ব্যালকনিতে একা কফির কাপ হাতে বসি, তখন গঙ্গার ধারের হাওয়া আর রাতের নিস্তব্ধতা আমাকে মনে করিয়ে দেয় যে অহংকার হয়তো জিতে গেছে, কিন্তু আমার জীবনের সমস্ত শান্তি চিরতরে হেরে গেছে। কাউকে এই কষ্টটা বলতে পারি না, কারণ আমার পরিচিত সবাই আমার শক্ত আর আত্মবিশ্বাসী রূপটা দেখতেই অভ্যস্ত। ভেতরে ভেতরে তিলে তিলে নিঃস্ব হয়ে যাওয়াটা বাইরে থেকে হাসিমুখে ঢেকে রাখা যে কতটা যন্ত্রণাদায়ক, তা কেবল সেই বোঝে যে রোজ রাতে নিজের নিঃশব্দ কান্নার সাথে লড়াই করে।"
  },
  {
    id: 'deep_post_2',
    category: 'deep',
    city: 'Dhaka',
    country: 'Bangladesh',
    author: 'তানভীর হাসান',
    rawImage: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=700&q=75',
    text: "গ্রামের ধুলোমাখা পথ ছেড়ে যখন প্রথম ঢাকায় পা রেখেছিলাম, বুকের ভেতর একটাই জেদ ছিল—আমাকে প্রতিষ্ঠিত হতে হবে, একটা বড় পরিচয় বানাতে হবে। বাবা যখন অসুস্থ শরীর নিয়ে গ্রামে কৃষিকাজ করতেন, তখন মনে মনে পণ করেছিলাম বাবার শেষ বয়সটা রাজার মতো সুখের বানিয়ে দেব। টানা আট বছর দিনরাত এক করে পরিশ্রম করেছি, বহু রাত মেসের ভাঙা চৌকিতে না খেয়ে কাটিয়েছি, নিজের সমস্ত শখ বিসর্জন দিয়ে ক্যারিয়ার গড়েছি।\n\nআজ আমি একটা বহুজাতিক কোম্পানির উচ্চপদে কর্মরত। ধানমন্ডিতে নিজস্ব ফ্ল্যাট আছে, দামি গাড়ি আছে। কিন্তু ভাগ্যের নির্মম পরিহাস দেখুন—যে বাবার মুখের এক চিলতে শান্তির জন্য এই দীর্ঘ লড়াইটা লড়লাম, সেই বাবাই আমার এই সাফল্য দেখার মাত্র দুই মাস আগে ব্রেন স্ট্রোকে মারা গেলেন। আজ যখন অফিস শেষে এই বিশাল ড্রয়িংরুমের নরম সোফায় একা বসি, তখন কাঁচের দেয়াল ভেদ করে শহরের কোলাহল কানে এসে বিঁধে। আমি নিজেকে আয়নায় প্রশ্ন করি—আসলেই কি আমি জিতলাম? যাকে জড়িয়ে ধরে কেঁদে বলার কথা ছিল 'বাবা আমি পেরেছি', সে-ই যখন নেই, তখন এই ব্যাংক ব্যালেন্স আর সামাজিক পদমর্যাদার ওজন পৃথিবীর সবচেয়ে ভারী বোঝা বলে মনে হয়।"
  },
  {
    id: 'deep_post_3',
    category: 'deep',
    city: 'Mumbai',
    country: 'India',
    author: 'रोहन शर्मा',
    rawImage: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=700&q=75',
    text: "छोटे शहर से जब पहली बार मुंबई आया था, तो लगता था कि आजादी इसी को कहते हैं। कोई टोकने वाला नहीं, रात को कितनी भी देर से घर आओ कोई पूछने वाला नहीं, अपनी मर्जी का खाना खाओ और जब मन करे सो जाओ। लेकिन जैसे-जैसे साल बीतते गए, इस तथाकथित आजादी का असली खोखलापन सामने आने लगा।\n\nकल रात करीब दो बजे मुझे अचानक बहुत तेज बुखार आ गया। बदन दर्द से टूट रहा था और सिर फटा जा रहा था। जब मैं पानी की बोतल उठाने के लिए बिस्तर से उठा, तो चक्कर खाकर फर्श पर बैठ गया। उस वक्त मेरे फोन में 600 से ज्यादा कॉन्टैक्ट्स थे, सोशल मीडिया पर हजारों लाइक्स आते थे, लेकिन उस रात मेरे पास एक भी ऐसा इंसान नहीं था जिसे मैं बिना झिझक फोन करके ये कह सकूं कि 'यार, मुझे थोड़ा बुखार है, क्या तुम एक बार पैरासिटामोल ला दोगे?' उस ठंडे फर्श पर अकेले बैठकर मुझे समझ आया कि हम जिसे आत्मनिर्भरता कहते हैं, वो कई बार सिर्फ हमारी बेबसी और अकेलेपन का दूसरा नाम होती है। पैसा और नाम कमाना आसान है, लेकिन ऐसे रिश्ते कमाना बहुत मुश्किल जहां आप बिना किसी झिझक के कमजोर पड़ सकें।"
  },
  {
    id: 'deep_post_4',
    category: 'deep',
    city: 'Pune',
    country: 'India',
    author: 'अदिति कुलकर्णी',
    rawImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=700&q=75',
    text: "मैंने पिछले सात साल अपने दोस्तों और परिवार में यह साबित करने में बिता दिए कि मैं बहुत मजबूत हूं और मुझे कभी किसी के सहारे की जरूरत नहीं पड़ती। हर किसी के दुख में मैं मौजूद रहती थी, आधी रात को किसी का रोता हुआ फोन आता तो घंटों समझाती थी, आर्थिक मदद करती थी और सबकी नजरों में एक 'सॉर्टेड' लड़की बनी हुई थी। लेकिन जब आप सबको यह यकीन दिला देते हैं कि आप कभी टूट नहीं सकते, तो लोग यह पूछना ही बंद कर देते हैं कि आप अंदर से कैसे हैं।\n\nकल शाम जब ऑफिस से लौटते वक्त बारिश शुरू हुई, तो मैंने अपनी गाड़ी साइड में लगाई और स्टेयरिंग व्हील पर सिर रखकर फूट-फूटकर रो पड़ी। मुझे किसी खास बात का दुख नहीं था, बस इस बात की गहरी थकान थी कि मुझे हमेशा मजबूत बनकर दिखाना पड़ता है। मुझे एहसास हुआ कि अगर मैं कभी मानसिक रूप से पूरी तरह बिखर भी जाऊं, तो मेरे अपनों को पता ही नहीं चलेगा कि मुझे कैसे संभालना है, क्योंकि मैंने कभी उन्हें अपने आंसू दिखाए ही नहीं। यह बनावटी मजबूती इंसान को अंदर से खोखला कर देती है।"
  },
  {
    id: 'deep_post_5',
    category: 'deep',
    city: 'Jaipur',
    country: 'India',
    author: 'प्रिया शेखावत',
    rawImage: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=700&q=75',
    text: "शादी टूटने के दो साल बाद आज अलमारी साफ करते हुए उसका वो पुराना स्वेटर मिला जो उसने कभी सर्दियों में मेरे जन्मदिन पर खुद पसंद करके दिलवाया था। उस कपड़े को छूते ही अचानक वो सारी पुरानी यादें, वो वादे और वो सपने आंखों के सामने तैर गए जो हमने मिलकर देखे थे। न कोई गुस्सा आया, न पुरानी नफरत की आग भड़की। बस दिल के किसी कोने में एक गहरी टीस उठी कि कैसे दो लोग जो कभी एक-दूसरे की सांसों से वाकिफ थे, वक्त के साथ इतने पराए हो जाते हैं कि रास्ते में आमने-सामने आने पर नजरें तक चुरा लेते हैं।\n\nहम दोनों में से कोई भी बुरा इंसान नहीं था, बस हमारे अहंकार और दूसरों की बातों ने हमारे बीच इतनी चौड़ी दीवार खड़ी कर दी जिसे हम कभी लांघ नहीं पाए। आज सब कुछ ठीक है, जिंदगी आगे बढ़ चुकी है, लेकिन कभी-कभी लगता है कि अगर उस दिन थोड़ी सी समझदारी दिखाई होती, तो शायद आज कहानी कुछ और होती।"
  },
  {
    id: 'deep_post_6',
    category: 'deep',
    city: 'Toronto',
    country: 'Canada',
    author: 'Marcus Vance',
    rawImage: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=700&q=75',
    text: "I kept my mother's last voicemails saved on an old encrypted hard drive for four years after she passed from dementia. For forty-eight months, I was too terrified to click on those files because I knew hearing her voice would dismantle the fragile emotional fortress I had spent years constructing.\n\nYesterday, while cleaning out my storage room, my laptop glitched and accidentally auto-played an audio recording from November 2020. It wasn't profound or dramatic; she was simply complaining about vegetable prices at the local farmers market and asking if I had remembered to wear my warm coat. Hearing that mundane, gentle motherly nag completely broke me. I pulled over on the side of the highway and wept for forty minutes straight. We construct these towering monuments of resilience, convincing ourselves we have healed, when in truth, grief is just a dormant visitor waiting for a familiar frequency to remind us of everything we permanently lost."
  },
  {
    id: 'deep_post_7',
    category: 'deep',
    city: 'Dublin',
    country: 'Ireland',
    author: 'Clara Byrne',
    rawImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=75',
    text: "The heaviest realization about forgiving someone who never apologized is accepting that you must privately clean up the emotional debris of a storm you didn't create. For three years, I waited for an acknowledgment, a single message acknowledging the cruelty with which they walked out after a decade of shared history.\n\nThat message never came, and it never will. They are currently living their life across town, attending dinners, posting vacations, completely comfortable in the narrative where they were entirely blameless. Last night, I finally deleted the remaining unsent drafts in my inbox and poured out the vintage wine we bought for our cancelled anniversary. True forgiveness isn't absolution for the person who injured you; it is the exhausting, quiet labor of letting go of the hope for a better past so you don't poison your own tomorrow."
  },
  {
    id: 'deep_post_8',
    category: 'deep',
    city: 'Sofia',
    country: 'Bulgaria',
    author: 'Elena Mikhailova',
    rawImage: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=700&q=75',
    text: "My grandmother spent eighty-four years on this earth, and almost seventy of those years were spent catering to everyone else's demands. She was celebrated across our village as an angel of selflessness—eating cold leftovers, waking at dawn, never complaining once.\n\nTwo nights before she passed in the hospital, she gripped my wrist with astonishing intensity and whispered, 'Elena, do not make an altar of your own self-sacrifice. Promise me you will never confuse your own erasure with love. Love should expand your existence, not ask you to apologize for taking up space.' Those quiet words completely dismantled the generational guilt I carried. I walked out of that hospital room realizing that the most radical homage I can pay to her memory is refusing to be the martyr our family traditionally expected women to be."
  },
  {
    id: 'deep_post_9',
    category: 'deep',
    city: 'Auckland',
    country: 'New Zealand',
    author: 'Julian Thorne',
    rawImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=700&q=75',
    text: "I pretended not to notice when my longtime university group gradually stopped inviting me to their weekend dinners and camping trips. Whenever photos surfaced online, I cheerfully clicked like and commented that I was too buried in freelance deadlines to make it anyway.\n\nThe truth is, I spent those rainy Saturday evenings staring at the ceiling of my apartment, wondering where the warmth disappeared. There was no giant argument, no scandalous falling out; just the slow, humiliating chill of people quietly deciding that your presence no longer adds value to their room. Outgrowing friendship groups without any closure is a unique kind of silent mourning nobody prepares you for in your late twenties."
  },
  {
    id: 'deep_post_10',
    category: 'deep',
    city: 'Melbourne',
    country: 'Australia',
    author: 'Harrison Cole',
    rawImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=700&q=75',
    text: "I inherited my father's antique woodworking tools when he passed six months ago. Everyone kept congratulating me on inheriting such valuable craftsman gear, assuming I would carry on his legacy in the garage.\n\nWhat they don't know is that every time I smell that pine wood and turpentine, I remember the decades of walking on eggshells around him, terrified of triggering his explosive temper. I kept the tools locked in a storage shed across town because I can neither bring myself to sell them nor endure the sensory trigger of touching them. We inherit complicated grief wrapped in heirloom boxes, and the world expects nostalgia where there is only a tangled knot of unresolved fear and longing."
  },

  // ---------------------- 2. FUNNY / QUIRKY (10 Posts) ----------------------
  {
    id: 'funny_post_1',
    category: 'funny',
    city: 'Kolkata',
    country: 'India',
    author: 'শুভঙ্কর চক্রবর্তী',
    rawImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=700&q=75',
    text: "আমাদের সল্টলেকের আইটি অফিসে যখনই কোনো জটিল প্রজেক্ট ডেডলাইন আসে বা অনসাইট ক্লায়েন্ট উল্টোপাল্টা রিকোয়ারমেন্ট নিয়ে মিটিং ডাকে, টিমের সবাই যখন ভয়ে কাঁপতে থাকে, তখন আমি একটা নিজস্ব মাস্টারস্ট্রোক চালাই। আমি ল্যাপটপের ওয়াইফাই চট করে বন্ধ করে দিই, টার্মিনালে কিছু বিদঘুটে পাইথন স্ক্রিপ্ট খুলে রাখি আর কপালে হাত দিয়ে এমন গভীর টেনশনের ভান করে বসে থাকি যেন গোটা গ্লোবাল ক্লাউড আর্কিটেকচার আমি একাই বাঁচাচ্ছি!\n\nগত সপ্তাহে আমাদের নতুন প্রজেক্ট ডিরেক্টর আমার কেবিনের সামনে এসে উঁকি দিলেন, আমার মনিটরে চোখ বুলিয়ে গম্ভীর মুখে বললেন, 'শুভঙ্কর, তোমার এই ডেডিকেশন সত্যিই শিক্ষণীয়। তুমি আমাদের কোম্পানির রিয়েল অ্যাসেট।' এই বলে তিনি নিজে ক্যান্টিন থেকে ফিল্টার কফি আর স্পেশাল কাজু বরফি এনে আমার টেবিলে রেখে গেলেন! আমি তখন মনে মনে হাসতে হাসতে শেষ, অথচ মুখে কাঁচুমাচু ভাব করে বললাম, 'থ্যাংক ইউ স্যার, সিস্টেমটা স্ট্যাবল রাখার চেষ্টা করছি।' এই অভিনয় করতে গিয়ে আমার কনফিডেন্স এখন এত বেড়ে গেছে যে ভয় হয় কোনোদিন সত্যি সার্ভার বসে গেলে এরা হয়তো আমাকে ন্যাশনাল অ্যাওয়ার্ড দিয়ে দেবে!"
  },
  {
    id: 'funny_post_2',
    category: 'funny',
    city: 'Chittagong',
    country: 'Bangladesh',
    author: 'রাকিবুল হাসান',
    rawImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=75',
    text: "গত মাসে এক দূর সম্পর্কের আত্মীয়ের বিয়েতে গিয়েছিলাম চট্টগ্রামের এক নামকরা কনভেনশন সেন্টারে। কাচ্চি বিরিয়ানির পর মিষ্টির কাউন্টারে গিয়ে দেখলাম স্পেশাল ছানার চমচম আর ক্ষীরসা তখনো সাধারণ মেহমানদের জন্য খোলা হয়নি, কাঁচের শোকেসে তুলে রাখা হয়েছে ভিআইপিদের জন্য।\n\nআমি গম্ভীর মুখে সাফারি স্যুট ঠিক করে কাউন্টারের ছেলেটাকে গিয়ে খুব রাশভারি গলায় বললাম, 'শোনো ছোট ভাই, বরের বাবার বড় খালাতো ভাই লন্ডন থেকে আসছেন, উনি ডায়াবেটিসের কারণে সাধারণ মিষ্টি খান না। এই ক্ষীরসা আর স্পেশাল চমচম চার প্লেট ওই ভিআইপি কর্নারে আমার কাছে পাঠিয়ে দাও।' ছেলেটা ভয়ে এমন স্যালুট দিল যেন আমি প্রধানমন্ত্রীর প্রটোকল অফিসার! সে নিজে প্লেট সাজিয়ে আমার টেবিলে দিয়ে গেল। আমি পুরোটা আরামসে খেয়ে ঢেকুর তুললাম, অথচ আসল সত্যি হলো আমি কনের দূর সম্পর্কের মেঝ খালার পাড়ার প্রতিবেশীর বন্ধু! বিয়ের অনুষ্ঠানে একটু আত্মবিশ্বাস আর ভারিক্কি গলার চেয়ে বড় কোনো ভিআইপি পাস পৃথিবীতে নেই।"
  },
  {
    id: 'funny_post_3',
    category: 'funny',
    city: 'Delhi',
    country: 'India',
    author: 'अमित कुमार सिंह',
    rawImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=75',
    text: "कॉरपोरेट की नौकरी में टिके रहने के लिए आदमी को या तो साधु बनना पड़ता है या बहुत बड़ा कलाकार। करीब आठ महीने पहले जब नई टीम लीडर आई जो सुबह 8:30 बजे से कॉल्स शुरू कर देती थी, तो मैंने बहुत मासूमियत से पूरी टीम के सामने यह झूठ फैला दिया कि मुझे एक बहुत ही दुर्लभ 'सर्कैडियन हियरिंग डिसऑर्डर' है, जिसकी वजह से सुबह 11 बजे से पहले किसी फोन की घंटी बजने पर मुझे भयानक चक्कर आने लगते हैं।\n\nमुझे लगा था कि एचआर वाले मेडिकल पर्चा मांगकर मेरी पोल खोल देंगे। लेकिन करिश्मा देखिए—हमारी टीम लीडर ने इतनी ज्यादा हमदर्दी दिखाई कि पूरे डिपार्टमेंट को सख्त ईमेल कर दिया कि 'अमित को सुबह 11:05 से पहले कोई भी डायरेक्ट कॉल न करे'। अब आलम यह है कि पूरी दुनिया सुबह 9 बजे से ऑफिस की चिक-चिक में पिस रही होती है, और मैं आराम से अपनी बालकनी में बैठकर चाय की चुस्कियों के साथ अखबार पढ़ता हूं। ठीक 11:06 पर मेरा पहला कॉल आता है और वो भी बहुत अदब से पूछते हैं—'अमित जी, क्या आपकी तबीयत स्थिर है? क्या अब हम बात कर सकते हैं?' कभी-कभी मुझे अपनी ही चालाकी पर गर्व होने लगता है!"
  },
  {
    id: 'funny_post_4',
    category: 'funny',
    city: 'Lucknow',
    country: 'India',
    author: 'विकास श्रीवास्तव',
    rawImage: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=700&q=75',
    text: "मेरे घरवाले पिछले छह महीने से पूरे खानदान में मेरी तारीफों के पुल बांध रहे हैं कि विकास अब बहुत सुधर गया है, रोज शाम को 6 बजे ट्रैकसूट पहनकर पार्क में डेढ़ घंटे तक कड़ी रनिंग और कार्डियो करता है। यहां तक कि मम्मी ने रिश्तेदारों को बोल दिया है कि लड़के का स्टैमिना गजब का हो गया है।\n\nसच्चाई यह है कि मैं पार्क के पिछले दरवाजे से चुपके से निकलकर पास वाली मशहूर चाट की दुकान पर जाता हूं। वहां आराम से बैठकर दो प्लेट गरमा-गरम समोसे, खस्ता कचौड़ी और एक बड़ी कोल्ड ड्रिंक उड़ाता हूं। फिर वापस पार्क आकर किसी बेंच पर बैठकर पसीना पोंछते हुए ऐसे गहरी सांसें लेता हूं जैसे अभी-अभी ओलंपिक का मैराथन जीतकर आया हूं। पिछले हफ्ते वजन नापने वाली मशीन पर जब 2 किलो वजन बढ़ा हुआ निकला, तो मैंने घर में सबको यह कहकर समझा दिया कि 'यह फैट नहीं है, यह हैवी मसल्स का वजन है!' मुझे लगता है झूठ बोलने में भी एक अलग ही स्तर की रचनात्मकता चाहिए होती है।"
  },
  {
    id: 'funny_post_5',
    category: 'funny',
    city: 'Bhopal',
    country: 'India',
    author: 'सौरभ पटवर्धन',
    rawImage: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=700&q=75',
    text: "हमारे हॉस्टल मेस की दाल इतनी पतली होती थी कि उसमें चेहरा देखकर दाढ़ी बनाई जा सकती थी। इस समस्या से निजात पाने के लिए मैंने अपने तीनों रूममेट्स को एक फर्जी रिसर्च पेपर दिखाकर यह यकीन दिला दिया कि हमारे मेस वाले बाबा जो दाल बनाते हैं, उसमें गुप्त हिमालयी जड़ी-बूटी है जो दिमाग की याददाश्त को 300% तेज कर देती है।\n\nअब तमाशा यह है कि मेरे रूममेट्स रोज बाबा के पैर छूकर दाल मांगते हैं और उन्हें महीने का एक्स्ट्रा टिप भी देते हैं ताकि उन्हें दाल की कटोरी में वो 'रहस्यमयी तत्व' ज्यादा मिले! बाबा भी चौड़े होकर मेस में घूमते हैं कि उनका खाना वैज्ञानिक रूप से सिद्ध हो चुका है। अब दाल भले ही पानी जैसी हो, लेकिन कम से कम हॉस्टल में शांति है और रूममेट्स खुश होकर पढ़ाई में टॉप करने के सपने देख रहे हैं!"
  },
  {
    id: 'funny_post_6',
    category: 'funny',
    city: 'London',
    country: 'United Kingdom',
    author: 'Oliver Wright',
    rawImage: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=75',
    text: "Nearly three years ago, my flatmate and I were locked in a war over household chores. I despised vacuuming because our vintage hoover shrieked like an aircraft turbine. To permanently evade my cleaning shift, I covered my ears, looked at him with tragic gravity, and claimed that specific high-pitch frequencies triggered my acute auditory vertigo.\n\nI anticipated him calling my bluff. Instead, he took it with absurdly profound sympathy. He spent an entire weekend researching acoustic sensitivities, discarded the vacuum into the communal skip, and purchased three traditional wooden brooms. For thirty-six continuous months, this man has swept our sprawling four-bedroom Victorian flat purely with brooms and dustpans. Whenever a neighbor upstairs runs a washing machine on spin cycle, he knocks softly on my door, brings me chamomile tea, and asks if my inner ear is holding up. I am trapped in an elaborate farce of my own creation, and if I ever tell him the truth, he will likely murder me with the broom."
  },
  {
    id: 'funny_post_7',
    category: 'funny',
    city: 'Chicago',
    country: 'USA',
    author: 'Natalie Gallagher',
    rawImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=75',
    text: "Last Friday afternoon at 4:45 PM, our regional manager sprang an unscheduled sixty-slide review meeting on the entire department. Realizing I had concert tickets across town at 6:30, I employed an acting stunt I had been rehearsing in the mirror for weeks.\n\nWhenever the manager directed a slide question toward me, I unmuted my microphone and systematically opened and closed my mouth in exaggerated silence while periodically clicking my pen against the desk to simulate digital packet distortion. Within two minutes, the entire executive panel was typing in chat: 'Natalie, your audio interface is completely fried, don't worry, drop off and send your notes on Monday.' I exited the call in under thirty seconds, walked into the pub, and enjoyed my weekend. The key to successful corporate slacking is never complaining about technology; simply let technology appear to complain about you."
  },
  {
    id: 'funny_post_8',
    category: 'funny',
    city: 'Berlin',
    country: 'Germany',
    author: 'Simon Richter',
    rawImage: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=700&q=75',
    text: "My partner has told all her relatives across Bavaria that I am a walking encyclopedia of European military architecture. Whenever we go on road trips across castle regions, she turns to me in admiration asking about thirteenth-century moat construction and medieval masonry.\n\nIn reality, whenever she turns to adjust the air conditioning, I discreetly activate voice-search on my smart watch, skim the first two bullet points on Wikipedia, and deliver them in a slow, thoughtful academic tone while tapping the steering wheel. Last month her uncle gifted me an antique leather-bound compendium on Renaissance sieges to review. I am currently reading it with a dictionary just to survive our upcoming Christmas dinner."
  },
  {
    id: 'funny_post_9',
    category: 'funny',
    city: 'Manchester',
    country: 'United Kingdom',
    author: 'Arthur Sterling',
    rawImage: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=75',
    text: "I bought a pair of high-end, zero-prescription spectacles solely to wear during haircut appointments. Barbers in northern England possess an unshakeable urge to debate twenty years of Premier League football and weekend politics the moment you sit in their chair.\n\nWhen you wear chunky tortoiseshell frames and bring a dense paperback on sixteenth-century cartography, they glance at you, assume you are an insufferable neurotic academic, and cut your hair in sublime, uninterrupted silence for forty straight minutes. It is the best fifteen pounds I have ever spent in my entire adult life."
  },
  {
    id: 'funny_post_10',
    category: 'funny',
    city: 'Sydney',
    country: 'Australia',
    author: 'Liam O’Connor',
    rawImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=700&q=75',
    text: "I accidentally waved back enthusiastically at an attractive stranger across a busy subway platform yesterday, assuming she was a former colleague from my previous advertising firm. When she looked utterly terrified and stepped backward, instead of dropping my arm like a rational adult, I seamlessly transitioned the wave into an aggressive overhead shoulder mobility stretch.\n\nI held that rigid stretching position for nearly twenty seconds straight while staring intently at the ceiling schedule board, pretending I was undergoing serious physiotherapy before boarding the train. I am convinced that human embarrassment will eventually be classified as an Olympic sport, and I will comfortably win the gold medal."
  },

  // ---------------------- 3. INTELLIGENT / OBSERVATIONAL (10 Posts) ----------------------
  {
    id: 'intel_post_1',
    category: 'intelligent',
    city: 'Kolkata',
    country: 'India',
    author: 'দেবাশিস মুখোপাধ্যায়',
    rawImage: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=700&q=75',
    text: "আমাদের বর্তমান বাঙালি মধ্যবিত্ত সমাজ এমন এক অদ্ভুত সাংস্কৃতিক দেউলিয়াপনার মধ্য দিয়ে যাচ্ছে যেখানে বাহ্যিক চাকচিক্য আর সোশ্যাল মিডিয়ার ভার্চুয়াল অনুমোদনকে মানুষের ব্যক্তিত্বের আসল মাপকাঠি বানিয়ে ফেলা হয়েছে। আমরা রবীন্দ্রভবনে গিয়ে বইমেলায় ভিড় করি ঠিকই, কিন্তু বাড়ি ফিরে ঘণ্টার পর ঘণ্টা রিলস আর শর্টস স্ক্রোল করে নিজেদের মস্তিষ্কের ধৈর্যকে ধ্বংস করি।\n\nযে সমাজ একজন নিষ্ঠাবান বইপড়া চিন্তাশীল মানুষের চেয়ে দামি ব্র্যান্ডের পোশাক পরা কিংবা সস্তা চটুল কন্টেন্ট বানানো মানুষকে বেশি সামাজিক মান্যতা দেয়, সেই সমাজের উন্নতি কেবল বড় বড় শপিং মল আর কংক্রিটের উড়ালপুলেই দেখা যায়, মানুষের মানসিক সুস্থতায় নয়। যুক্তি দিয়ে আপনি হয়তো ফেসবুকের যেকোনো কমেন্ট বক্সে তর্কে জিতে লাইক কুড়াতে পারবেন, কিন্তু ব্যক্তিজীবনে সম্পর্ক ধরে রাখার জন্য যুক্তির চেয়ে নিঃশব্দ সহমর্মিতা অনেক বেশি মূল্যবান। মানুষ যতক্ষণ না বাহ্যিক প্রদর্শনের মোহ ছেড়ে ভেতরের আত্মোপলব্ধির দিকে তাকাচ্ছে, ততক্ষণ তথাকথিত শিক্ষার সার্টিফিকেট থাকা সত্ত্বেও আমরা অশিক্ষিতই থেকে যাব।"
  },
  {
    id: 'intel_post_2',
    category: 'intelligent',
    city: 'Sylhet',
    country: 'Bangladesh',
    author: 'মাহবুবুল আলম',
    rawImage: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=700&q=75',
    text: "আধুনিক ইন্টারনেটের সবচেয়ে বড় বিপদ তথ্যের ঘাটতি নয়; এর আসল বিপদ হলো সংবেদনশীলতার কৃত্রিম মৃত্যু। আমরা প্রতিদিন যুদ্ধ, শিশুর কান্না, বন্যা আর মহামারীর হাজারটা নির্মম দৃশ্য স্ক্রিনে সোয়াইপ করতে করতে এত বেশি অভ্যস্ত হয়ে গেছি যে মানুষের চরম হাহাকারও এখন আমাদের হৃদয়ে এক সেকেন্ডের বেশি দোলা দিতে পারে না।\n\nআমরা রক্তমাংসের মানুষকে সংজ্ঞায়িত করছি তাদের সোশাল মিডিয়া প্রোফাইলের দিয়ে। একটি পরিবারের ড্রয়িংরুমে যখন চারজন মানুষ একই সোফায় বসে থেকেও নিজেদের স্মার্টফোনের নীল আলোয় মুখ গুঁজে থাকে, তখন বুঝতে হবে নিঃসঙ্গতা কোনো ব্যক্তিগত অসুখ নয়, এটা আমাদের সময়ের এক সমষ্টিগত মহামারী। প্রযুক্তি দূরবর্তী মানুষকে কাছে আনার প্রতিশ্রুতি দিয়ে আমাদের পাশের ঘরটির প্রিয় মানুষটিকে হাজার মাইল দূরে ঠেলে দিয়েছে। সম্পর্কগুলো এখন চ্যাট হিস্টোরিতে বন্দী, যেখানে আবেগ আছে প্রচুর কিন্তু উপস্থিতির কোনো উত্তাপ নেই।"
  },
  {
    id: 'intel_post_3',
    category: 'intelligent',
    city: 'Indore',
    country: 'India',
    author: 'अनंत बाजपेयी',
    rawImage: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=700&q=75',
    text: "इंसान की जिंदगी की सबसे बड़ी गलतफहमी यह मानना है कि 'समय हर घाव को भर देता है'। यह एक ऐसा मुहावरा है जिसे हम अपनी अंतरात्मा की जिम्मेदारियों से मुंह चुराने के लिए सदियों से दोहराते आ रहे हैं। सच्चाई यह है कि समय अपने आप कुछ ठीक नहीं करता; समय सिर्फ दर्द के साथ जीने की एक सुन्न कर देने वाली आदत डाल देता है।\n\nअगर एक टूटी हुई हड्डी को सही तरह से जोड़कर प्लास्टर न चढ़ाया जाए, तो समय बीतने पर वह टेढ़ी ही जुड़ती है और ताउम्र इंसान को लंगड़ा कर रखती है। ठीक उसी तरह, अगर आप अपने अंतर्मन की कड़वाहट, अपराधबोध और अनसुलझे विवादों का सामना नहीं करते, तो दस साल बाद भी वो चोट वैसी की वैसी ही रिसती रहेगी। असली परिपक्वता तब आती है जब आप यह स्वीकार करते हैं कि आपके अतीत में जो कुछ भी टूटा, उसे समेटने की जिम्मेदारी सिर्फ आपकी है। दूसरों को दोष देकर विक्टिम कार्ड खेलना बहुत आसान है, लेकिन आईने के सामने खड़े होकर अपनी कमियों को स्वीकार करना ही एक मजबूत व्यक्तित्व का निर्माण करता है।"
  },
  {
    id: 'intel_post_4',
    category: 'intelligent',
    city: 'Varanasi',
    country: 'India',
    author: 'समीक्षा त्रिवेदी',
    rawImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=700&q=75',
    text: "किताबें और दर्शन हमें ज्ञान नहीं देते; वे केवल हमारे मन में पहले से दबे उन सवालों को शब्द देते हैं जिन्हें हम डर के मारे खुद से पूछने की हिम्मत नहीं जुटा पाते थे। काशी के इन प्राचीन घाटों पर बैठकर जब आप जलती हुई चिताओं और बहती गंगा को देखते हैं, तो जीवन की सारी आपाधापी व्यर्थ लगने लगती है।\n\nहम अपनी पूरी जवानी मकान, पद, प्रतिष्ठा और बैंक बैलेंस को बढ़ाने में झोंक देते हैं, यह सोचकर कि एक दिन सब कुछ सुरक्षित हो जाएगा। लेकिन जीवन की सबसे बड़ी विडंबना यह है कि जब तक इंसान जीने की पूरी तैयारी कर पाता है, तब तक जिंदगी के रंगमंच से पर्दा गिरने का समय आ जाता है। समझदारी इस बात में नहीं है कि आपने दुनिया से कितना बटोरा, बल्कि इस बात में है कि आप अपने जाने के बाद पीछे कितनी शांति और प्रेम छोड़ गए।"
  },
  {
    id: 'intel_post_5',
    category: 'intelligent',
    city: 'Ahmedabad',
    country: 'India',
    author: 'चिराग पटेल',
    rawImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=75',
    text: "कॉरपोरेट वफादारी एक ऐसा मीठा जहर है जिसे हर कंपनी अपनी बैलेंस शीट चमकाने के लिए कर्मचारियों के दिमाग में घोलती है। जब तक आप उनके लिए मुनाफा कमा रहे हैं, आप 'परिवार' हैं, लेकिन जैसे ही बाजार में मंदी आती है, उस तथाकथित परिवार का प्यार एक लाइन के टर्मिनेशन ईमेल में सिमट जाता है।\n\nअपने काम से प्यार करना अच्छी बात है, लेकिन किसी संस्थान को अपनी पहचान बना लेना सबसे बड़ी मूर्खता है। जो समय आप अपने स्वास्थ्य, अपने माता-पिता और अपने बच्चों से चुराकर अतिरिक्त काम में लगाते हैं, उसकी भरपाई कभी कोई अप्रेजल या बोनस नहीं कर सकता। कंपनी के लिए आप सिर्फ एक रिसोर्स नंबर हैं जिसे एक दिन में बदला जा सकता है, लेकिन अपने परिवार के लिए आप पूरी दुनिया हैं।"
  },
  {
    id: 'intel_post_6',
    category: 'intelligent',
    city: 'Athens',
    country: 'Greece',
    author: 'Dr. Aris Vassiliou',
    rawImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=75',
    text: "The modern internet did not set out to build communities; it engineered digital panopticons designed to turn private insecurity into monetizable ad clicks. In earlier centuries, when a human being experienced an idle afternoon, that boredom acted as the fertile soil for contemplation, philosophy, and creative expression.\n\nToday, the microsecond a pause enters your conscious mind, an algorithm rushes in with fifty hyper-personalized stimuli calibrated precisely to trigger indignation, tribal defensiveness, or envy. We have effectively outsourced our internal emotional equilibrium to commercial servers. The tragedy of our generation is not that we lack information; we are drowning in noise while starving for wisdom. When you systematically strip silence away from human life, you eliminate the only mirror in which a soul can truly examine its own contradictions."
  },
  {
    id: 'intel_post_7',
    category: 'intelligent',
    city: 'Vienna',
    country: 'Austria',
    author: 'Hannah Krause',
    rawImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=75',
    text: "Most people do not listen during conversations with the intent to comprehend; they listen with the intent to formulate a rebuttal. Once you observe this dynamic in boardrooms and dinner tables, interpersonal dialogue ceases to look like communication and reveals itself as an orchestra of talking heads waiting for a microsecond of silence to interrupt.\n\nTrue intellectual maturity begins the moment you become comfortable holding conflicting perspectives in your mind without feeling the compulsion to instantly dismantle them. When you abandon the juvenile necessity of winning every argument, you discover that silence is often the most devastating form of clarity. We protect our egos at the cost of our growth."
  },
  {
    id: 'intel_post_8',
    category: 'intelligent',
    city: 'Kyoto',
    country: 'Japan',
    author: 'Kenji Sato',
    rawImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=700&q=75',
    text: "The greatest threat of our era is not that artificial intelligence will surpass human intellect; it is that human beings are voluntarily downgrading their own critical thinking, emotional discernment, and empathy to resemble algorithmic outputs.\n\nWe consume summaries instead of literature, tweets instead of nuanced essays, and algorithmic playlists instead of cohesive albums. By prioritizing hyper-efficiency over depth, we are amputating our capacity for sustained reflection. Machines were meant to liberate humanity to pursue art, philosophy, and compassion; instead, humans are exhausting themselves acting like processors while algorithms generate art."
  },
  {
    id: 'intel_post_9',
    category: 'intelligent',
    city: 'Lisbon',
    country: 'Portugal',
    author: 'Gabriel Santos',
    rawImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=700&q=75',
    text: "True adulthood arrives the moment you realize that your parents were never omniscient architects of destiny; they were merely regular, flawed human beings who grew up, had children, and were improvising the script of family life without an instruction manual.\n\nThe resentment we hoard throughout our twenties against our upbringing is usually rooted in the childish expectation that our parents should have been gods. Once you view them through the compassionate lens of their own trauma and generational limitations, anger evaporates and makes way for a quiet, respectful tenderness."
  },
  {
    id: 'intel_post_10',
    category: 'intelligent',
    city: 'Seattle',
    country: 'USA',
    author: 'Karen Zimmerman',
    rawImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=700&q=75',
    text: "We live in an economic system that pathologizes rest as laziness and glorifies exhaustion as virtue. When burnout becomes a badge of honor, productivity stops being a tool for building a good life and transforms into a secular religion.\n\nThe human nervous system was never calibrated to be accessible twenty-four hours a day across four different messaging applications. Until we reclaim the legitimacy of unplugged solitude, we will continue producing a society of hyper-efficient, spiritually depleted sleepwalkers."
  },

  // ---------------------- 4. REAL INCIDENTS (10 Posts) ----------------------
  {
    id: 'incident_post_1',
    category: 'incident',
    city: 'Kolkata',
    country: 'India',
    author: 'নীলাঞ্জনা সেন',
    rawImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=75',
    text: "গত বছর বর্ষার সময় সুন্দরবনের এক চরম প্রত্যন্ত দ্বীপে স্বেচ্ছাসেবী মেডিকেল টিমের সাথে গিয়েছিলাম। শহর থেকে বহু দূরে সেই গ্রামে না ছিল কোনো পাকা রাস্তা, না ছিল কোনো বিদ্যুৎ। আমাদের কাজ শেষে বিকেলে যখন নৌকায় ফেরার প্রস্তুতি নিচ্ছি, হঠাৎ আকাশ ভেঙে ভয়াল কালবৈশাখী ঝড় শুরু হলো। চারপাশ এমন ঘন অন্ধকারে ঢেকে গেল যেন দুপুরেই মাঝরাত নেমে এসেছে, নদীর উত্তাল ঢেউ বাঁধ উপচে ঢুকে পড়ার উপক্রম হয়েছিল।\n\nআমরা ভয় পেয়ে যখন একটা মাটির স্কুলে জড়োসড়ো হয়ে কাঁপছি, তখন স্থানীয় এক বৃদ্ধ জেলে ধীরপায়ে ভেতরে ঢুকলেন। তাঁর শরীরে বার্ধক্যের ছাপ, পরনে একটা ভিজে গামছা। তিনি কোনো কথা না বলে নিজের কাঠের বাক্স থেকে শুকনা দেশলাই আর মোমবাতি বের করে জ্বালিয়ে দিলেন। তারপর তাঁর হাঁড়িতে রাখা শেষ সামান্য মুড়ি আর গুড়টুকু আমাদের হাত পেতে দিয়ে বললেন, 'শহরের মানুষ তোমরা, ভয় পেয়ো না। নদী যখন রাগ দেখায়, তখন মাটির সাথে লেপ্টে বসে থাকতে হয়, অহংকার ছাড়লে নদী কাউরে মারে না।' সেই রাতে ঝড় থামার পর আমি উপলব্ধি করেছিলাম—যে পুঁথিগত বিদ্যার বড়াই আমরা শহরে করি, তা প্রকৃতির এই রুক্ষ অভিজ্ঞতার কাছে কত সামান্য। কিছু মানুষ চরম নিঃস্ব হয়েও মনের দিক থেকে কতটা ঐশ্বর্যশালী হতে পারে, তা ওই বৃদ্ধকে না দেখলে কোনোদিন বিশ্বাস করতাম না।"
  },
  {
    id: 'incident_post_2',
    category: 'incident',
    city: 'Faridpur',
    country: 'Bangladesh',
    author: 'কাজী তানিম আহমেদ',
    rawImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=700&q=75',
    text: "পদ্মা সেতু উদ্বোধনের আগের বছর এক শীতের রাতে ফেরিতে করে নদী পার হচ্ছিলাম। প্রচণ্ড ঘন কুয়াশায় মাঝনদীতে ফেরি থেমে যায়, চারপাশ এত ঠান্ডা আর নিস্তব্ধ ছিল যে নিঃশ্বাস ফেলতেও কষ্ট হচ্ছিল। ফেরির ডেকে এক গৃহহীন মা তাঁর অসুস্থ দুধের শিশুকে কোলে নিয়ে শীতে কাঁপছিলেন, তাঁর গায়ে জড়ানোর মতো পর্যাপ্ত গরম কাপড় ছিল না।\n\nঠিক সেই সময় ফেরির এক চা-বিক্রেতা হকার ছেলে, যার নিজের গায়েও ছিল শুধু একটা পুরনো ছেঁড়া সোয়েটার, সে নিজের গায়ের চাদরটা খুলে নিঃসংকোচে সেই শিশুর মায়ের গায়ে জড়িয়ে দিল। তারপর কেটলি থেকে গরম চা ঢেলে সেই মায়ের হাতে দিয়ে বলল, 'আপা, চা-টা খেয়ে একটু শরীর গরম করেন, বাচ্চার কিছু হবে না ইনশাল্লাহ।' পৃথিবীর বড় বড় স্থাপত্য আর আধুনিক প্রযুক্তি হয়তো মানুষের পথ সহজ করে, কিন্তু এই নিঃস্ব হকার ছেলের মতো ক্ষুদ্র ক্ষুদ্র ভালোবাসাই আসলে মানুষের বেঁচে থাকার পৃথিবীকে টিকিয়ে রাখে।"
  },
  {
    id: 'incident_post_3',
    category: 'incident',
    city: 'Chandigarh',
    country: 'India',
    author: 'गुरप्रीत सिंह',
    rawImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=75',
    text: "करीब चार साल पहले कड़ाके की ठंड में एक आवारा काला कुत्ता, जिसका एक कान कटा हुआ था, रोज सुबह 6:30 बजे मेरे फ्लैट के गेट के बाहर आकर बैठ जाता था। मैं कभी उसे कोई फैंसी खाना नहीं देता था, बस बची हुई रोटियां या थोड़ा सा दूध। हम दोनों के बीच एक अनकहा, सम्मानित दायरा था। वह हमेशा मुझसे दस कदम पीछे-पीछे मेट्रो स्टेशन तक आता, मेरे सीढ़ियां चढ़ने तक देखता और फिर वापस लौट जाता।\n\nएक रात करीब 11:30 बजे जब मैं एक सुनसान अंडरपास से पैदल लौट रहा था, तभी दो लड़कों ने जेब से चाकू निकालकर मेरा लैपटॉप बैग छीनने की कोशिश की। मैं डर के मारे जम चुका था, मुंह से आवाज तक नहीं निकल रही थी। तभी अचानक अंधेरे से वही काला कुत्ता बिजली की तेजी से लपका और इतनी भयानक गुर्राहट के साथ उन लड़कों पर झपटा कि वे दोनों घबराकर भाग खड़े हुए। उस कुत्ते ने मुझे घर के दरवाजे तक छोड़ा और फिर बारिश में गायब हो गया। उस रात मुझे समझ आया कि वफादारी और सुरक्षा कोई लेन-देन नहीं है; कभी-कभी भगवान आपकी हिफाजत के लिए एक बेजुबान को फरिश्ता बनाकर भेज देता है।"
  },
  {
    id: 'incident_post_4',
    category: 'incident',
    city: 'Kochi',
    country: 'India',
    author: 'अभिषेक मेनन',
    rawImage: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=700&q=75',
    text: "साल 2018 में जब केरल में भयंकर बाढ़ आई थी, तब मैं कोच्चि के पास अपने दफ्तर के काम से गया हुआ था। अचानक पानी इतनी तेजी से बढ़ा कि हमारा पूरा इलाका जलमग्न हो गया और हम एक दोमंजिला इमारत की छत पर करीब 36 घंटे तक भूखे-प्यासे फंसे रह गए। चारों तरफ सिर्फ मटमैला पानी, बहते हुए पेड़ और तबाही का मंजर था।\n\nछत पर हमारे साथ सामने वाली झुग्गी का एक दिहाड़ी मजदूर भी अपने परिवार के साथ फंसा हुआ था। दोपहर के वक्त जब एनडीआरएफ की नाव बहुत दूर से निकल गई और हम तक नहीं पहुंच पाई, तो उस मजदूर ने अपनी भीगी हुई पोटली खोली। उसमें सिर्फ चार सूखी रोटियां और थोड़ा सा गुड़ था। उस इंसान ने बिना एक पल सोचे अपनी बच्ची को एक टुकड़ा दिया और बाकी रोटियां हम सब अजनबियों में बराबर बांट दीं। हम सब महंगे कपड़ों और महंगी घड़ियों वाले लोग उस पल अपनी सारी दौलत के बावजूद उस मजदूर के बड़प्पन के सामने बहुत छोटे और लाचार लग रहे थे।"
  },
  {
    id: 'incident_post_5',
    category: 'incident',
    city: 'Agra',
    country: 'India',
    author: 'दीपक यादव',
    rawImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=700&q=75',
    text: "सर्दियों की रात में करीब दो बजे यमुना एक्सप्रेसवे पर मेरी बाइक का पिछला टायर अचानक पंक्चर हो गया। सुनसान हाईवे, घना कोहरा और कड़ाके की ठंड में डर के मारे मेरे हाथ कांप रहे थे। मोबाइल में नेटवर्क भी नहीं आ रहा था और किसी अनहोनी का डर सता रहा था।\n\nकरीब आधा घंटा खड़े रहने के बाद एक पुराना मालवाहक ट्रक रुका। उसका ड्राइवर नीचे उतरा, उसने बिना कोई सवाल पूछे अपना भारी टूलकिट निकाला, करीब बीस मिनट तक ठंड में ठिठुरते हुए मेरी बाइक का टायर ठीक किया और मुझे अपनी थर्मस से गर्म चाय भी पिलाई। जब मैंने हाथ जोड़कर पैसे देने चाहे, तो उसने मुस्कुराकर मना कर दिया और बोला—'बाबूजी, सफर में इंसान ही इंसान के काम आता है, बस घर पहुंच कर अपनी मां को फोन कर देना।' उस रात मुझे हाईवे पर इंसानियत का असली चेहरा देखने को मिला।"
  },
  {
    id: 'incident_post_6',
    category: 'incident',
    city: 'Munich',
    country: 'Germany',
    author: 'Lukas Weber',
    rawImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=700&q=75',
    text: "Five summers ago, I found myself stranded at a desolate rural railway junction in eastern Romania after a pickpocket stole my travel wallet and passport. I spoke zero Romanian, and the night station master spoke no English or German.\n\nSeeing my visible panic, the elderly station master gently motioned me into his tiny signal room. He pulled out his personal metal thermos of mint tea, sliced a loaf of dense country bread, and handed me enough local currency from his desk drawer to purchase a regional ticket to the embassy in Bucharest. When I offered my silver wristwatch as collateral, he pushed my hand back and pointed toward the ceiling. True benevolence transcended every linguistic barrier that evening."
  },
  {
    id: 'incident_post_7',
    category: 'incident',
    city: 'Portland',
    country: 'USA',
    author: 'Sarah Jenkins',
    rawImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=700&q=75',
    text: "During the height of the 2020 lockdowns, I lived completely alone in an old duplex while recovering from complex knee surgery. Carrying groceries up the porch steps was excruciating, and depression had set in heavily.\n\nEvery Monday morning at 8:00 AM sharp, a brown paper bag appeared outside my front door containing fresh sourdough bread, oranges, and a handwritten index card with a quote on resilience. Whoever dropped it off never rang the bell, never left a name, and never sought gratitude. That quiet, anonymous generosity sustained my mental health during the darkest four months of my life."
  },
  {
    id: 'incident_post_8',
    category: 'incident',
    city: 'Rome',
    country: 'Italy',
    author: 'Matteo Rossi',
    rawImage: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=700&q=75',
    text: "I witnessed a minor vehicular collision at an extremely congested roundabout near Trastevere during peak evening traffic. In most metropolises, this would instantly descend into screaming, threats, and police reports.\n\nBoth drivers stepped out of their battered Fiats, evaluated the scratched bumper, looked at each other's tired eyes, and simultaneously sighed. Instead of arguing, one driver pulled out a freshly baked box of cannoli from his backseat, offered it to the other, and they stood on the cobblestones laughing and exchanging bakeries while directing traffic around them. Rome reminded me that afternoon that warmth is a deliberate choice."
  },
  {
    id: 'incident_post_9',
    category: 'incident',
    city: 'San Francisco',
    country: 'USA',
    author: 'Chloe Vance',
    rawImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=75',
    text: "I was sitting alone at an international departure gate at SFO weeping uncontrollably following a traumatic, abrupt end to a seven-year engagement. I pulled my baseball cap low, praying nobody would notice the mess I was.\n\nA senior flight attendant walking by stopped, knelt down next to my seat without asking any intrusive questions, and placed a cup of hot chamomile tea in my hands. Written on the paper napkin beneath it was a single sentence: 'The sky is too infinite for small griefs; you are flying toward a life you cannot yet imagine.' I carried that napkin in my wallet for four years."
  },
  {
    id: 'incident_post_10',
    category: 'incident',
    city: 'Edinburgh',
    country: 'Scotland',
    author: 'Callum MacLeod',
    rawImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=700&q=75',
    text: "While hiking through the Highlands in late October, sudden sleet completely soaked my waterproof jacket, causing mild hypothermia. Disoriented, I stumbled upon a solitary croft cottage with smoke rising from its chimney.\n\nA retired couple welcomed me inside without a second of hesitation. They wrapped me in dry wool tartans, fed me hot venison stew, and gave me a bed by the hearth for the night. In a cynical world obsessed with surveillance and suspicion, simple hospitality remains the greatest miracle of human nature."
  },

  // ---------------------- 5. MOTIVATIONAL (10 Posts) ----------------------
  {
    id: 'moti_post_1',
    category: 'motivational',
    city: 'Kolkata',
    country: 'India',
    author: 'প্রীতম ঘোষ',
    rawImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=75',
    text: "পরাজয় মানেই কিন্তু জীবনের সমাপ্তি নয়; পরাজয় হলো আরও বেশি প্রস্তুতি, আরও গভীর অভিজ্ঞতা নিয়ে পুনরায় ময়দানে নামার এক রাজকীয় অনুমতি। আমরা মানুষরা সমাজের বেঁধে দেওয়া কৃত্রিম টাইমলাইনের পেছনে ছুটতে গিয়ে নিজেদের নিঃস্ব করে ফেলি—পঁচিশেই প্রতিষ্ঠিত হতে হবে, তিরিশেই বাড়ি বানাতে হবে। কিন্তু জীবন কোনো অঙ্কের সূত্রের বাঁধাধরা ছক মেনে চলে না।\n\nএকদিন যে বটগাছটা প্রচণ্ড কালবৈশাখী ঝড়ে সমস্ত ডালপালা হারিয়ে ন্যাড়া হয়ে যায়, সে কিন্তু মাটির নিচে নিজের শিকড়গুলোকে আরও শক্ত করে আঁকড়ে ধরে রাখে। বসন্ত আসার সাথে সাথেই সেই রিক্ত ডালপালাতেই আবার নতুন সবুজ পাতার মেলা বসে। আপনি যদি এই মুহূর্তে চাকরি হারানো, ব্যবসায় লোকসান কিংবা ব্যক্তিগত কোনো ব্যর্থতার অন্ধকার খাদে দাঁড়িয়ে থাকেন, তবে মনে রাখবেন আপনার এই কঠিন সময়টাই আসলে আপনার চরিত্র গঠন করছে। যে মানুষ নিজের আত্মবিশ্বাসের কাছে কখনো মাথা নত করে না, তাকে পৃথিবীর কোনো প্রতিকূল শক্তি চিরতরে পরাজিত করতে পারে না। নিজের স্বপ্নের প্রতি বিশ্বস্ত থাকুন, অন্ধকার কেটে সুপ্রভাত আসবেই।"
  },
  {
    id: 'moti_post_2',
    category: 'motivational',
    city: 'Dhaka',
    country: 'Bangladesh',
    author: 'রাশেদ করিম',
    rawImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=75',
    text: "আমরা অনেকেই সঠিক এবং নিখুঁত সময়ের অপেক্ষায় থাকতে থাকতে জীবনের অর্ধেক মূল্যবান সময় অপচয় করে ফেলি। কিন্তু বাস্তবতা হলো, জীবনে 'নিখুঁত সময়' বলে আলাদা কিছু কখনোই আসবে না। আপনার হাতে আজ, এই মুহূর্তে যা কিছু সীমিত সামর্থ্য আর সুযোগ আছে, তা নিয়েই আপনার স্বপ্নের প্রথম পদক্ষেপটি ফেলে দিন। পথ চলতে শুরু করলেই পথের বাকি বাধাগুলো পরিষ্কার হতে শুরু করে।\n\nকোনো কিছু নতুন করে শূন্য থেকে শুরু করতে ভয় পাবেন না। কারণ যখন আপনি আবার শুরু করেন, তখন আপনি শূন্য থেকে শুরু করেন না, আপনি শুরু করেন আপনার অতীতের অভিজ্ঞতা আর আত্মবিশ্বাস থেকে। আপনার বুকের ভেতরে বয়ে চলা প্রতিটি নীরব ক্ষত এই কথার প্রমাণ যে অতীতের সবচেয়ে খারাপ দিনগুলোও আপনাকে ধ্বংস করে দিতে পারেনি। নিজের সামর্থ্যের ওপর আস্থা রাখুন, সৎ থাকুন আর ধৈর্য ধরুন; বিজয় আপনার পদচুম্বন করবেই।"
  },
  {
    id: 'moti_post_3',
    category: 'motivational',
    city: 'Patna',
    country: 'India',
    author: 'संजय वर्मा',
    rawImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=700&q=75',
    text: "जब मैं 35 साल का था, तब मैंने अपनी सुरक्षित नौकरी छोड़कर कोडिंग और सॉफ्टवेयर डेवलपमेंट सीखने का जोखिम भरा फैसला लिया था। उस वक्त मेरे सभी रिश्तेदारों और दोस्तों ने खुलकर कहा था कि मेरा दिमाग खराब हो चुका है और इस उम्र में नई शुरुआत करना सिर्फ अपने पैरों पर कुल्हाड़ी मारना है। शुरुआती डेढ़ साल इतने कठिन थे कि कई बार रात को सिंटैक्स एरर देखकर रोना आ जाता था और लगता था कि शायद मैंने बहुत बड़ी गलती कर दी।\n\nलेकिन उस मुश्किल दौर में मैंने खुद से सिर्फ एक वादा किया था कि चाहे पूरी दुनिया मेरा मजाक उड़ाए, मैं मैदान छोड़कर नहीं भागूंगा। मैंने रोज सुबह 5 बजे उठकर अभ्यास किया, दर्जनों इंटरव्यूज में रिजेक्शन झेले, और बिना हिम्मत हारे खुद को तराशता रहा। आज जब मैं एक ग्लोबल टेक कंपनी में काम कर रहा हूं, तो वही लोग कहते हैं कि 'संजय की तो किस्मत बहुत अच्छी थी'। यह दुनिया केवल आपकी सफलता को देखती है, उसके पीछे छिपी रातों की मेहनत और आंसुओं को नहीं। इसलिए जब आप गिरें, तो लोगों की परवाह किए बिना खुद उठ खड़े होइए; मेहनत कभी खाली नहीं जाती।"
  },
  {
    id: 'moti_post_4',
    category: 'motivational',
    city: 'Bhopal',
    country: 'India',
    author: 'आकाश चतुर्वेदी',
    rawImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=75',
    text: "जब तक आप खुद को दूसरों की नजरों और उनकी तारीफों से तोलना बंद नहीं करेंगे, तब तक आपको अपनी वास्तविक शक्ति का कभी एहसास नहीं होगा। पेड़ जब पतझड़ में अपने सारे पत्ते गिरा देता है, तो वह रोता नहीं है; वह चुपचाप अपनी जड़ों को मजबूत करके आने वाले वसंत की नई कोपलों की तैयारी में लग जाता है।\n\nआपकी आज की स्थिति चाहे कितनी भी निराशाजनक क्यों न हो, यह आपका अंतिम गंतव्य नहीं है। यह सिर्फ एक कठिन अध्याय है, पूरी किताब अभी बाकी है। जो लोग आज आप पर विश्वास नहीं कर रहे हैं, कल वे ही आपकी सफलता की कहानियां सुनाएंगे। अपनी मेहनत पर भरोसा रखिए और हर दिन सिर्फ एक कदम आगे बढ़ाइए।"
  },
  {
    id: 'moti_post_5',
    category: 'motivational',
    city: 'Ranchi',
    country: 'India',
    author: 'प्रवीण मुंडा',
    rawImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=75',
    text: "जिंदगी में सबसे बड़ा सुकून तब मिलता है जब आप उन कमियों और मुश्किलों को अपनी ताकत बना लेते हैं जिनसे आप कभी डरते थे। गरीबी और अभाव इंसान को तोड़ भी सकते हैं और उसे फौलाद भी बना सकते हैं; यह पूरी तरह इस बात पर निर्भर करता है कि आपने क्या रास्ता चुना।\n\nसोना जब तक भट्टी की तेज आग में नहीं तपता, तब तक उसमें निखार नहीं आता। अपनी असफलताओं से डरने के बजाय उनसे सबक लीजिए। जब आप ईमानदारी और लगन के साथ आगे बढ़ते हैं, तो पूरी कायनात आपके लिए रास्ते बनाने लगती है।"
  },
  {
    id: 'moti_post_6',
    category: 'motivational',
    city: 'Stockholm',
    country: 'Sweden',
    author: 'Niel Berg',
    rawImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=700&q=75',
    text: "At twenty-eight years old, I experienced the total collapse of my professional and personal life within a four-month window. My bootstrap tech startup dissolved into debt, my savings evaporated, and my five-year engagement ended because the instability became unsustainable. I remember lying on a carpet in an unfurnished apartment convinced that adulthood had permanently defeated me.\n\nDuring that dark season, an elder artisan told me: 'When an oak branch is bent violently under frozen snow, it is not broken; it is storing kinetic vitality to spring back toward the sun.' I swallowed my bruised pride, took low-paying junior freelance work, lived on oats, and rebuilt my craft line by line. Today, at thirty-four, I run a calm, sustainable design studio, married to a true partner. Rock bottom was not my grave; it was the granite bedrock upon which I built an unshakeable character."
  },
  {
    id: 'moti_post_7',
    category: 'motivational',
    city: 'Singapore',
    country: 'Singapore',
    author: 'Maya Lin',
    rawImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=700&q=75',
    text: "Never allow the fear of starting over prevent you from leaving rooms where your self-respect is compromised. Starting over is not starting from zero; you are starting from a wealth of accumulated intuition, hard-won resilience, and clearer boundaries.\n\nThe years you spent learning what does not work were not wasted; they were the tuition fees you paid to identify what truly matters. The universe frequently dismantles our comfortable cages precisely because our wings were built for higher horizons. Breathe deeply and take the leap."
  },
  {
    id: 'moti_post_8',
    category: 'motivational',
    city: 'Brisbane',
    country: 'Australia',
    author: 'Tessa Rowe',
    rawImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=700&q=75',
    text: "You do not require validation from an audience to confirm that you made meaningful progress today. If you woke up, confronted your private anxieties, maintained gentleness toward strangers, and refused to surrender to cynicism, that constitutes a quiet victory.\n\nWe are conditioned to celebrate loud, cinematic milestones while ignoring the monumental courage it takes to carry on when nobody is clapping. Keep showing up for yourself in secret; the compounding effect of quiet consistency will eventually speak for itself."
  },
  {
    id: 'moti_post_9',
    category: 'motivational',
    city: 'Oslo',
    country: 'Norway',
    author: 'Daniel Kvam',
    rawImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=700&q=75',
    text: "Stop apologizing for outgrowing people, environments, and mindsets that require you to shrink in order to keep them comfortable. You owe your future self the discipline to walk away from spaces that no longer stimulate your evolution.\n\nThe ocean does not apologize for its depth, and mountains do not apologize for their incline. Stand tall in the integrity of your purpose, embrace the solitary stretches of the climb, and understand that peace is far more lucrative than approval."
  },
  {
    id: 'moti_post_10',
    category: 'motivational',
    city: 'Toronto',
    country: 'Canada',
    author: 'Aiden Campbell',
    rawImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=700&q=75',
    text: "The greatest triumph of your life will not be the absence of failure, but the discovery that you possess an inner furnace capable of transforming any tragedy into fuel. Do not measure your worth by the ease of your circumstances, but by the dignity with which you navigate your storms.\n\nEvery great story requires an abyss before the revelation. Hold your ground, keep your vision clear, and remember that stars can only illuminate when surrounded by the dark."
  }
];

// =========================================================================
// CONTEXTUAL MATCHED COMMENTS BY EXACT LANGUAGE
// =========================================================================
const COMMENTS_BY_LANG: Record<'bn' | 'hi' | 'en', string[]> = {
  bn: [
    'কথাগুলো একদম মনের গভীরে গিয়ে লাগলো। আপনার প্রতি অনেক শ্রদ্ধা।',
    'আমরা অনেকেই এই কষ্টটা নীরবে বয়ে বেড়াই। ভালো থাকুন আপনি।',
    'নিজের ওপর বিশ্বাস হারাবেন না, খারাপ সময় কেটে সুপ্রভাত আসবেই।',
    'এত সুন্দর করে নিজের অব্যক্ত অনুভূতিগুলো তুলে ধরার জন্য ধন্যবাদ।'
  ],
  hi: [
    'यह बात सीधे दिल को छू गई। बहुत हिम्मत चाहिए ऐसा सच स्वीकार करने के लिए।',
    'आप अकेले नहीं हैं, हम सब जिंदगी के किसी न किसी मोड़ पर इससे गुजरते हैं।',
    'खुद पर भरोसा रखिए दोस्त, अंधेरा चाहे जितना घना हो, सवेरा जरूर होता है।',
    'इतनी सच्चाई और ईमानदारी से अपनी बात कहने के लिए दिल से सम्मान।'
  ],
  en: [
    'This resonated with me on such an intimate level. Thank you for speaking your truth.',
    'Quiet battles are often the heaviest to carry. Sending you peace and strength.',
    'You are not alone in feeling this way. Keep your head high; better days are ahead.',
    'I genuinely needed to read this perspective today. Thank you for sharing.'
  ]
};

const ENGAGEMENT_REACTIONS = ['❤️', '🤗', '😢', '👏', '🔥', '😂', '🙏'];

export function detectLanguageByLocation(city: string, country: string): 'bn' | 'hi' | 'en' {
  if (country === 'Bangladesh' || city === 'Kolkata') return 'bn';
  if (country === 'India') return 'hi';
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

async function buildRealisticConfession(item: SimulatedPostItem, timestamp: number): Promise<Confession> {
  const lang = detectLanguageByLocation(item.city, item.country);
  const pool = COMMENTS_BY_LANG[lang];
  const commCount = Math.floor(Math.random() * 3) + 2;

  // Generate realistic human relative comments with staggered timestamps
  const commentsList = Array.from({ length: commCount }).map((_, idx) => {
    const commentPastMs = timestamp + (idx + 1) * (12 * 60 * 1000); // 12-24m after post
    return {
      id: `comm_${item.id}_${idx}`,
      author: 'Anonymous',
      text: pool[Math.floor(Math.random() * pool.length)],
      createdAt: commentPastMs,
    };
  });

  const compressedImageJpg = await compressUrlToUnder50KB(item.rawImage);

  return {
    id: item.id,
    authorName: item.author,
    text: item.text,
    city: item.city,
    country: item.country,
    region: `${item.city}, ${item.country}`,
    imageUrl: compressedImageJpg, // Guaranteed under-50KB clean JPG
    createdAt: timestamp, // Dynamic epoch milliseconds for real-time age calculation
    likesCount: Math.floor(Math.random() * 45) + 12,
    likes: Math.floor(Math.random() * 45) + 12,
    commentsCount: commCount,
    comments: commCount,
    commentsList,
    viewsCount: Math.floor(Math.random() * 350) + 80,
    userReaction: ENGAGEMENT_REACTIONS[Math.floor(Math.random() * ENGAGEMENT_REACTIONS.length)],
  } as any;
}

/**
 * 1 GHANTE ME 2-3 POSTS DRIP LOGIC (Interval ~22-26 mins)
 * Automatically compresses image under 50KB and ensures no post repeats again.
 */
export async function syncSimulatedActivity(existingPosts: Confession[]): Promise<Confession[]> {
  let livePosts = getLiveSimulatedPosts();
  const usedIds = getUsedPostIds();
  const now = Date.now();

  // Initial Seed: 2 long posts with dynamic past time if empty
  if (livePosts.length === 0) {
    const available = CURATED_POST_POOL.filter((p) => !usedIds.has(p.id));
    const firstTwo = available.slice(0, 2);

    for (let idx = 0; idx < firstTwo.length; idx++) {
      const item = firstTwo[idx];
      const pastTime = now - (idx + 1) * 35 * 60 * 1000; // 35m & 70m ago
      const post = await buildRealisticConfession(item, pastTime);
      livePosts.push(post);
      recordUsedPostId(item.id);
    }

    saveLiveSimulatedPosts(livePosts);
    localStorage.setItem(LAST_SIMULATION_TIMESTAMP_KEY, String(now));
  }

  // Check 20-25 mins elapsed for next post (2-3 posts per hour)
  const lastPostTime = Number(localStorage.getItem(LAST_SIMULATION_TIMESTAMP_KEY) || 0);
  const DRIP_INTERVAL = 22 * 60 * 1000; // ~22 mins

  if (now - lastPostTime >= DRIP_INTERVAL) {
    const freshAvailable = CURATED_POST_POOL.filter((p) => !usedIds.has(p.id));

    if (freshAvailable.length > 0) {
      const nextItem = freshAvailable[0];
      const newDripPost = await buildRealisticConfession(nextItem, now);

      livePosts.unshift(newDripPost);
      recordUsedPostId(nextItem.id);
      saveLiveSimulatedPosts(livePosts);
      localStorage.setItem(LAST_SIMULATION_TIMESTAMP_KEY, String(now));
    }
  }

  const existingIdSet = new Set(existingPosts.map((p) => String(p.id)));
  const filteredSimulated = livePosts.filter((p) => !existingIdSet.has(String(p.id)));

  return [...existingPosts, ...filteredSimulated];
}

/**
 * Real-time progressive engagement for real user posts
 */
export function scheduleEngagementForNewPost(
  confession: Confession,
  onUpdate: (data: { likesCountIncrement?: number; newComment?: any }) => void
) {
  const city = (confession as any).city || '';
  const country = (confession as any).country || '';
  const lang = detectLanguageByLocation(city, country);
  const pool = COMMENTS_BY_LANG[lang];

  setTimeout(() => {
    onUpdate({ likesCountIncrement: 1 });
  }, 4000 + Math.random() * 4000);

  setTimeout(() => {
    onUpdate({
      newComment: {
        id: `sim_user_comm_${Date.now()}`,
        author: 'Anonymous',
        text: pool[Math.floor(Math.random() * pool.length)],
        createdAt: Date.now(),
      },
    });
  }, 12000 + Math.random() * 10000);
}
