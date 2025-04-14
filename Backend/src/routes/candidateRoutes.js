const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const authMiddleware = require('../middlewares/authMiddleware');

// router.get('/', authMiddleware, candidateController.getAllCandidates);
// router.get('/:id', authMiddleware, candidateController.getCandidateById);
// router.get('/profile', authMiddleware, candidateController.getCandidateProfile);
// // router.put('/profile', authMiddleware, candidateController.updateCandidateProfile);
// router.put('/profile', authMiddleware, candidateController.upload.single('resume'), candidateController.updateCandidateProfile);
// router.get('/resume', authMiddleware, candidateController.downloadResume); 


router.get('/profile', authMiddleware, candidateController.getCandidateProfile);
router.put('/profile', authMiddleware, candidateController.upload.single('resume'), candidateController.updateCandidateProfile);
router.get('/resume', authMiddleware, candidateController.downloadResume);

// Then define dynamic routes
router.get('/:id', authMiddleware, candidateController.getCandidateById);
router.get('/', authMiddleware, candidateController.getAllCandidates);

module.exports = router;
