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

  try {
    const created = await service.createEmployer(normalize(payload));
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/by-user/:userId", async (req, res) => {
  try {
    const employer = await service.findByUserId(req.params.userId);
    if (!employer) return res.status(404).json({ error: "Employer not found for this user" });
    res.json(employer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const employers = await service.getAllEmployers();
    res.json(employers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employer = await service.getEmployerById(req.params.id);
    if (!employer) return res.status(404).json({ error: "Not found" });
    res.json(employer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updates = Object.fromEntries(
      Object.entries(normalize(req.body || {})).filter(([, v]) => v != null)
    );
    const updated = await service.updateEmployer(req.params.id, updates);
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await service.deleteEmployer(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
