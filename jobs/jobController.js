const express = require("express");
const router = express.Router();
const service = require("./jobService");
const { validateJob, normalize } = require("./jobEntity");

router.post("/", async (req, res) => {
  const payload = req.body || {};
  const valid = validateJob(payload);
  if (!valid.valid) return res.status(400).json({ error: valid.message });

  const job = normalize(payload);
  try {
    const created = await service.createJob(job);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const jobs = await service.getAllJobs();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const job = await service.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const payload = req.body || {};
  const job = normalize(payload);
  try {
    const ok = await service.updateJob(req.params.id, job);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ok = await service.deleteJob(req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
