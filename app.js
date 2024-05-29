const express = require("express");
const {
  getAllTopics,
  getAllEndpoints
} = require("./controller/api.controller");

const app = express();

app.get("/api", getAllEndpoints);
app.get("/api/topics", getAllTopics);


module.exports = app;
