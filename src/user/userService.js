const bcrypt = require("bcrypt");
const db = require("../../localdb");

const SALT_ROUNDS = 10;

function normalizeRole(role) {
  const allowed = ["Admin", "Employer", "Candidate"];
  if (!role || !allowed.includes(role)) {
    return "Candidate";
  }
  return role;
}

function mapUserRow(row) {
  return {
    id: row.UserID,
    username: row.Username,
    role: row.Role
  };
}

function createUser(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
      const role = normalizeRole(user.role);
      const sql = `INSERT INTO Users (Username, PasswordHash, Role) VALUES (?, ?, ?)`;
      const params = [user.username, hashedPassword, role];

      db.query(sql, params, (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, username: user.username, role });
      });
    } catch (err) {
      reject(err);
    }
  });
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.query("SELECT UserID, Username, Role FROM Users", (err, results) => {
      if (err) return reject(err);
      resolve(results.map(mapUserRow));
    });
  });
}

function getUserRecordById(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT UserID, Username, PasswordHash, Role FROM Users WHERE UserID = ?", [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
}

function getUserById(id) {
  return new Promise((resolve, reject) => {
    getUserRecordById(id)
      .then((user) => {
        if (!user) {
          return resolve(null);
        }

        resolve({ id: user.id, username: user.username });
      })
      .catch(reject);
  });
}

function updateUser(id, user) {
  return new Promise(async (resolve, reject) => {
    try {
      const currentUser = await getUserRecordById(id);
      if (!currentUser) {
        return resolve(null);
      }

      const username = user.username || currentUser.Username;
      const password = user.password
        ? await bcrypt.hash(user.password, SALT_ROUNDS)
        : currentUser.PasswordHash;
      const role = normalizeRole(user.role || currentUser.Role);

      const sql = `UPDATE Users SET Username = ?, PasswordHash = ?, Role = ? WHERE UserID = ?`;
      const params = [username, password, role, id];

      db.query(sql, params, (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return resolve(null);
        resolve({ id: Number(id), username, role });
      });
    } catch (err) {
      reject(err);
    }
  });
}

function deleteUser(id) {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM Users WHERE UserID = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };