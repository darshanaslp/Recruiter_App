const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Application = sequelize.define('Application', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER },  // Assuming userId is the ID of the applicant
  jobId: { type: DataTypes.INTEGER },
  details: { type: DataTypes.TEXT }, // Details of the application (e.g., cover letter)
}, {
  timestamps: true
});

module.exports = Application;
