const Job = require('../models/Job');
const Application = require('../models/Application');

exports.createJob = async (req, res) => {
  try {
    const { title, description, requirements } = req.body;
    const job = await Job.create({ title, description, requirements, recruiterId: req.user.id });
    res.status(201).json({ message: 'Job created', job });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.getApplicationsForRecruiter = async (req, res) => {
  try {
    const recruiterId = req.user.id; // From the JWT token

    // Get jobs posted by the recruiter
    const jobs = await Job.findAll({ where: { recruiterId } });

    if (!jobs) {
      return res.status(404).json({ message: 'No jobs found for this recruiter' });
    }

    // Get applications for these jobs
    const jobIds = jobs.map((job) => job.id);
    const applications = await Application.findAll({
      where: { jobId: jobIds },
      include: [
        { model: Job, attributes: ['title'] }, // Include job title in the result
      ],
    });

    return res.json(applications);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching applications', error: err.message });
  }
};

// Apply for a job (for candidates)
exports.applyJob = async (req, res) => {
  try {
    const { jobId, details } = req.body;
    const userId = req.user.id; // Get user ID from the auth middleware

    // Check if the job exists
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      where: { userId, jobId }
    });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create the job application
    const application = await Application.create({ userId, jobId, details });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
