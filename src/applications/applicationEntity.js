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
  const status = payload.status || "Pending";
  return {
    candidateId: payload.candidateId || null,
    jobId: payload.jobId || null,
    applyDate: payload.applyDate || new Date(),
    status: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
  };
}

module.exports = { validateApplication, normalize };
