const express = require("express");
const {
  getAllTopics,
  getAllEndpoints,
  getArticleByID,
  getArticles
} = require("./controller/api.controller");

const app = express();

app.get("/api", getAllEndpoints);
app.get("/api/topics", getAllTopics);
app.get('/api/articles/:article_id', getArticleByID)
app.get('/api/articles', getArticles)

module.exports = app;
