const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, default: "Unknown" },
    publishDate: Date,
    tags: [String],
    url: { type: String, required: true, unique: true },
    featuredImage: String,
    contentHtml: { type: String, required: true },
    contentText: String,
    isUpdated: { type: Boolean, default: false },
    references: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
