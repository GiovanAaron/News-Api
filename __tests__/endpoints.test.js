const db = require("../db/connection");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const topics = require("../db/data/test-data/topics");

beforeEach(() => {
  return seed(data);
});
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("Gets all topics", () => {
    const expectedTopics = [
      { slug: "mitch", description: "The man, the Mitch, the legend" },
      { slug: "cats", description: "Not dogs" },
      { slug: "paper", description: "what books are made of" },
    ];
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toEqual(expectedTopics);
      });
  });
});
