const db = require('../config/database');

function mapUserRow(row) {
  return { id: row.UserID, username: row.Username, role: row.Role };
}

function createUser(user) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Users (Username, PasswordHash, Role) VALUES (?, ?, ?)`;
    const params = [user.username, user.passwordHash, user.role];
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, username: user.username, role: user.role });
    });
  });
}

function getAllUsers() {
  return new Promise((resolve, reject) => {
    db.query('SELECT UserID, Username, Role FROM Users', (err, results) => {
      if (err) return reject(err);
      resolve(results.map(mapUserRow));
    });
  });
}

function getUserRecordById(id) {
  return new Promise((resolve, reject) => {
    db.query('SELECT UserID, Username, PasswordHash, Role FROM Users WHERE UserID = ?', [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
}

function updateUser(id, fields) {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE Users SET Username = ?, PasswordHash = ?, Role = ? WHERE UserID = ?';
    const params = [fields.username, fields.passwordHash, fields.role, id];
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      if (result.affectedRows === 0) return resolve(null);
      resolve({ id: Number(id), username: fields.username, role: fields.role });
    });
  });
}

function deleteUser(id) {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM Users WHERE UserID = ?', [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.query('SELECT UserID, Username, PasswordHash, Role FROM Users WHERE Username = ?', [username], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
}

module.exports = { mapUserRow, createUser, getAllUsers, getUserRecordById, updateUser, deleteUser, findUserByUsername };
