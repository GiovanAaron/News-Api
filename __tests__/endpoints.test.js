const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const { allEndPoints } = require("../controller/api.controller");
const { text } = require("express");
allEndPoints;

beforeEach(() => {
  return seed(data);
});
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("Gets all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;

        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("Get /api", () => {
  it("should list all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(allEndPoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test(`Responds with:

  an article object, which should have the following properties:
  author
  title
  article_id
  body
  topic
  created_at
  votes
  article_img_url`, () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  xtest(`should return error if entry doesn't exist`, () => {
    return request(app)  
    .get("/api/article/50")
    .expect(400)
    .then(({body}) =>{
      console.log(body)
    })
  });
});
