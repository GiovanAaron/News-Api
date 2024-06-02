const db = require("../db/connection")

exports.fetchUsers = () => {
    return db
    .query(`Select * From Users`)
    .then(({rows}) => {
        return rows
    })


}