function validateJob(payload) {
  const required = ["title", "company"];
  for (const key of required) {
    if (!payload[key]) {
      return { valid: false, message: `${key} is required` };
    }
  }
  return { valid: true };
}

function normalize(payload) {
  return {
    title: payload.title || null,
    company: payload.company || null,
    location: payload.location || null,
    salary: payload.salary || null,
    description: payload.description || null
  };
}

module.exports = { validateJob, normalize };
