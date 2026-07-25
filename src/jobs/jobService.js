const db = require("../../localdb");

function slugifyCompany(companyName) {
  return String(companyName || "employer")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

function generatePlaceholderEmail(companyName) {
  return `${slugifyCompany(companyName)}.${Date.now()}@local.test`;
}

function findOrCreateEmployer(companyName) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT EmployerID FROM Employers WHERE CompanyName = ? LIMIT 1",
      [companyName],
      (err, results) => {
        if (err) return reject(err);
        if (results[0]) {
          return resolve(results[0].EmployerID);
        }

        db.query(
          "INSERT INTO Employers (CompanyName, Email) VALUES (?, ?)",
          [companyName, generatePlaceholderEmail(companyName)],
          (insertErr, result) => {
            if (insertErr) return reject(insertErr);
            resolve(result.insertId);
          }
        );
      }
    );
  });
}

function mapJobRow(row) {
  return {
    id: row.JobID,
    title: row.JobTitle,
    company: row.CompanyName || null,
    location: row.Location,
    salary: row.Salary,
    description: row.Description,
    employerId: row.EmployerID
  };
}

async function createJob(job) {
  const employerId = job.employerId || await findOrCreateEmployer(job.company);
  const sql = `INSERT INTO Jobs (JobTitle, Salary, Location, Description, EmployerID) VALUES (?, ?, ?, ?, ?)`;
  const params = [job.title, job.salary, job.location, job.description, employerId];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, ...job });
    });
  });
}

function getAllJobs() {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT J.JobID, J.JobTitle, J.Salary, J.Location, J.Description, J.EmployerID, E.CompanyName
       FROM Jobs J
       LEFT JOIN Employers E ON E.EmployerID = J.EmployerID`,
      (err, results) => {
        if (err) return reject(err);
        resolve(results.map(mapJobRow));
      }
    );
  });
}

function getJobById(id) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT J.JobID, J.JobTitle, J.Salary, J.Location, J.Description, J.EmployerID, E.CompanyName
       FROM Jobs J
       LEFT JOIN Employers E ON E.EmployerID = J.EmployerID
       WHERE J.JobID = ?`,
      [id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0] ? mapJobRow(results[0]) : null);
      }
    );
  });
}

async function updateJob(id, job) {
  const employerId = job.employerId || await findOrCreateEmployer(job.company);
  const sql = `UPDATE Jobs SET JobTitle = ?, Salary = ?, Location = ?, Description = ?, EmployerID = ? WHERE JobID = ?`;
  const params = [job.title, job.salary, job.location, job.description, employerId, id];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

function deleteJob(id) {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM Jobs WHERE JobID = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
}

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };
