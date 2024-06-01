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
  // console.log(comment)
  // console.log(comment.username)
  // console.log(comment.body)
  if (comment.username && comment.body) {

    return Promise.resolve(comment);
  } else {
    
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
};

