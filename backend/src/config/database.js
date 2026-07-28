const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ssl: {
        ca: fs.readFileSync(path.join(__dirname, "ca.pem"))
    }
});

connection.connect((err) => {
    if (err) {
        console.error("Lỗi kết nối:", err);
    } else {
        console.log("Kết nối Database thành công!");
    }
});

module.exports = connection;
