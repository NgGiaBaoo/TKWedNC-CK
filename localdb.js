const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

function loadEnvFile(envPath = path.join(__dirname, ".env")) {
    if (!fs.existsSync(envPath)) {
        return;
    }

    const content = fs.readFileSync(envPath, "utf8");

    for (const line of content.split(/\r?\n/)) {
        const trimmedLine = line.trim();

        if (!trimmedLine || trimmedLine.startsWith("#")) {
            continue;
        }

        const separatorIndex = trimmedLine.indexOf("=");

        if (separatorIndex === -1) {
            continue;
        }

        const key = trimmedLine.slice(0, separatorIndex).trim();
        let value = trimmedLine.slice(separatorIndex + 1).trim();

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        if (!(key in process.env)) {
            process.env[key] = value;
        }
    }
}

loadEnvFile();

const connection = mysql.createConnection({
    host: "mysql-1d4615d2-st-3797.c.aivencloud.com",
    port: 16771,
    user: "avnadmin",
    password: (process.env.DB_PASSWORD),
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