function validateUser(payload) {
  const required = ["username", "password"];

  for (const key of required) {
    if (!payload[key]) {
      return { valid: false, message: `${key} is required` };
    }
  }

  return { valid: true };
}

function normalize(payload) {
  return {
    username: payload.username || null,
    password: payload.password || null
  };
}

module.exports = { validateUser, normalize };