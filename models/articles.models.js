const db = require("../db/connection");

exports.fetchArticlesById = (articleID) => {
  const { article_id } = articleID;

  return db
    .query("select * from articles where article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    })
    .catch((err) => {
      throw err;
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT 
      Articles.author, 
      Articles.title, 
      Articles.article_id, 
      Articles.topic, 
      Articles.created_at, 
      Articles.votes, 
      Articles.article_img_url,
      COUNT(Comments.comment_id) AS comment_count
  FROM 
      Articles
  LEFT JOIN 
      Comments ON Articles.article_id = Comments.article_id
  GROUP BY 
      Articles.article_id 
  ORDER BY 
      Articles.created_at DESC;
  
`
    )
    .then(({ rows }) => rows);
};

exports.updateVotes = (articleID, patchVotes, sendKey) => {
  if (sendKey !== '["inc_votes"]')
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Invalid Update Format",
    });

  if (isNaN(patchVotes))
    return Promise.reject({
      status: 400,
      msg: "Bad Request: Invalid Vote Value",
    });

  return db
    .query(`Select * from articles where article_id = $1`, [articleID])
    .then(({ rows }) => {
      if (rows.length) {
        return db
          .query(
            `UPDATE articles
          SET votes = votes + $1
          WHERE article_id = $2
          RETURNING *`,
            [patchVotes, articleID]
          )
          .then(({ rows }) => {
            return rows;
          });
      } else {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
    });
};

exports.getFilteredArticles = (query) => {
  
  const filterField = Object.keys(query)[0];
  const filterCriteria = query[filterField];

  if(!filterCriteria){
    return db.query(`SELECT * FROM Articles`)
    .then(({rows}) => {
      return rows
    })
  }

  return db
    .query(
      `SELECT * FROM Articles Where ${filterField} = $1
          `,
      [filterCriteria]
    )
    .then(({ rows }) => {
      return rows;
    });
};

