const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ Get recruiters only
router.get('/recruiters', authMiddleware, userController.getRecruiters);

module.exports = router;
