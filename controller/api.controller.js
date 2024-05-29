const { fetchAllTopics } = require("../models/topics.models");
exports.allEndPoints = require("../endpoints.json");

exports.getAllTopics = (req, res) => {
  fetchAllTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getAllEndpoints = (req, res) => {
  res.status(200).send(this.allEndPoints)
  .catch((error) => {
    console.error("error in getAllEndpoints", error)
    res.status(500).send({error: 'internal server error' })
  });
};
