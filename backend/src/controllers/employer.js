const express = require("express");
const router = express.Router();
const service = require("../services/employer");
const { validateEmployer, normalize } = require("../validators/employer");

router.post("/", async (req, res) => {
  const payload = req.body || {};
  const valid = validateEmployer(payload);
  if (!valid.valid) {
    return res.status(400).json({ error: valid.message });
  }

  // Only Admin can create employer profiles for other users
  if (req.session.role !== 'Admin' && Number(payload.userId) !== req.session.userId) {
    return res.status(403).json({ error: "Insufficient permissions" });
  }

  try {
    const created = await service.createEmployer(normalize(payload));
    res.status(201).json(created);
  } catch (err) {
    console.error("Error in employer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/by-user/:userId", async (req, res) => {
  try {
    // Employers can only access their own profile; Admin can access any
    if (req.session.role !== 'Admin' && Number(req.params.userId) !== req.session.userId) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    const employer = await service.findByUserId(req.params.userId);
    if (!employer) return res.status(404).json({ error: "Employer not found for this user" });
    res.json(employer);
  } catch (err) {
    console.error("Error in employer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const employers = await service.getAllEmployers();
    res.json(employers);
  } catch (err) {
    console.error("Error in employer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employer = await service.getEmployerById(req.params.id);
    if (!employer) return res.status(404).json({ error: "Not found" });
    res.json(employer);
  } catch (err) {
    console.error("Error in employer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    // Ownership check: only Admin or the employer who owns this profile can update
    const existing = await service.getEmployerById(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (req.session.role !== 'Admin' && existing.userId !== req.session.userId) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    const updates = Object.fromEntries(
      Object.entries(normalize(req.body || {})).filter(([, v]) => v != null)
    );
    const updated = await service.updateEmployer(req.params.id, updates);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Error in employer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await service.deleteEmployer(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Error in employer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
