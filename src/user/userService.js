const bcrypt = require("bcrypt");
const db = require("../../localdb");

const SALT_ROUNDS = 10;

function createUser(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);
      const sql = `INSERT INTO users (username, password_hash) VALUES (?, ?)`;
      const params = [user.username, hashedPassword];

      db.query(sql, params, (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, username: user.username });
      });
    } catch (err) {
      reject(err);
    }
  });
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.query("SELECT id, username FROM users", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function getUserRecordById(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT id, username, password_hash FROM users WHERE id = ?", [id], (err, results) => {
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

      const username = user.username || currentUser.username;
      const password = user.password
        ? await bcrypt.hash(user.password, SALT_ROUNDS)
        : currentUser.password_hash;

      const sql = `UPDATE users SET username = ?, password_hash = ? WHERE id = ?`;
      const params = [username, password, id];

      db.query(sql, params, (err, result) => {
        if (err) return reject(err);
        if (result.affectedRows === 0) return resolve(null);
        resolve({ id: Number(id), username });
      });
    } catch (err) {
      reject(err);
    }
  });
}

function deleteUser(id) {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };