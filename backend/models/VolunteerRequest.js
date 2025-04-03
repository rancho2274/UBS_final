// backend/models/VolunteerRequest.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VolunteerRequest = sequelize.define('VolunteerRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  schoolId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // schoolName: {  // New field added here
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  requiredHours: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'assigned', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

VolunteerRequest.associate = function(models) {
  VolunteerRequest.belongsTo(models.Class, {
    foreignKey: 'classId',
    as: 'class'
  });
  VolunteerRequest.belongsTo(models.School, {
    foreignKey: 'schoolId',
    as: 'school'
  });
};



module.exports = VolunteerRequest;
