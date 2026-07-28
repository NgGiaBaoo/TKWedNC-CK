const CandidateModel = require("../models/Candidate");

function create(data) {
  return CandidateModel.create(data);
}

function findAll() {
  return CandidateModel.findAll();
}

function findOne(id) {
  return CandidateModel.findOne(id);
}

function update(id, data) {
  return CandidateModel.update(id, data);
}

function remove(id) {
  return CandidateModel.remove(id);
}

function findByUserId(userId) {
  return CandidateModel.findByUserId(userId);
}

module.exports = { create, findAll, findOne, update, remove, findByUserId };
