const { Candidate, User } = require('../models');
const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.memoryStorage();
exports.upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max size
});

exports.upload = multer({ storage });

// GET profile
exports.getCandidateProfile = async (req, res) => {
  try {
    console.log(req.user.id,'userId: req.user.id')
    const candidate = await Candidate.findOne({ where: { userId: req.user.id } });
    if (!candidate) return res.status(404).json({ message: 'Candidate ' });

    res.json({
      id: candidate.id,
      userId: candidate.userId,
      resume: candidate.resume ? true : false, // indicate if resume exists
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET resume file (as blob)
exports.downloadResume = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ where: { userId: req.user.id } });
    if (!candidate || !candidate.resume) return res.status(404).json({ message: 'Resume not found' });

    res.setHeader('Content-Type', 'application/pdf'); // or generic: application/octet-stream
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    res.send(candidate.resume);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT update profile (CV upload)
exports.updateCandidateProfile = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ where: { userId: req.user.id } });
    if (!candidate) return res.status(404).json({ message: 'Candidate' });

    if (req.file) {
      await candidate.update({ resume: req.file.buffer });
    }

    res.json({ message: 'Profile updated', candidate });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// New method: Return all candidates (for recruiter/admin view)
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll({
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
    });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCandidateById = async (req, res) => {
  try {
    console.log(req.params.id,'req.params.id')
    const candidate = await Candidate.findOne({
      where: { id: req.params.id },
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }]
    });

    if (!candidate) {
      return res.status(404).json({ message: `Candidate with ID ${req.params.id} not found` });
    }

    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};