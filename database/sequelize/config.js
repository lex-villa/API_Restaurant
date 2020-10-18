const Sequelize = require("sequelize");

const dbHost = "localhost";
const dbName = "delilah_resto"; // Put here your data
//const dbPort = "3306";
const dbUser = "root"; // Put here your data
const password = "mrobot" // Put here your data



const sequelize = new Sequelize(dbName, dbUser, password, {
    host: dbHost,
    dialect: "mariadb"
});

sequelize.authenticate().then(() => {
    console.log('Database connected.');
}).catch(err => {
    console.error('Error de conexion:', err);
})/*.finally(() => {
    sequelize.close();
});*/ 

module.exports = { sequelize };