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
