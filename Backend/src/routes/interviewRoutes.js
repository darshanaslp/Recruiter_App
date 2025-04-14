const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, interviewController.getInterviews);
router.post('/schedule', authMiddleware, interviewController.scheduleInterview);
router.put('/status', authMiddleware, interviewController.updateInterviewStatus);

module.exports = router;
