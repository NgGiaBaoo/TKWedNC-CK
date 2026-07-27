const db = require("../config/database");

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
  const fields = [];
  const params = [];
  if (data.candidateId !== undefined) { fields.push('CandidateID = ?'); params.push(data.candidateId); }
  if (data.jobId !== undefined) { fields.push('JobID = ?'); params.push(data.jobId); }
  if (data.applyDate !== undefined) { fields.push('ApplyDate = ?'); params.push(data.applyDate); }
  if (data.status !== undefined) { fields.push('Status = ?'); params.push(data.status); }
  if (fields.length === 0) return Promise.resolve(null);
  const sql = `UPDATE Applications SET ${fields.join(', ')} WHERE ApplicationID = ?`;
  params.push(id);
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

function getApplicationsByJobId(jobId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT ApplicationID, CandidateID, JobID, ApplyDate, Status FROM Applications WHERE JobID = ?",
      [jobId],
      (err, results) => {
        if (err) return reject(err);
        resolve(results.map(mapApplicationRow));
      }
    );
  });
}

function getApplicationsByCandidateId(candidateId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT A.ApplicationID, A.CandidateID, A.JobID, A.ApplyDate, A.Status, J.JobTitle, E.CompanyName FROM Applications A LEFT JOIN Jobs J ON J.JobID = A.JobID LEFT JOIN Employers E ON E.EmployerID = J.EmployerID WHERE A.CandidateID = ?",
      [candidateId],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}

function getApplicationsByEmployerId(employerId) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT A.ApplicationID, A.CandidateID, A.JobID, A.ApplyDate, A.Status,
               J.JobTitle, J.Salary, J.Location,
               C.FullName AS CandidateName, C.Email AS CandidateEmail, C.Phone AS CandidatePhone, C.Skills
        FROM Applications A
        JOIN Jobs J ON J.JobID = A.JobID
        LEFT JOIN Candidates C ON C.CandidateID = A.CandidateID
        WHERE J.EmployerID = ?`,
      [employerId],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
}

module.exports = { mapApplicationRow, createApplication, getAllApplications, getApplicationById, updateApplication, deleteApplication, getApplicationsByJobId, getApplicationsByCandidateId, getApplicationsByEmployerId };
