const express = require("express");
const router = express.Router();
const service = require("../services/user");
const { validateUser, normalize } = require("../validators/user");

router.post("/", async (req, res) => {
  const payload = req.body || {};
  const valid = validateUser(payload);

  if (!valid.valid) {
    return res.status(400).json({ error: valid.message });
  }

  const user = normalize(payload);

  try {
    const created = await service.createUser(user);
    res.status(201).json({ message: "User created successfully", data: created });
  } catch (err) {
    console.error("Error in user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await service.getAllUsers();
    res.status(200).json({ message: "All users", data: users });
  } catch (err) {
    console.error("Error in user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await service.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: `User with id ${req.params.id} not found` });
    }
    res.status(200).json({ message: "User found", data: user });
  } catch (err) {
    console.error("Error in user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const payload = req.body || {};

  // Apply validation and normalization
  const valid = validateUser(payload);
  if (!valid.valid) {
    return res.status(400).json({ error: valid.message });
  }
  const user = normalize(payload);

    try {
      const updated = await service.updateUser(req.params.id, user);
      if (!updated) {
        return res.status(404).json({ error: `User with id ${req.params.id} not found` });
      }
      res.status(200).json({ message: "User updated successfully", data: updated });
    } catch (err) {
      console.error("Error in user:", err);
      res.status(500).json({ error: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await service.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: `User with id ${req.params.id} not found` });
    }
    res.status(200).json({ message: `User with id ${req.params.id} deleted successfully` });
  } catch (err) {
    console.error("Error in user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
