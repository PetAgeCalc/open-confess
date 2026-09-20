import type { VercelRequest, VercelResponse } from '@vercel/node';

const POSTS_PROJECT_ID = 'open-confees';
const POSTS_API_KEY = 'AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const postId = req.query.post as string;

  let title = 'Open Confess';
  let description = 'Read real confessions, thoughts and stories.';
  let imageUrl = 'https://openconfess.vercel.app/favicon.png';

  if (postId) {
    try {
      const firestoreRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions/${postId}?key=${POSTS_API_KEY}`
      );
      const data = await firestoreRes.json();
      
      if (data && data.fields) {
        title = data.fields.category?.stringValue ? `${data.fields.category.stringValue} | Open Confess` : 'Open Confess';
        const rawText = data.fields.text?.stringValue || data.fields.content?.stringValue || data.fields.body?.stringValue || '';
        description = rawText ? rawText.slice(0, 160).replace(/"/g, "'") : description;
        imageUrl = data.fields.imageUrl?.stringValue || data.fields.image?.stringValue || imageUrl;
      }
    } catch (e) {}
  }

  // Check if request is from WhatsApp, Facebook, Twitter, Telegram, etc.
  const ua = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = /facebookexternalhit|whatsapp|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|applebot/i.test(ua);

  const targetUrl = `https://www.openconfess.com/?post=${postId || ''}`;

  // Agar WhatsApp/Facebook bot hai, toh SIRF meta tags bhejo (NO REDIRECT)
  if (isBot) {
    const botHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">

  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Open Confess">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${targetUrl}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
</head>
<body></body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(botHtml);
  }

  // Agar koi ASLI INSAAN click kare, toh 302 Temporary Redirect karke seedha site par bhej do
  return res.redirect(302, targetUrl);
}
