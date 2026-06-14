const candidateService = require('../services/CandidateService');

class CandidateController {
  // Create a new candidate
  static create(req, res) {
    try {
      const { fullname, email, phone, address, skill, experience, cvUrl } =
        req.body;

      if (!fullname || !email || !phone || !address || !skill || !experience || !cvUrl) {
        return res.status(400).json({
          message: 'All fields are required',
        });
      }

      const candidate = candidateService.create(req.body);
      res.status(201).json({
        message: 'Candidate created successfully',
        data: candidate,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating candidate',
        error: error.message,
      });
    }
  }

  // Get all candidates
  static findAll(req, res) {
    try {
      const candidates = candidateService.findAll();
      res.status(200).json({
        message: 'All candidates',
        data: candidates,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching candidates',
        error: error.message,
      });
    }
  }

  // Get a single candidate by ID
  static findOne(req, res) {
    try {
      const { id } = req.params;
      const candidate = candidateService.findOne(id);

      if (!candidate) {
        return res.status(404).json({
          message: `Candidate with id ${id} not found`,
        });
      }

      res.status(200).json({
        message: 'Candidate found',
        data: candidate,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching candidate',
        error: error.message,
      });
    }
  }

  // Update a candidate
  static update(req, res) {
    try {
      const { id } = req.params;
      const candidate = candidateService.update(id, req.body);

      res.status(200).json({
        message: 'Candidate updated successfully',
        data: candidate,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating candidate',
        error: error.message,
      });
    }
  }

  // Delete a candidate
  static remove(req, res) {
    try {
      const { id } = req.params;
      candidateService.remove(id);

      res.status(200).json({
        message: `Candidate with id ${id} deleted successfully`,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting candidate',
        error: error.message,
      });
    }
  }
}

module.exports = CandidateController;
