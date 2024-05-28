const express = require('express')
const { getAllTopics } = require('./controller/api.controller')

const app = express()


app.get("/api/topics", getAllTopics)

module.exports = app