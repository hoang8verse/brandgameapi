const Pool = require('pg').Pool
const { Sequelize } = require('sequelize');

const connectionString = process.env.DATABASE_URL
const pool = new Pool({
    connectionString
//   user: process.env.DATABASE_USER,
//   host: process.env.DATABASE_HOST,
//   database:process.env.DATABASE_NAME,
//   password: process.env.DATABASE_PASSWORD,
//   port: process.env.DATABASE_PORT,
})

var config = {
    "define": {
        "createdAt": "created_at",
        "updatedAt": "updated_at"
      } /*don't forget to add host, port, dialect, etc.*/
      , 
      schema: 'main',
      searchPath: 'main',
    }
const sequelize = new Sequelize(connectionString, config);


module.exports = {
    pool,
    sequelize
  }