function validateLogin(payload) {
  const required = ["username", "password"];

  for (const key of required) {
    if (!payload[key]) {
      return { valid: false, message: `${key} is required` };
    }
  }

  if (payload.password && payload.password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (payload.password && payload.password.length > 128) {
    return { valid: false, message: "Password must not exceed 128 characters" };
  }

  return { valid: true };
}

function normalize(payload) {
  return {
    username: payload.username || null,
    password: payload.password || null,
    role: payload.role || null
  };
}

module.exports = { validateLogin, normalize };
