function validateJob(payload) {
  if (!payload.title) {
    return { valid: false, message: "title is required" };
  }

  if (!payload.employerId && !payload.company) {
    return { valid: false, message: "employerId or company is required" };
  }

  // Validate salary is a number if provided
  if (payload.salary && isNaN(Number(payload.salary))) {
    return { valid: false, message: "salary must be a number" };
  }

  return { valid: true };
}

function normalize(payload) {
  return {
    title: payload.title || null,
    company: payload.company || null,
    employerId: payload.employerId || null,
    location: payload.location || null,
    salary: payload.salary || null,
    description: payload.description || null
  };
}

module.exports = { validateJob, normalize };
