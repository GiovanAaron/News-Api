const db = require("../db/connection");


// exports.fetchAllTopics = async () => {
//     try {
//     const { rows } = await db.query(`SELECT * from Topics`);
//     return rows;
//   } catch (error) {
//     console.error("Error fetching topics:", error);
//   }
//   };
  
exports.fetchAllTopics = () => {
    return db.query(`SELECT * from Topics`)
      .then(({ rows }) => {
        return rows;
      })
      .catch((error) => {
        console.error("Error fetching topics:", error); 
      });
  };
  