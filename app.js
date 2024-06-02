const express = require("express");
const {
  getAllTopics,
  getAllEndpoints,
  getArticleByID,
  getArticles,
  getCommentsFromArticle,
  postComment,
  patchVotes,
  deleteComment,
  getUsers,
} = require("./controller/api.controller");

const app = express();
//queries

app.get("/api", getAllEndpoints);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsFromArticle);
app.get("/api/users", getUsers)
app.get("/api/articles/:article_id/comment_count", getArticleByID)


app.use(express.json());

//alterations
app.post("/api/articles/:article_id/comments", postComment);
app.patch("/api/articles/:article_id", patchVotes);
app.delete("/api/comments/:comment_id", deleteComment);

//custom errors
app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

//server errors
app.use((err, req, res, next) => {
  //console.log(err, "<-- from 500")
  res.status(500).send({ msg: "I'm broke!" });
});
module.exports = app;
