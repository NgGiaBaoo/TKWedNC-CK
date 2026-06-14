function validateCandidate(payload) {
  const required = ["fullname", "email", "phone", "address", "skill", "experience", "cvUrl"];
  for (const key of required) {
    if (!payload[key]) {
      return { valid: false, message: `${key} is required` };
    }
  }
  return { valid: true };
}

function normalize(payload) {
  return {
    fullname: payload.fullname || null,
    email: payload.email || null,
    phone: payload.phone || null,
    address: payload.address || null,
    skill: payload.skill || null,
    experience: payload.experience || null,
    cvUrl: payload.cvUrl || null
  };
}

module.exports = { validateCandidate, normalize };
