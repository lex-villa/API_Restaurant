require('dotenv').config();

const Sequelize = require("sequelize");

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME; 
const dbUser = process.env.DB_USER;
const password = process.env.DB_PASSWORD;



const sequelize = new Sequelize(dbName, dbUser, password, {
    host: dbHost,
    dialect:  process.env.DB_DIALECT
});

sequelize.authenticate().then(() => {
    console.log('Database connected.');
}).catch(err => {
    console.error('Error de conexion:', err);
})

module.exports = { sequelize };