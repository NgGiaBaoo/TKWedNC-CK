const express = require("express");
const router = express.Router();
const service = require("../services/application");
const { validateApplication, normalize } = require("../validators/application");

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
    if (req.query.candidateId) {
      const apps = await service.getApplicationsByCandidateId(req.query.candidateId);
      return res.json(apps);
    }
    if (req.query.jobId) {
      const apps = await service.getApplicationsByJobId(req.query.jobId);
      return res.json(apps);
    }
    if (req.query.employerId) {
      const apps = await service.getApplicationsByEmployerId(req.query.employerId);
      return res.json(apps);
    }
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
  const updates = Object.fromEntries(
    Object.entries(normalize(req.body || {})).filter(([, v]) => v != null)
  );
  try {
    const ok = await service.updateApplication(req.params.id, updates);
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
