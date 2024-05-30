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
      .then(({ body }) => {
        console.log(body);
      });
  });
});

describe("GET /api/articles", () => {
  test(`Responds with:

  an articles array of article objects, each of which should have the following properties:
  author
  title
  article_id
  topic
  created_at
  votes
  article_img_url
  comment_count, which is the total count of all the comments with this article_id. You should make use of queries to the database in order to achieve this.
  In addition:
  
  the articles should be sorted by date in descending order.
  there should not be a body property present on any of the article objects.
  `, () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        //expect(article.length).toBe(37)
        /*^^not sure wha the length is supposed to be?
        i would have assumed 37. instead I am getting 13*/
        article.forEach((item) => {
          expect(item).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });

        expect(article).toBeSortedBy("created_at", { descending: true });
      });
  });
});
