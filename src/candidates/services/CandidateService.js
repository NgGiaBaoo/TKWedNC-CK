const Candidate = require('../models/Candidate');

class CandidateService {
  constructor() {
    this.candidates = [];
    this.nextId = 1;
  }

  create(candidateData) {
    const candidate = new Candidate(
      this.nextId++,
      candidateData.fullname,
      candidateData.email,
      candidateData.phone,
      candidateData.address,
      candidateData.skill,
      candidateData.experience,
      candidateData.cvUrl
    );
    this.candidates.push(candidate);
    return candidate;
  }

  findAll() {
    return this.candidates;
  }

  findOne(id) {
    return this.candidates.find((candidate) => candidate.id === parseInt(id));
  }

  update(id, candidateData) {
    const candidate = this.findOne(id);
    if (!candidate) {
      throw new Error(`Candidate with id ${id} not found`);
    }
    Object.assign(candidate, candidateData, { updatedAt: new Date() });
    return candidate;
  }

  remove(id) {
    const index = this.candidates.findIndex(
      (candidate) => candidate.id === parseInt(id)
    );
    if (index === -1) {
      throw new Error(`Candidate with id ${id} not found`);
    }
    this.candidates.splice(index, 1);
    return true;
  }
}

module.exports = new CandidateService();
