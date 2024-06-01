const {
  fetchArticlesById,
  fetchArticles,
  updateVotes,
} = require("../models/articles.models");
const {
  fetchAllComments,
  submitComment,
} = require("../models/comments.models");
const { fetchAllTopics } = require("../models/topics.models");

exports.allEndPoints = require("../endpoints.json");

exports.getAllTopics = (req, res) => {
  fetchAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getAllEndpoints = (req, res) => {
  res
    .status(200)
    .send(this.allEndPoints)
    .catch((error) => {
      res.status(500).send({ error: "internal server error" });
    });
};

exports.getArticleByID = (req, res, next) => {
  const articleID = req.params;

  fetchArticlesById(articleID)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticles = (req, res) => {
  fetchArticles().then((article) => {
    res.status(200).send({ article });
  });
};

exports.getCommentsFromArticle = (req, res, next) => {
  const { article_id } = req.params;

  fetchAllComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postComment = (req, res, next) => {
  const { body } = req;

  submitComment(body)
    .then((comment) => {
      console.log("return comment from the models -->", comment);
      res.status(200).send(body);
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchVotes = (req, res, next) => {
  const { body } = req;
  const { article_id } = req.params;
  const votes = body.inc_votes;

  const sendKey = JSON.stringify(Object.keys(body));

  updateVotes(article_id, votes, sendKey)
    .then((article) => {
      //console.log("return comment from the models -->", article)
      res.status(200).send(article[0]);
    })
    .catch((error) => {
      next(error);
    });
};
