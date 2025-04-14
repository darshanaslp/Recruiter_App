const sequelize = require('../config/db.config');

const User = require('./User');
const Candidate = require('./Candidate');
const Job = require('./Job');
const Interview = require('./Interview'); // Assuming you have an Interview model

// Define associations
User.hasOne(Candidate, { foreignKey: 'userId', as: 'candidate' });
Candidate.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Define associations for Job and Interview
Job.hasMany(Interview, { foreignKey: 'jobId', as: 'interviews' });
Interview.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

module.exports = {
  sequelize,
  User,
  Candidate,
  Job,
  Interview,
};
