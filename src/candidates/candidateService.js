const db = require("../../localdb");

function mapCandidateRow(row) {
  return {
    id: row.CandidateID,
    userId: row.UserID,
    fullName: row.FullName,
    email: row.Email,
    phone: row.Phone,
    skills: row.Skills
  };
}

function create(data) {
  const sql = `INSERT INTO Candidates (UserID, FullName, Email, Phone, Skills) VALUES (?, ?, ?, ?, ?)`;
  const params = [data.userId, data.fullName, data.email, data.phone, data.skills];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, ...data });
    });
  });
}

function findAll() {
  return new Promise((resolve, reject) => {
    db.query("SELECT CandidateID, UserID, FullName, Email, Phone, Skills FROM Candidates", (err, results) => {
      if (err) return reject(err);
      resolve(results.map(mapCandidateRow));
    });
  });
}

function findOne(id) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT CandidateID, UserID, FullName, Email, Phone, Skills FROM Candidates WHERE CandidateID = ?",
      [id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0] ? mapCandidateRow(results[0]) : null);
      }
    );
  });
}

function update(id, data) {
  const sql = `UPDATE Candidates SET UserID = ?, FullName = ?, Email = ?, Phone = ?, Skills = ? WHERE CandidateID = ?`;
  const params = [data.userId, data.fullName, data.email, data.phone, data.skills, id];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0 ? { id: Number(id), ...data } : null);
    });
  });
}

function remove(id) {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM Candidates WHERE CandidateID = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

module.exports = { create, findAll, findOne, update, remove };
