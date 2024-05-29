const express = require("express");
const {
  getAllTopics,
  getAllEndpoints,
  getArticleByID
} = require("./controller/api.controller");

const app = express();

app.get("/api", getAllEndpoints);
app.get("/api/topics", getAllTopics);
app.get('/api/articles/:article_id', getArticleByID)

module.exports = app;
