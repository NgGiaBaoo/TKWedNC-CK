/**
 * Middleware to require authentication.
 * Checks if req.session.userId exists. Returns 401 if not authenticated.
 */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

/**
 * Middleware to require specific role(s).
 * Checks if the authenticated user has one of the allowed roles.
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'recruiter')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.role) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}

module.exports = { requireAuth, requireRole };
