const candidates = [];
let nextId = 1;

function create(data) {
  const candidate = {
    id: nextId++,
    fullname: data.fullname || null,
    email: data.email || null,
    phone: data.phone || null,
    address: data.address || null,
    skill: data.skill || null,
    experience: data.experience || null,
    cvUrl: data.cvUrl || null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  candidates.push(candidate);
  return candidate;
}

function findAll() {
  return candidates;
}

function findOne(id) {
  return candidates.find((c) => c.id === parseInt(id)) || null;
}

function update(id, data) {
  const candidate = findOne(id);
  if (!candidate) {
    throw new Error(`Candidate with id ${id} not found`);
  }
  Object.assign(candidate, data, { updatedAt: new Date() });
  return candidate;
}

function remove(id) {
  const index = candidates.findIndex((c) => c.id === parseInt(id));
  if (index === -1) {
    throw new Error(`Candidate with id ${id} not found`);
  }
  candidates.splice(index, 1);
  return true;
}

module.exports = { create, findAll, findOne, update, remove };
