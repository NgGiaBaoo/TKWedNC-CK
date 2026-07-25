const db = require("../../localdb");

function mapApplicationRow(row) {
  return {
    id: row.ApplicationID,
    candidateId: row.CandidateID,
    jobId: row.JobID,
    applyDate: row.ApplyDate,
    status: row.Status
  };
}

function createApplication(data) {
  const sql = `INSERT INTO Applications (CandidateID, JobID, ApplyDate, Status) VALUES (?, ?, ?, ?)`;
  const params = [data.candidateId, data.jobId, data.applyDate, data.status];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, ...data });
    });
  });
}

function getAllApplications() {
  return new Promise((resolve, reject) => {
    db.query("SELECT ApplicationID, CandidateID, JobID, ApplyDate, Status FROM Applications", (err, results) => {
      if (err) return reject(err);
      resolve(results.map(mapApplicationRow));
    });
  });
}

function getApplicationById(id) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT ApplicationID, CandidateID, JobID, ApplyDate, Status FROM Applications WHERE ApplicationID = ?",
      [id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0] ? mapApplicationRow(results[0]) : null);
      }
    );
  });
}

function updateApplication(id, data) {
  const sql = `UPDATE Applications SET CandidateID = ?, JobID = ?, ApplyDate = ?, Status = ? WHERE ApplicationID = ?`;
  const params = [data.candidateId, data.jobId, data.applyDate, data.status, id];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

function deleteApplication(id) {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM Applications WHERE ApplicationID = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

module.exports = { createApplication, getAllApplications, getApplicationById, updateApplication, deleteApplication };
