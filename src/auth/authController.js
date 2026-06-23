const express = require("express");
const router = express.Router();
const service = require("./authService");
const { validateLogin, normalize } = require("./authEntity");
const { requireAuth } = require("./authMiddleware");
const userService = require("../user/userService");
const { validateUser, normalize: normalizeUser } = require("../user/userEntity");

// POST /auth/register (public - no auth required)
router.post("/register", async (req, res) => {
  const payload = { ...req.query, ...req.body };
  const valid = validateUser(payload);
  if (!valid.valid) {
    return res.status(400).json({ error: valid.message });
  }
  const user = normalizeUser(payload);
  try {
    const created = await userService.createUser(user);
    // Auto-login after registration
    req.session.userId = created.id;
    req.session.username = created.username;
    res.status(201).json({
      message: "User registered successfully",
      data: created
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const payload = { ...req.query, ...req.body };
  const valid = validateLogin(payload);

  if (!valid.valid) {
    return res.status(400).json({ error: valid.message });
  }

  const credentials = normalize(payload);

  try {
    const result = await service.login(credentials.username, credentials.password);

    if (!result.success) {
      return res.status(401).json({ error: result.message });
    }

    // Store user info in session
    req.session.userId = result.user.id;
    req.session.username = result.user.username;

    res.json({
      message: "Login successful",
      data: { id: result.user.id, username: result.user.username }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /auth/logout
router.post("/logout", requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout successful" });
  });
});

// GET /auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await service.getCurrentUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "Current user", data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
