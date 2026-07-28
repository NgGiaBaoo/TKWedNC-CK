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
      console.error("Error in application:", err);
      res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/", async (req, res) => {
  try {
    const role = req.session.role;
    const userId = req.session.userId;

    // Candidate: only their own applications
    if (role === 'Candidate') {
      const CandidateModel = require('../models/Candidate');
      const candidate = await CandidateModel.findByUserId(userId);
      if (!candidate) return res.status(404).json({ error: "No candidate profile found" });
      const apps = await service.getApplicationsByCandidateId(candidate.id);
      return res.json(apps);
    }

    // Employer: only applications for their jobs
    if (role === 'Employer') {
      const EmployerModel = require('../models/Employer');
      const employer = await EmployerModel.findByUserId(userId);
      if (!employer) return res.status(404).json({ error: "No employer profile found" });
      const apps = await service.getApplicationsByEmployerId(employer.id);
      return res.json(apps);
    }

    // Admin: see everything (including query params for filtering)
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
    console.error("Error in application:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const application = await service.getApplicationById(req.params.id);
    if (!application) return res.status(404).json({ error: "Not found" });
    res.json(application);
  } catch (err) {
    console.error("Error in application:", err);
    res.status(500).json({ error: "Internal server error" });
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
    console.error("Error in application:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const ok = await service.deleteApplication(req.params.id);
    if (!ok) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.error("Error in application:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
