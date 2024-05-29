const db = require("../db/connection");


exports.fetchAllTopics = () => {
    return db.query(`SELECT * from Topics`)
      .then(({ rows }) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching topics:", error); 
      });
  };
  