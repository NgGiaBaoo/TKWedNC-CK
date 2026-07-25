function validateCandidate(payload) {
  if (!(payload.fullName || payload.fullname)) {
    return { valid: false, message: "fullName is required" };
  }

  if (!payload.email) {
    return { valid: false, message: "email is required" };
  }
  return { valid: true };
}

function normalize(payload) {
  return {
    fullName: payload.fullName || payload.fullname || null,
    email: payload.email || null,
    phone: payload.phone || null,
    skills: payload.skills || payload.skill || null,
    userId: payload.userId || null
  };
}

module.exports = { validateCandidate, normalize };
