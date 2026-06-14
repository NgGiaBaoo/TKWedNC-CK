const express = require('express');
const CandidateController = require('../controllers/CandidateController');

const router = express.Router();

// Create a new candidate
router.post('/', CandidateController.create);

// Get all candidates
router.get('/', CandidateController.findAll);

// Get a single candidate by ID
router.get('/:id', CandidateController.findOne);

// Update a candidate
router.put('/:id', CandidateController.update);

// Delete a candidate
router.delete('/:id', CandidateController.remove);

module.exports = router;
