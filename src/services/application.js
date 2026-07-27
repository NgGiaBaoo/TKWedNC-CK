const ApplicationModel = require("../models/ApplicationModel");

function createApplication(data) {
  return ApplicationModel.createApplication(data);
}

function getAllApplications() {
  return ApplicationModel.getAllApplications();
}

function getApplicationById(id) {
  return ApplicationModel.getApplicationById(id);
}

function updateApplication(id, data) {
  return ApplicationModel.updateApplication(id, data);
}

function deleteApplication(id) {
  return ApplicationModel.deleteApplication(id);
}

module.exports = { createApplication, getAllApplications, getApplicationById, updateApplication, deleteApplication };
