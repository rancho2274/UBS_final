// backend/controllers/classController.js
const { Class, School } = require('../models');

// @desc    Get all classes for a school
// @route   GET /api/classes
// @access  Private
exports.getClasses = async (req, res) => {
  try {
    // Get the school associated with the user
    const school = await School.findOne({ where: { userId: req.user.id } });
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    
    const classes = await Class.findAll({ 
      where: { schoolId: school.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new class
// @route   POST /api/classes
// @access  Private
exports.createClass = async (req, res) => {
    try {
      console.log('Request body:', req.body);
      const { name, subject } = req.body;
      console.log('Name:', name, 'Subject:', subject);
      
      // Get the school associated with the user
      console.log('Looking for school with userId:', req.user.id);
      const school = await School.findOne({ where: { userId: req.user.id } });
      
      console.log('School found:', school ? `id: ${school.id}, name: ${school.name}` : 'Not found');
      
      if (!school) {
        return res.status(404).json({ message: 'School not found' });
      }
      
      console.log('Creating class with schoolId:', school.id);
      const newClass = await Class.create({
        name,
        subject,
        schoolId: school.id
      });
      
      console.log('Class created:', newClass.id);
      res.status(201).json(newClass);
    } catch (error) {
      console.error('Error creating class:', error);
      res.status(500).json({ message: error.message });
    }
  };

// @desc    Delete a class
// @route   DELETE /api/classes/:id
// @access  Private
exports.deleteClass = async (req, res) => {
  try {
    // Get the school associated with the user
    const school = await School.findOne({ where: { userId: req.user.id } });
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    
    const classToDelete = await Class.findOne({ 
      where: { 
        id: req.params.id,
        schoolId: school.id 
      } 
    });
    
    if (!classToDelete) {
      return res.status(404).json({ message: 'Class not found' });
    }
    
    await classToDelete.destroy();
    
    res.json({ message: 'Class removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};