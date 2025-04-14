const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Job = sequelize.define('Job', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  requirements: { type: DataTypes.TEXT },
  recruiterId: { type: DataTypes.INTEGER }
}, {
  timestamps: true
});

// Assuming you have an Application model
const Application = require('./Application'); // Import your Application model

// Define a one-to-many relationship: A job can have many applications
Job.hasMany(Application, { foreignKey: 'jobId' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

module.exports = Job;
