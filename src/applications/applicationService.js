const db = require("../../localdb");

function createApplication(data) {
  const sql = `INSERT INTO applications (candidateId, jobId, applyDate, status, note) VALUES (?, ?, ?, ?, ?)`;
  const params = [data.candidateId, data.jobId, data.applyDate, data.status, data.note];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, ...data });
    });
  });
}

function getAllApplications() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM applications", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function getApplicationById(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM applications WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
}

function updateApplication(id, data) {
  const sql = `UPDATE applications SET candidateId = ?, jobId = ?, applyDate = ?, status = ?, note = ? WHERE id = ?`;
  const params = [data.candidateId, data.jobId, data.applyDate, data.status, data.note, id];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

function deleteApplication(id) {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM applications WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

module.exports = { createApplication, getAllApplications, getApplicationById, updateApplication, deleteApplication };
