const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');

const Candidate = sequelize.define('Candidate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, unique: true },
  resume: { type: DataTypes.BLOB('long') }
}, {
  timestamps: true
});


module.exports = Candidate;
