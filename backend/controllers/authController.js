const jwt = require('jsonwebtoken');
const { User, Student, School, Volunteer } = require('../models');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const t = await User.sequelize.transaction();
  
  try {
    const { email, password, userType, ...profileData } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      userType,
    }, { transaction: t });

    // Create profile based on user type
    if (userType === 'student') {
      await Student.create({
        userId: user.id,
        name: profileData.name,
        school: profileData.school,
        class: profileData.class,
        rollNumber: profileData.rollNumber,
      }, { transaction: t });
    } else if (userType === 'school') {
      await School.create({
        userId: user.id,
        name: profileData.name,
        location: profileData.location,
      }, { transaction: t });
    } else if (userType === 'volunteer') {
      await Volunteer.create({
        userId: user.id,
        name: profileData.name,
        qualification: profileData.qualification,
        skills: profileData.skills,
      }, { transaction: t });
    }

    await t.commit();

    res.status(201).json({
      id: user.id,
      email: user.email,
      userType: user.userType,
      token: generateToken(user.id),
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user.id,
        email: user.email,
        userType: user.userType,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};