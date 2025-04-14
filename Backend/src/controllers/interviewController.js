const Interview = require('../models/Interview');
const User = require('../models/User'); // For candidate details
const Candidate = require('../models/Candidate'); 
const Job = require('../models/Job'); 
const { sendInterviewEmail } = require('../services/emailService');
const { generateMeetingLink } = require('../services/videoHelper');
const { Sequelize } = require('sequelize'); 

exports.scheduleInterview = async (req, res) => {
  try {
    const { candidateId, jobId, date } = req.body;
    // Generate a meeting link (using Jitsi Meet)
    const meetingLink = generateMeetingLink();

    // Create interview record
    const interview = await Interview.create({
      candidateId,
      recruiterId: req.user.id,
      jobId,
      date,
      meetingLink,
      status: 'Scheduled'
    });

    // Fetch candidate email and name from User model
    const candidate = await User.findOne({ where: { id: candidateId }});
    if(candidate) {
      await sendInterviewEmail(candidate.email, candidate.name, { date, meetingLink });
    }

    // Optionally, emit a Socket.io notification (accessible via req.io)
    req.io.emit('interviewScheduled', interview);

    res.status(201).json({ message: 'Interview scheduled', interview });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getInterviews = async (req, res) => {
  try {
    const role = req.user.role;

    let interviews;
    if (role === 'candidate') {
      const candidate = await Candidate.findOne({ where: { userId: req.user.id } });
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate record not found for this user' });
      }

      // Fetch interviews for the candidate and include related job details
      interviews = await Interview.findAll({
        where: { candidateId: candidate.id },
        include: [
          {
            model: Job,
            as: 'job', // Alias for the relationship
            required: true, // Ensures the interview only includes jobs
          },
        ],
      });
    } else if (role === 'recruiter') {
      // Fetch interviews for the recruiter and include related job details
      interviews = await Interview.findAll({
        where: { recruiterId: req.user.id },
        include: [
          {
            model: Job,
            as: 'job', // Alias for the relationship
            required: true, // Ensures the interview only includes jobs
          },
        ],
      });
    } else {
      // For admin, return all interviews with job details
      interviews = await Interview.findAll({
        include: [
          {
            model: Job,
            as: 'job', // Alias for the relationship
            required: true, // Ensures the interview only includes jobs
          },
        ],
      });
    }

    res.json(interviews);
  } catch (err) {
    console.error('Error fetching interviews:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateInterviewStatus = async (req, res) => {
  try {
    const { interviewId, status } = req.body;
    const interview = await Interview.findByPk(interviewId);
    if(!interview) return res.status(404).json({ message: 'Interview not found' });
    interview.status = status;
    await interview.save();

    req.io.emit('interviewStatusUpdated', interview);

    res.json({ message: 'Interview status updated', interview });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
