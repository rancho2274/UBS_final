const { User, Student, School, Volunteer } = require('../models');

// @desc    Get user profile based on user type
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    let profile;

    switch (user.userType) {
      case 'student':
        profile = await Student.findOne({ where: { userId: user.id } });
        break;
      case 'school':
        profile = await School.findOne({ where: { userId: user.id } });
        break;
      case 'volunteer':
        profile = await Volunteer.findOne({ where: { userId: user.id } });
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      userType: user.userType,
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const t = await User.sequelize.transaction();

  try {
    const user = req.user;
    const { email, password, ...profileData } = req.body;

    // Update user email if provided
    if (email) {
      const emailExists = await User.findOne({ 
        where: { 
          email,
          id: { [User.sequelize.Op.ne]: user.id } 
        } 
      });

      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      user.email = email;
    }

    // Update user password if provided
    if (password) {
      user.password = password;
    }

    if (email || password) {
      await user.save({ transaction: t });
    }

    // Update profile based on user type
    if (Object.keys(profileData).length > 0) {
      let profile;

      switch (user.userType) {
        case 'student':
          profile = await Student.findOne({ where: { userId: user.id } });
          if (profile) {
            await profile.update(profileData, { transaction: t });
          }
          break;
        case 'school':
          profile = await School.findOne({ where: { userId: user.id } });
          if (profile) {
            await profile.update(profileData, { transaction: t });
          }
          break;
        case 'volunteer':
          profile = await Volunteer.findOne({ where: { userId: user.id } });
          if (profile) {
            await profile.update(profileData, { transaction: t });
          }
          break;
        default:
          return res.status(400).json({ message: 'Invalid user type' });
      }

      if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
      }
    }

    await t.commit();

    // Get updated profile
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
    });

    let updatedProfile;
    switch (user.userType) {
      case 'student':
        updatedProfile = await Student.findOne({ where: { userId: user.id } });
        break;
      case 'school':
        updatedProfile = await School.findOne({ where: { userId: user.id } });
        break;
      case 'volunteer':
        updatedProfile = await Volunteer.findOne({ where: { userId: user.id } });
        break;
    }

    res.json({
      ...updatedUser.dataValues,
      profile: updatedProfile,
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users of a specific type (for admin use)
// @route   GET /api/users/:type
// @access  Private/Admin
exports.getUsersByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['student', 'school', 'volunteer'].includes(type)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    const users = await User.findAll({
      where: { userType: type },
      attributes: { exclude: ['password'] },
    });

    // Get profiles for each user
    let profiles;
    switch (type) {
      case 'student':
        profiles = await Student.findAll({
          where: { userId: users.map(user => user.id) },
        });
        break;
      case 'school':
        profiles = await School.findAll({
          where: { userId: users.map(user => user.id) },
        });
        break;
      case 'volunteer':
        profiles = await Volunteer.findAll({
          where: { userId: users.map(user => user.id) },
        });
        break;
    }

    // Map profiles to users
    const usersWithProfiles = users.map(user => {
      const profile = profiles.find(p => p.userId === user.id);
      return {
        ...user.dataValues,
        profile: profile || null,
      };
    });

    res.json(usersWithProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  const t = await User.sequelize.transaction();
  
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete profile based on user type
    switch (user.userType) {
      case 'student':
        await Student.destroy({ where: { userId: id }, transaction: t });
        break;
      case 'school':
        await School.destroy({ where: { userId: id }, transaction: t });
        break;
      case 'volunteer':
        await Volunteer.destroy({ where: { userId: id }, transaction: t });
        break;
    }

    // Delete user
    await user.destroy({ transaction: t });

    await t.commit();
    
    res.json({ message: 'User removed' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};