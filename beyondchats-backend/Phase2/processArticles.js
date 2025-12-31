require("dotenv").config();

const axios = require("axios");
const cheerio = require("cheerio");
const Groq = require("groq-sdk");

console.log("GROQ KEY FOUND:", !!process.env.GROQ_API_KEY);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const API_BASE_URL = "http://localhost:5000/api/articles";
const SERPER_URL = "https://google.serper.dev/search";

const fetchOriginalArticles = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data.filter((article) => !article.isUpdated);
};

const searchGoogle = async (query) => {
  const response = await axios.post(
    SERPER_URL,
    { q: query, num: 5 },
    {
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.organic || [];
};

const getTopExternalBlogs = (results) => {
  const blockedDomains = [
    "amazon.",
    "pinterest.",
    "facebook.",
    "twitter.",
    "linkedin.",
    "youtube.",
    "reddit.",
    "quora.",
    "flipkart.",
  ];

  return results
    .filter((r) => {
      if (!r.link) return false;
      if (r.link.includes("beyondchats.com")) return false;

      // block unwanted platforms
      for (const domain of blockedDomains) {
        if (r.link.includes(domain)) return false;
      }

      // prefer blog/article-like URLs
      return (
        r.link.includes("/blog") ||
        r.link.includes("/article") ||
        r.link.includes("/posts") ||
        r.link.includes("medium.com") ||
        r.link.includes("dev.to")
      );
    })
    .slice(0, 2)
    .map((r) => r.link);
};

const scrapeExternalArticle = async (url) => {
  try {
    const { data } = await axios.get(url, { timeout: 15000 });
    const $ = cheerio.load(data);

    let content = "";

    if ($("article").length) {
      content = $("article").text();
    } else {
      content = $("p")
        .map((_, el) => $(el).text())
        .get()
        .join("\n");
    }

    return content.replace(/\s+/g, " ").trim();
  } catch (error) {
    console.error(`Failed to scrape: ${url}`);
    return "";
  }
};

const limitText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) : text;
};

const rewriteWithAI = async (
  originalTitle,
  originalContent,
  referenceContents
) => {
  const prompt = `
You are a professional content editor.

Original article title:
"${originalTitle}"

Original article content:
${originalContent}

Reference articles content:
${referenceContents.join("\n\n")}

Task:
Rewrite the original article so that:
- The structure and tone are inspired by the reference articles
- The content is original (not copied)
- The article is clear, well-formatted, and professional
- Keep it suitable for a blog post

Return ONLY the rewritten article content.
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",

    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
};

const saveUpdatedArticle = async (articleId, updatedContent, references) => {
  try {
    await axios.put(`http://localhost:5000/api/articles/${articleId}`, {
      contentText: updatedContent,
      isUpdated: true,
      references,
    });

    console.log("💾 Article updated in DB");
  } catch (error) {
    console.error("Failed to save article:", error.message);
  }
};

const startPhase2 = async () => {
  const articles = await fetchOriginalArticles();

  for (const article of articles) {
    console.log(`\n🧠 Processing article: ${article.title}`);

    const results = await searchGoogle(article.title);
    const links = getTopExternalBlogs(results);

    const referenceContents = [];

    for (const link of links) {
      const content = await scrapeExternalArticle(link);
      if (content) referenceContents.push(content);
    }

    if (referenceContents.length < 2) {
      console.log("Skipping (not enough reference content)");
      continue;
    }

    const aiContent = await rewriteWithAI(
      article.title,
      limitText(article.contentText, 1500),
      referenceContents.map((content) => limitText(content, 2000))
    );

    await saveUpdatedArticle(article._id, aiContent, links);

    console.log(`✅ AI generated content length: ${aiContent.length}`);
  }
};

startPhase2();
