function validateApplication(payload) {
  const required = ["candidateId", "jobId"];
  for (const key of required) {
    if (!payload[key]) {
      return { valid: false, message: `${key} is required` };
    }
  }
  return { valid: true };
}

function normalize(payload) {
  return {
    candidateId: payload.candidateId || null,
    jobId: payload.jobId || null,
    applyDate: payload.applyDate || new Date(),
    status: payload.status || 'pending',
    note: payload.note || null
  };
}

module.exports = { validateApplication, normalize };
