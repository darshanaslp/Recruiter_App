const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Interview = sequelize.define('Interview', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  candidateId: { type: DataTypes.INTEGER },
  recruiterId: { type: DataTypes.INTEGER },
  jobId: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATE },
  status: { type: DataTypes.ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled'), defaultValue: 'Scheduled' },
  meetingLink: { type: DataTypes.STRING }
}, {
  timestamps: true
});

module.exports = Interview;
