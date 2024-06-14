const db = require("../db/connection");

exports.fetchAllComments = (articleID) => {
  return db
    .query(`Select * from articles where article_id = $1`, [articleID])
    .then(({ rows }) => {
      if (rows.length) {
        return db
          .query(
            `Select * From Comments where article_id = $1 ORDER BY created_at DESC;`,
            [articleID]
          )
          .then(({ rows }) => {
            return rows;
          });
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

exports.submitComment = (comment) => {
  return db
    .query(
      `INSERT INTO comments
  (article_id, author, body)
  VALUES ($1, $2, $3)`,
      [comment.articleID, comment.username, comment.body]
    )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      throw err;
    });
};

exports.removeComment = (commentID) => {
  if (isNaN(commentID))
    return Promise.reject({ status: 400, msg: "Bad Request" });

  return db
    .query(
      `DELETE FROM Comments WHERE comment_id = $1
            Returning *`,
      [commentID]
    )
    .then(({ rows }) => {
      if (!rows.length)
        return Promise.reject({ status: 404, msg: "Not Found" });
      return rows;
    });
};

exports.countComments = (articleID) => {
  const { article_id } = articleID;

  return db
    .query(
      `SELECT COUNT(*)
  FROM comments
  where article_id = $1`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
