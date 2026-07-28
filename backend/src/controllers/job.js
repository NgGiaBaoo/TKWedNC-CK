const express = require("express");
const router = express.Router();
const service = require("../services/job");
const { validateJob, normalize } = require("../validators/job");

router.post("/", async (req, res) => {
  const payload = req.body || {};
  const valid = validateJob(payload);
  if (!valid.valid) return res.status(400).json({ error: valid.message });

  const job = normalize(payload);
  try {
    const created = await service.createJob(job);
    res.status(201).json(created);
  } catch (err) {
    console.error("Error in job:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    if (req.query.employerId) {
      const jobs = await service.getJobsByEmployerId(req.query.employerId);
      return res.json(jobs);
    }
    const jobs = await service.getAllJobs();
    res.json(jobs);
  } catch (err) {
    console.error("Error in job:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await service.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Not found" });
    res.json(job);
  } catch (err) {
    console.error("Error in job:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const updates = Object.fromEntries(
    Object.entries(normalize(req.body || {})).filter(([, v]) => v != null)
  );
  try {
    const ok = await service.updateJob(req.params.id, updates);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Error in job:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ok = await service.deleteJob(req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Error in job:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
