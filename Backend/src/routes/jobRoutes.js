const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, jobController.createJob);
router.get('/', authMiddleware, jobController.getJobs);

router.get('/applications', authMiddleware, jobController.getApplicationsForRecruiter);
// Route for applying for a job
router.post('/apply', authMiddleware, jobController.applyJob);

module.exports = router;
