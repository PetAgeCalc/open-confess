export default async function handler(req, res) {
  const { post: postId } = req.query;

  let title = "Open Confess";
  let description = "Read confessions, thoughts and stories anonymously.";
  let imageUrl = "https://open-confess.vercel.app/favicon.png";

  const POSTS_PROJECT_ID = "open-confees";
  const POSTS_API_KEY = "AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8";

  if (postId) {
    try {
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
          // Double quotes aur new lines clean karna taaki meta tag break na ho
          description = rawText
            .replace(/[\r\n]+/g, " ")
            .replace(/"/g, "'")
            .slice(0, 160);
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

  // Current request ka domain dynamically lena
  const host = req.headers["x-forwarded-host"] || req.headers.host || "open-confess.vercel.app";
  const proto = req.headers["x-forwarded-proto"] || "https";
  const currentUrl = `${proto}://${host}/api/og?post=${postId || ""}`;
  const destinationUrl = `${proto}://${host}/?post=${postId || ""}`;

  const userAgent = (req.headers["user-agent"] || "").toLowerCase();
  
  // Facebook ke saare web crawlers aur scrapers
  const isBot =
    /facebookexternalhit|facebot|facebookcatalog|whatsapp|twitterbot|telegrambot|linkedinbot|slackbot|discordbot/i.test(
      userAgent
    );

  // Agar Bot/Crawler hai YA link direct open kiya gaya hai (Facebook in-app scraper safe handling)
  if (isBot) {
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="description" content="${description}">

    <!-- Open Graph / Facebook Tags -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Open Confess">
    <meta property="og:url" content="${currentUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${imageUrl}">
    <meta property="og:image:secure_url" content="${imageUrl}">
    <meta property="og:image:alt" content="Post image">

    <!-- Twitter Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${currentUrl}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${imageUrl}">
  </head>
  <body>
    <script>
      // Real browser mein open hote hi website par bhej dega
      window.location.replace("${destinationUrl}");
    </script>
  </body>
</html>`;

    // Cache control taaki Facebook har naye post ka fresh data le
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  }

  // Real user click: Direct frontend par redirect
  return res.redirect(302, destinationUrl);
}
