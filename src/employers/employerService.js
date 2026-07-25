const db = require("../../localdb");

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
  const sql = `UPDATE Employers SET UserID = ?, CompanyName = ?, Email = ?, Phone = ?, Address = ? WHERE EmployerID = ?`;
  const params = [data.userId, data.companyName, data.email, data.phone, data.address, id];
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

module.exports = { createEmployer, getAllEmployers, getEmployerById, updateEmployer, deleteEmployer };