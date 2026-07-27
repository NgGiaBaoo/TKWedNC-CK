const EmployerModel = require("../models/Employer");

function createEmployer(data) {
  return EmployerModel.createEmployer(data);
}

function getAllEmployers() {
  return EmployerModel.getAllEmployers();
}

function getEmployerById(id) {
  return EmployerModel.getEmployerById(id);
}

function updateEmployer(id, data) {
  return EmployerModel.updateEmployer(id, data);
}

function deleteEmployer(id) {
  return EmployerModel.deleteEmployer(id);
}

module.exports = { createEmployer, getAllEmployers, getEmployerById, updateEmployer, deleteEmployer };
