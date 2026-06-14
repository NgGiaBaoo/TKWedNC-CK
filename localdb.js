const mysql = require("mysql2");
const fs = require("fs");

const connection = mysql.createConnection({
    host: "mysql-1d4615d2-st-3797.c.aivencloud.com",
    port: 16771,
    user: "avnadmin",
    password: process.env.DB_PASSWORD,
    database: "JOBRECRUITMENT",

    ssl: {
        ca: fs.readFileSync("./ca.pem")
    }
});

connection.connect((err) => {
    if (err) {
        console.error("Lỗi kết nối:", err);
    } else {
        console.log("Kết nối Aiven thành công!");
    }
});

module.exports = connection;