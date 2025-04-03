// backend/models/index.js
const { sequelize } = require('../config/db');
const User = require('./User');
const Student = require('./Student');
const School = require('./School');
const Volunteer = require('./Volunteer');
const Feedback = require('./Feedback'); // Add this line

// Define associations
User.hasOne(Student, { foreignKey: 'userId' });
Student.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(School, { foreignKey: 'userId' });
School.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Volunteer, { foreignKey: 'userId' });
Volunteer.belongsTo(User, { foreignKey: 'userId' });

// Add feedback associations
Student.hasMany(Feedback, { foreignKey: 'studentId' });
Feedback.belongsTo(Student, { foreignKey: 'studentId' });

Volunteer.hasMany(Feedback, { foreignKey: 'volunteerId' });
Feedback.belongsTo(Volunteer, { foreignKey: 'volunteerId' });

// Export models
module.exports = {
  sequelize,
  User,
  Student,
  School,
  Volunteer,
  Feedback,  // Add this line
};