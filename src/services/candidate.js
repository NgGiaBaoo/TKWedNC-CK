const CandidateModel = require("../models/CandidateModel");

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

module.exports = { create, findAll, findOne, update, remove };
