const db = require("../config/database");

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

function createJob(job, employerId) {
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

function updateJob(id, data) {
  const fields = [];
  const params = [];
  if (data.title !== undefined) { fields.push('JobTitle = ?'); params.push(data.title); }
  if (data.salary !== undefined) { fields.push('Salary = ?'); params.push(data.salary); }
  if (data.location !== undefined) { fields.push('Location = ?'); params.push(data.location); }
  if (data.description !== undefined) { fields.push('Description = ?'); params.push(data.description); }
  if (data.employerId !== undefined) { fields.push('EmployerID = ?'); params.push(data.employerId); }
  if (fields.length === 0) return Promise.resolve(null);
  const sql = `UPDATE Jobs SET ${fields.join(', ')} WHERE JobID = ?`;
  params.push(id);
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

function findEmployerByCompany(companyName) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT EmployerID FROM Employers WHERE CompanyName = ? LIMIT 1",
      [companyName],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0] ? results[0].EmployerID : null);
      }
    );
  });
}

function insertEmployer(companyName, email) {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO Employers (CompanyName, Email) VALUES (?, ?)",
      [companyName, email],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
}

function getJobsByEmployerId(employerId) {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT J.JobID, J.JobTitle, J.Salary, J.Location, J.Description, J.EmployerID, E.CompanyName
       FROM Jobs J
       LEFT JOIN Employers E ON E.EmployerID = J.EmployerID
       WHERE J.EmployerID = ?`,
      [employerId],
      (err, results) => {
        if (err) return reject(err);
        resolve(results.map(mapJobRow));
      }
    );
  });
}

module.exports = {
  mapJobRow,
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getJobsByEmployerId,
  findEmployerByCompany,
  insertEmployer
};
