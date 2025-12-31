const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
require("dotenv").config();

const Article = require("../src/models/Article");

const BLOG_URLS = [
  "https://beyondchats.com/blogs/introduction-to-chatbots/",
  "https://beyondchats.com/blogs/live-chatbot/",
  "https://beyondchats.com/blogs/customer-service-platforms/",
  "https://beyondchats.com/blogs/chatbots-for-small-business-growth/",
  "https://beyondchats.com/blogs/chatbots-vs-live-chat/",
];

const scrapeBlog = async (url) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const title = $("h1").first().text().trim();

  const contentElement = $("article");
  const contentHtml = contentElement.html();
  const contentText = contentElement.text().trim();

  return {
    title,
    url,
    contentHtml,
    contentText,
  };
};

const startScraping = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    for (const url of BLOG_URLS) {
      try {
        const articleData = await scrapeBlog(url);

        await Article.findOneAndUpdate({ url }, articleData, {
          upsert: true,
          new: true,
        });

        console.log(`Saved: ${articleData.title}`);
      } catch (err) {
        console.error(`Failed to scrape ${url}`);
      }
    }
  } catch (err) {
    console.error("Database connection failed:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("Scraping completed");
  }
};

startScraping();
