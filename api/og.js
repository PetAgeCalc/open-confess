export default async function handler(req, res) {
  const { post: postId } = req.query;

  let title = "Open Confess";
  let description = "Read confessions, thoughts and stories anonymously.";
  let imageUrl = "https://open-confess.vercel.app/favicon.png";

  const POSTS_PROJECT_ID = "open-confees";
  const POSTS_API_KEY = "AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8";

  if (postId) {
    try {
      // Direct Firebase REST API se post fetch karna
      const firestoreRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions/${postId}?key=${POSTS_API_KEY}`
      );
      const data = await firestoreRes.json();

      if (data && data.fields) {
        const rawText =
          data.fields.text?.stringValue ||
          data.fields.content?.stringValue ||
          data.fields.body?.stringValue ||
          "";

        if (rawText) {
          description = rawText.slice(0, 150).replace(/"/g, "'");
        }

        imageUrl =
          data.fields.imageUrl?.stringValue ||
          data.fields.image?.stringValue ||
          imageUrl;

        const category = data.fields.category?.stringValue;
        if (category) {
          title = `${category.toUpperCase()} | Open Confess`;
        }
      }
    } catch (e) {
      console.error("Error fetching post data:", e);
    }
  }

  const destinationUrl = `https://open-confess.vercel.app/?post=${postId || ""}`;

  // User-Agent check: Robot/Crawler hai ya aam insaan
  const userAgent = (req.headers["user-agent"] || "").toLowerCase();
  const isBot =
    /facebookexternalhit|whatsapp|twitterbot|telegrambot|linkedinbot|slackbot|discordbot/i.test(
      userAgent
    );

  // 1. Agar WhatsApp / Facebook / X ka robot hai: HTML Meta Tags do
  if (isBot) {
    const html = `<!DOCTYPE html>
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
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  }

  // 2. Agar koi real user link par click kare: Seedha website par redirect kar do
  return res.redirect(302, destinationUrl);
}
