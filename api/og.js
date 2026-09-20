const POSTS_PROJECT_ID = 'open-confees';
const POSTS_API_KEY = 'AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8';

export default async function handler(req, res) {
  const postId = req.query.post;

  let title = 'Open Confess';
  let description = 'Read real confessions, thoughts and stories.';
  let imageUrl = 'https://openconfess.vercel.app/favicon.png';

  if (postId) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions/${postId}?key=${POSTS_API_KEY}`;
      const firestoreRes = await fetch(url);
      const data = await firestoreRes.json();
      
      if (data && data.fields) {
        if (data.fields.category && data.fields.category.stringValue) {
          title = `${data.fields.category.stringValue} | Open Confess`;
        }
        const rawText = (data.fields.text && data.fields.text.stringValue) || 
                        (data.fields.content && data.fields.content.stringValue) || '';
        if (rawText) {
          description = rawText.slice(0, 150).replace(/"/g, "'");
        }
        if (data.fields.imageUrl && data.fields.imageUrl.stringValue) {
          imageUrl = data.fields.imageUrl.stringValue;
        } else if (data.fields.image && data.fields.image.stringValue) {
          imageUrl = data.fields.image.stringValue;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  const isBot = /facebookexternalhit|whatsapp|twitterbot|telegrambot|linkedinbot|slackbot|discordbot/i.test(userAgent);

  const destinationUrl = `https://www.openconfess.com/?post=${postId || ''}`;

  if (isBot) {
    const botHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Open Confess">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:secure_url" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${destinationUrl}">
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

  return res.redirect(302, destinationUrl);
}
