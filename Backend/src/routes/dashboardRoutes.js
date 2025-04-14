const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ Get recruiter dashboard stats (interviews data)
router.get('/recruiter', authMiddleware, interviewController.getInterviews);

// ✅ Get candidate dashboard data (all candidates)
router.get('/candidates', authMiddleware, candidateController.getAllCandidates);

module.exports = router;
