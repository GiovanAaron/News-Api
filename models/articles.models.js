const db = require("../db/connection");

exports.fetchArticlesById = (articleID) => {
  const { article_id } = articleID;

  return db
    .query("select * from articles where article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        throw new Error(`Article with ID ${article_id} not found`);
      }
      return rows[0];
    })
    .catch((err) => {
      console.log("you have an error", err);
      throw err;
    });
};
