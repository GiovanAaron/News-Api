const db = require('../db/connection')

exports.fetchAllTopics = () => {
    return db.query(`SELECT * from Topics`).then(({rows}) => {
        return rows
    }) 
}