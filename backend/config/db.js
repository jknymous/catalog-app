const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "catalog_db",
});

db.connect((err) => {
    if (err) {
        console.log("DB ERROR", err);
    } else {
        console.log("DB CONNECTED");
    }
});

module.exports = db;