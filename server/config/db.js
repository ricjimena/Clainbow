const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'clainbow' 
});

connection.connect((error)=>{
  if (error) {
    throw error;
  }
  else {
    console.log("Conexion correcta");
  }
})

module.exports = connection;