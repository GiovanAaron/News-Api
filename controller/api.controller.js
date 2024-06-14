const {
  fetchArticlesById,
  fetchArticles,
  updateVotes,
  getFilteredArticles,
} = require("../models/articles.models");
const {
  fetchAllComments,
  submitComment,
  removeComment,
  countComments,
} = require("../models/comments.models");
const { fetchAllTopics } = require("../models/topics.models");
const { fetchUsers } = require("../models/users.models");

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

  const path = req.path;
  const urlEnd = path.substring(path.lastIndexOf("/") + 1);

  if (urlEnd === "comment_count") {
    countComments(articleID).then(({ count }) => {
      count = parseInt(count);
      res.status(200).send({ count });
    });
  } else {
    fetchArticlesById(articleID)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch((error) => {
        next(error);
      });
  }
};

exports.getArticles = (req, res) => {
  if (Object.keys(req.query).length) {
    getFilteredArticles(req.query).then((articles) => {
      res.status(200).send({ articles });
    });
  } else {
    fetchArticles().then((article) => {
      res.status(200).send({ article });
    });
  }
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
      res.status(200).send(body);
    })
    .catch((error) => {
      const psqlError = {};

      switch (error.code) {
        case "23502":
          psqlError.status = 400;
          psqlError.msg = "Bad Request";
      }

      next(psqlError);
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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then((queryResult) => {
      res.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUsers = (req, res) => {
  fetchUsers().then((users) => res.status(200).send({ users }));
};
