const express = require("express");
const router = express.Router();
const service = require("../services/candidateService");
const { validateCandidate, normalize } = require("../validators/candidateValidator");

router.post("/", async (req, res) => {
  const payload = req.body || {};
  const valid = validateCandidate(payload);
  if (!valid.valid) {
    return res.status(400).json({ message: valid.message });
  }

  const candidate = normalize(payload);
  try {
    const created = await service.create(candidate);
    res.status(201).json({ message: "Candidate created successfully", data: created });
  } catch (err) {
    res.status(500).json({ message: "Error creating candidate", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const candidates = await service.findAll();
    res.status(200).json({ message: "All candidates", data: candidates });
  } catch (err) {
    res.status(500).json({ message: "Error fetching candidates", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const candidate = await service.findOne(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: `Candidate with id ${req.params.id} not found` });
    }
    res.status(200).json({ message: "Candidate found", data: candidate });
  } catch (err) {
    res.status(500).json({ message: "Error fetching candidate", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updates = Object.fromEntries(
      Object.entries(normalize(req.body || {})).filter(([, v]) => v != null)
    );
    const updated = await service.update(req.params.id, updates);
    res.status(200).json({ message: "Candidate updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating candidate", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await service.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: `Candidate with id ${req.params.id} not found` });
    }
    res.status(200).json({ message: `Candidate with id ${req.params.id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ message: "Error deleting candidate", error: err.message });
  }
});

module.exports = router;
