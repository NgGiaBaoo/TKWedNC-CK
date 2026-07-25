const bcrypt = require("bcrypt");
const db = require("../../localdb");

function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT UserID, Username, PasswordHash, Role FROM Users WHERE Username = ?",
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

      const match = await bcrypt.compare(password, user.PasswordHash);

      if (!match) {
        return resolve({ success: false, message: "Invalid username or password" });
      }

      resolve({
        success: true,
        user: { id: user.UserID, username: user.Username, role: user.Role }
      });
    } catch (err) {
      reject(err);
    }
  });
}

function getCurrentUser(userId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT UserID, Username, Role FROM Users WHERE UserID = ?",
      [userId],
      (err, results) => {
        if (err) return reject(err);
        if (!results[0]) return resolve(null);
        resolve({ id: results[0].UserID, username: results[0].Username, role: results[0].Role });
      }
    );
  });
}

module.exports = { login, getCurrentUser, findUserByUsername };
