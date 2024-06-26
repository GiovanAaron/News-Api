const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const { allEndPoints } = require("../controller/api.controller");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

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

  describe("error handling for bad article requests", () => {
    test(`should return error if entry doesn't exist`, () => {
      return request(app)
        .get("/api/articles/50")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
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

        expect(article.length).toBe(13);

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

describe(" GET /api/articles/:article_id/comments (valid ID, Comments Found)", () => {
  test(`Responds with: an array of comments for the given article_id of which each comment
  Comments should be served with the most recent comments first.`, () => {
    return request(app)
      .get(`/api/articles/3/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments.length).toBe(2);

        comments.forEach((item) => {
          expect(item).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  describe(" GET /api/articles/:article_id/comments (Valid ID, No Comment Found", () => {
    test(`Responds with: an array of comments for the given article_id of which each comment
  Comments should be served with the most recent comments first.`, () => {
      return request(app)
        .get(`/api/articles/2/comments`)
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;

          expect(comments.length).toBe(0);

          comments.forEach((item) => {
            expect(item).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            });
            expect(item).toBe("ab");
          });
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
  describe("Responds with empty array if articleID doesn't exist ", () => {
    test(`Responds with: an array of comments for the given article_id of which each comment
  Comments should be served with the most recent comments first.`, () => {
      return request(app)
        .get(`/api/articles/15/comments`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});

describe("CORE: POST /api/articles/:article_id/comments", () => {
  test(`Request body accepts:

  an object with the following properties:
  username
  body
  Responds with:
  
  the posted comment.`, () => {
    const message = {
      articleID: 2,
      username: "icellusedkars",
      body: "My backend hurts",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(message)
      .expect(200)
      .then(({ body }) => {
        expect(body).toMatchObject({
          username: expect.any(String),
          body: expect.any(String),
        });
        expect(body.body).toEqual(message.body);
      });
  });

  describe("POST /api/articles/:article_id/comments (message without a username)", () => {
    test(`should return bad request`, () => {
      const message = {
        articleID: 3,

        body: "My backend hurts",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(message)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments (username without a message)", () => {
    test(`should return bad request`, () => {
      const message = {
        username: "Callback_Prisoner",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(message)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments (correct keys but invalid data type)", () => {
    test(`should return bad request`, () => {
      const message = {
        articleID: "abc",
        username: "icellusedkars",
        body: "this comment should havea an invalid character for article ID, ",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(message)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
  describe("POST /api/articles/:article_id/comments (foreign key violaiton '50' doesn't exist in the ref chart)", () => {
    test(`should return bad request`, () => {
      const message = {
        articleID: 50,
        username: "icellusedkars",
        body: "this comment should havea an invalid character for article ID, ",
      };
      return request(app)
        .post("/api/articles/3/comments")
        .send(message)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});

describe("PATCH /api/articles/:article_id (Upvote)", () => {
  test("Update votes on article", () => {
    const vote = { inc_votes: 2 };
    return request(app)
      .patch("/api/articles/1")
      .send(vote)
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(102);
      });
  });
  describe("PATCH /api/articles/:article_id (Upvote from 0)", () => {
    test("Update votes on article where votes haven't already been cast", () => {
      const vote = { inc_votes: 14 };
      return request(app)
        .patch("/api/articles/2")
        .send(vote)
        .expect(200)
        .then(({ body }) => {
          expect(body.votes).toBe(14);
        });
    });
  });
  describe("PATCH /api/articles/:article_id (Downvote)", () => {
    test("subtract votes from articles", () => {
      const vote = { inc_votes: -14 };
      return request(app)
        .patch("/api/articles/1")
        .send(vote)
        .expect(200)
        .then(({ body }) => {
          expect(body.votes).toBe(86);
        });
    });
  });
  describe("PATCH /api/articles/:article_id (Downvote into negative value)", () => {
    test("subtract votes from article with already 0 votes", () => {
      const vote = { inc_votes: -27 };
      return request(app)
        .patch("/api/articles/2")
        .send(vote)
        .expect(200)
        .then(({ body }) => {
          expect(body.votes).toBe(-27);
        });
    });
  });
  describe("PATCH /api/articles/:article_id (nonexistent ID)", () => {
    test("should return 404 error", () => {
      const vote = { inc_votes: -27 };
      return request(app)
        .patch("/api/articles/22")
        .send(vote)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
  describe("PATCH /api/articles/:article_id (invalid vote value)", () => {
    test("should return 404 error", () => {
      const vote = { inc_votes: "ab" };
      return request(app)
        .patch("/api/articles/2")
        .send(vote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: Invalid Vote Value");
        });
    });
  });
  describe("PATCH /api/articles/:article_id (invalid send format)", () => {
    test("should return 404 error", () => {
      const vote = { inc_voasdates: "ab" };
      return request(app)
        .patch("/api/articles/2")
        .send(vote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request: Invalid Update Format");
        });
    });
  });
});

describe("CORE: DELETE comments", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    test("should respond with status 204 and no content. ", () => {
      return request(app)
        .delete("/api/comments/2")
        .expect(204)
        .then((response) => {
          expect(response.statusMessage).toBe(undefined);
        });
    });
  });
  describe("non existing requested resource - DELETE /api/comments/:comments", () => {
    test("should return status 404 not found", () => {
      return request(app)
        .delete("/api/comments/22")
        .expect(404)
        .then(({ text }) => {
          const message = JSON.parse(text);
          expect(message.msg).toBe("Not Found");
        });
    });
  });
  describe("Invalid request DELETE /api/comments/:comment_id", () => {
    test("should return 400 bad request ", () => {
      return request(app)
        .delete("/api/comments/sdsa")
        .expect(400)
        .then(({ text }) => {
          const message = JSON.parse(text);
          expect(message.msg).toBe("Bad Request");
        });
    });
  });
});

describe("CORE: GET /api/users", () => {
  describe("Get /api/users", () => {
    test("should get all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;

          expect(users).toHaveLength(4);
          users.forEach((topic) => {
            expect(topic).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});

describe("Query API Articles", () => {
  describe("CORE: GET /api/articles (topic query)", () => {
    test("should provide article by topic", () => {
      return request(app)
        .get("/api/articles/?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toMatchObject({
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
    });
  });
  describe("CORE: GET /api/articles (topic query)", () => {
    test("should provide article by topic", () => {
      return request(app)
        .get("/api/articles/?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(1);
          articles.forEach((article) => {
            expect(article).toMatchObject({
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
    });
  });

  describe("Return all if query is omitted", () => {
    test("should provide article by topic", () => {
      return request(app)
        .get("/api/articles/?topic=")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(13);
          articles.forEach((article) => {
            expect(article).toMatchObject({
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
    });
  });
  describe("Return nothing is there are no items with the criteria", () => {
    test("should provide zero articles", () => {
      return request(app)
        .get("/api/articles/?topic=cars")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toHaveLength(0);
        });
    });
  });
});

describe("CORE: GET /api/articles/:article_id (comment_count)", () => {
  describe("Get comment", () => {
    test("should ", () => {
      return request(app)
        .get("/api/articles/3/comment_count")
        .expect(200)
        .then(({ body }) => {
          expect(body.count).toBe(2);
        });
    });
  });
  // describe('Get comment', () => {
  //   test('should ', () => {
  //     return request(app)
  //     .get("/api/articles/35/comment_count")
  //     .expect(200)
  //     .then(({body}) => {
  //       expect(body.count).toBe(2)
  //     })

  //   });
  // });
});
