const bcrypt = require("bcrypt");
const db = require("../../localdb");

function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, username, password_hash FROM users WHERE username = ?",
      [username],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      }
    );
  });
}

function login(username, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await findUserByUsername(username);

      if (!user) {
        return resolve({ success: false, message: "Invalid username or password" });
      }

      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return resolve({ success: false, message: "Invalid username or password" });
      }

      resolve({
        success: true,
        user: { id: user.id, username: user.username }
      });
    } catch (err) {
      reject(err);
    }
  });
}

function getCurrentUser(userId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, username FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) return reject(err);
        if (!results[0]) return resolve(null);
        resolve({ id: results[0].id, username: results[0].username });
      }
    );
  });
}

module.exports = { login, getCurrentUser, findUserByUsername };
