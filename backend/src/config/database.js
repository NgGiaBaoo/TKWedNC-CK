const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

let sslConfig;
try {
    sslConfig = { ca: fs.readFileSync(path.join(__dirname, "ca.pem")) };
} catch {
    sslConfig = undefined;
}

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    ...(sslConfig && { ssl: sslConfig })
});

connection.connect((err) => {
    if (err) {
        if (!sslConfig) {
            console.error("Lỗi kết nối: Không tìm thấy file ca.pem - server yêu cầu SSL/TLS để kết nối.");
        } else {
            console.error("Lỗi kết nối:", err);
        }
    } else {
        console.log("Kết nối Database thành công!");
    }
});

module.exports = connection;
