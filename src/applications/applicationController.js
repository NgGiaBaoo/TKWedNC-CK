const express = require("express");
const router = express.Router();
const service = require("./applicationService");
const { validateApplication, normalize } = require("./applicationEntity");

router.post("/", async (req, res) => {
  const payload = req.body || {};
  const valid = validateApplication(payload);
  if (!valid.valid) return res.status(400).json({ error: valid.message });

  const application = normalize(payload);
  try {
    const created = await service.createApplication(application);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const applications = await service.getAllApplications();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const application = await service.getApplicationById(req.params.id);
    if (!application) return res.status(404).json({ error: "Not found" });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const payload = req.body || {};
  const application = normalize(payload);
  try {
    const ok = await service.updateApplication(req.params.id, application);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ok = await service.deleteApplication(req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
