function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default async function handler(req, res) {
  const { post: postId, id: altId } = req.query;
  const targetId = postId || altId;

  let title = "Open Confess";
  let description = "Read confessions, thoughts and stories anonymously.";
  let imageUrl = "https://open-confess.vercel.app/favicon.png";

  const POSTS_PROJECT_ID = "open-confees";
  const POSTS_API_KEY = "AIzaSyApMJTBvr7zbzJTP85xZAb994NfLWUBSz8";

  if (targetId) {
    try {
      const firestoreRes = await fetch(
        `https://firestore.googleapis.com/v1/projects/${POSTS_PROJECT_ID}/databases/(default)/documents/confessions/${targetId}?key=${POSTS_API_KEY}`
      );
      const data = await firestoreRes.json();

      if (data && data.fields) {
        const rawText =
          data.fields.text?.stringValue ||
          data.fields.content?.stringValue ||
          data.fields.body?.stringValue ||
          "";

        if (rawText) {
          description = rawText
            .replace(/[\r\n]+/g, " ")
            .slice(0, 160);
        }

        imageUrl =
          data.fields.imageUrl?.stringValue ||
          data.fields.image?.stringValue ||
          imageUrl;

        const category = data.fields.category?.stringValue;
        const city = data.fields.city?.stringValue;
        const author = data.fields.authorName?.stringValue || data.fields.author?.stringValue;

        if (city && category) {
          title = `${category} in ${city} | Open Confess`;
        } else if (category) {
          title = `${category.toUpperCase()} | Open Confess`;
        } else if (author) {
          title = `Confession by ${author} | Open Confess`;
        }
      }
    } catch (e) {
      console.error("Error fetching post data:", e);
    }
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host || "open-confess.vercel.app";
  const proto = req.headers["x-forwarded-proto"] || "https";
  const currentUrl = `${proto}://${host}/api/og?post=${targetId || ""}`;
  const destinationUrl = `${proto}://${host}/?post=${targetId || ""}`;

  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImageUrl = escapeHtml(imageUrl);
  const safeCurrentUrl = escapeHtml(currentUrl);

  const userAgent = (req.headers["user-agent"] || "").toLowerCase();
  const isBot =
    /facebookexternalhit|facebot|facebookcatalog|whatsapp|twitterbot|telegrambot|linkedinbot|slackbot|discordbot/i.test(
      userAgent
    );

  if (isBot) {
    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Open Confess">
    <meta property="og:url" content="${safeCurrentUrl}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:image" content="${safeImageUrl}">
    <meta property="og:image:secure_url" content="${safeImageUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Post image">

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${safeCurrentUrl}">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">
    <meta name="twitter:image" content="${safeImageUrl}">
  </head>
  <body>
    <script>
      window.location.replace("${destinationUrl}");
    </script>
  </body>
</html>`;

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(html);
  }

  return res.redirect(302, destinationUrl);
}
