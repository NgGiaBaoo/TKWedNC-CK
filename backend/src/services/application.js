const ApplicationModel = require("../models/Application");

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

function getApplicationsByJobId(jobId) {
  return ApplicationModel.getApplicationsByJobId(jobId);
}

function getApplicationsByCandidateId(candidateId) {
  return ApplicationModel.getApplicationsByCandidateId(candidateId);
}

function getApplicationsByEmployerId(employerId) {
  return ApplicationModel.getApplicationsByEmployerId(employerId);
}

module.exports = { createApplication, getAllApplications, getApplicationById, updateApplication, deleteApplication, getApplicationsByJobId, getApplicationsByCandidateId, getApplicationsByEmployerId };
