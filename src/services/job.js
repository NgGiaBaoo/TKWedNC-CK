const JobModel = require("../models/Job");
const EmployerModel = require("../models/Employer");

function slugifyCompany(companyName) {
  return String(companyName || "employer")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

function generatePlaceholderEmail(companyName) {
  return `${slugifyCompany(companyName)}.${Date.now()}@local.test`;
}

async function findOrCreateEmployer(companyName) {
  const employerId = await EmployerModel.findEmployerByCompany(companyName);
  if (employerId) return employerId;
  const email = generatePlaceholderEmail(companyName);
  return EmployerModel.insertEmployer(companyName, email);
}

async function createJob(job) {
  const employerId = job.employerId || await findOrCreateEmployer(job.company);
  return JobModel.createJob(job, employerId);
}

function getAllJobs() {
  return JobModel.getAllJobs();
}

function getJobById(id) {
  return JobModel.getJobById(id);
}

async function updateJob(id, job) {
  const employerId = job.employerId || await findOrCreateEmployer(job.company);
  return JobModel.updateJob(id, { ...job, employerId });
}

function deleteJob(id) {
  return JobModel.deleteJob(id);
}

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };
