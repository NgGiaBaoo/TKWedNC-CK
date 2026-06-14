const db = require("../localdb");

function createJob(job) {
  const sql = `INSERT INTO jobs (title, company, location, salary, description) VALUES (?, ?, ?, ?, ?)`;
  const params = [job.title, job.company, job.location, job.salary, job.description];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, ...job });
    });
  });
}

function getAllJobs() {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM jobs", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

function getJobById(id) {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM jobs WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0] || null);
    });
  });
}

function updateJob(id, job) {
  const sql = `UPDATE jobs SET title = ?, company = ?, location = ?, salary = ?, description = ? WHERE id = ?`;
  const params = [job.title, job.company, job.location, job.salary, job.description, id];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

function deleteJob(id) {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM jobs WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };
