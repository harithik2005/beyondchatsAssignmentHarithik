const express = require("express");
const articleRoutes = require("./routes/articleRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/articles", articleRoutes);

app.get("/", (req, res) => {
  res.send("BeyondChats API running");
});

module.exports = app;
