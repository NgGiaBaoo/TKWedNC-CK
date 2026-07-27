const db = require("../config/database");

function mapEmployerRow(row) {
  return {
    id: row.EmployerID,
    userId: row.UserID,
    companyName: row.CompanyName,
    email: row.Email,
    phone: row.Phone,
    address: row.Address
  };
}

function createEmployer(data) {
  const sql = `INSERT INTO Employers (UserID, CompanyName, Email, Phone, Address) VALUES (?, ?, ?, ?, ?)`;
  const params = [data.userId, data.companyName, data.email, data.phone, data.address];
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, ...data });
    });
  });
}

function getAllEmployers() {
  return new Promise((resolve, reject) => {
    db.query("SELECT EmployerID, UserID, CompanyName, Email, Phone, Address FROM Employers", (err, results) => {
      if (err) return reject(err);
      resolve(results.map(mapEmployerRow));
    });
  });
}

function getEmployerById(id) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT EmployerID, UserID, CompanyName, Email, Phone, Address FROM Employers WHERE EmployerID = ?",
      [id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0] ? mapEmployerRow(results[0]) : null);
      }
    );
  });
}

function updateEmployer(id, data) {
  const fields = [];
  const params = [];
  if (data.userId !== undefined) { fields.push('UserID = ?'); params.push(data.userId); }
  if (data.companyName !== undefined) { fields.push('CompanyName = ?'); params.push(data.companyName); }
  if (data.email !== undefined) { fields.push('Email = ?'); params.push(data.email); }
  if (data.phone !== undefined) { fields.push('Phone = ?'); params.push(data.phone); }
  if (data.address !== undefined) { fields.push('Address = ?'); params.push(data.address); }
  if (fields.length === 0) return Promise.resolve(null);
  const sql = `UPDATE Employers SET ${fields.join(', ')} WHERE EmployerID = ?`;
  params.push(id);
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0 ? { id: Number(id), ...data } : null);
    });
  });
}

function deleteEmployer(id) {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM Employers WHERE EmployerID = ?", [id], (err, result) => {
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

function findByUserId(userId) {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT EmployerID, UserID, CompanyName, Email, Phone, Address FROM Employers WHERE UserID = ? LIMIT 1",
      [userId],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0] ? mapEmployerRow(results[0]) : null);
      }
    );
  });
}

module.exports = { mapEmployerRow, createEmployer, getAllEmployers, getEmployerById, updateEmployer, deleteEmployer, findEmployerByCompany, insertEmployer, findByUserId };
