const { VolunteerRequest, Class, School, User } = require('../models');

const { Op } = require('sequelize');

const getVolunteerRequests = async (req, res) => {
  try {
    const requests = await VolunteerRequest.findAll({
      where: { status: 'pending' },
      include: [
        { association: 'school', attributes: ['name', 'location'] },
        { association: 'class', attributes: ['name'] }
      ]
    });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching volunteer requests:', error);
    res.status(500).json({ message: 'Server error while fetching volunteer requests' });
  }
};

const getVolunteerRequest = async (req, res) => {
  try {
    const request = await VolunteerRequest.findByPk(req.params.id, {
      include: [
        { association: 'school', attributes: ['name', 'location'] },
        { association: 'class', attributes: ['name'] }
      ]
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Volunteer request not found' });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error fetching volunteer request:', error);
    res.status(500).json({ message: 'Server error while fetching volunteer request' });
  }
};

// Add other controller methods as needed
// Create a new volunteer request
const createVolunteerRequest = async (req, res) => {
  try {
    const { classId, subject, topic, requiredHours, description } = req.body;
    
    // Verify the class exists and belongs to the user's school
    const userWithSchool = await User.findByPk(req.user.id, {
      include: {
        model: School,
        attributes: ['id']
      }
    });
    
    if (!userWithSchool || !userWithSchool.School) {
      return res.status(403).json({ message: 'User is not associated with a school' });
    }
    
    const classExists = await Class.findOne({
      where: {
        id: classId,
        schoolId: userWithSchool.School.id
      }
    });
    
    if (!classExists) {
      return res.status(404).json({ message: 'Class not found or not associated with your school' });
    }
    
    const newRequest = await VolunteerRequest.create({
      classId,
      subject,
      topic,
      requiredHours,
      description,
      status: 'pending'
    });
    
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating volunteer request:', error);
    res.status(500).json({ 
      message: 'Failed to create volunteer request',
      error: error.message 
    });
  }
};

// Cancel a volunteer request
const cancelVolunteerRequest = async (req, res) => {
  try {
    const userWithSchool = await User.findByPk(req.user.id, {
      include: {
        model: School,
        attributes: ['id']
      }
    });
    
    if (!userWithSchool || !userWithSchool.School) {
      return res.status(403).json({ message: 'User is not associated with a school' });
    }
    
    const request = await VolunteerRequest.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: Class,
        where: {
          schoolId: userWithSchool.School.id
        },
        required: true
      }
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found or not authorized' });
    }
    
    if (request.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Only pending requests can be cancelled' 
      });
    }
    
    await request.update({ status: 'cancelled' });
    
    res.json({ 
      message: 'Request cancelled successfully',
      request 
    });
  } catch (error) {
    console.error('Error cancelling volunteer request:', error);
    res.status(500).json({ 
      message: 'Failed to cancel volunteer request',
      error: error.message 
    });
  }
};



// Update a volunteer request
const updateVolunteerRequest = async (req, res) => {
  try {
    const userWithSchool = await User.findByPk(req.user.id, {
      include: {
        model: School,
        attributes: ['id']
      }
    });
    
    const request = await VolunteerRequest.findOne({
      where: {
        id: req.params.id
      },
      include: {
        model: Class,
        where: {
          schoolId: userWithSchool.School.id
        },
        required: true
      }
    });
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found or not authorized' });
    }
    
    const { subject, topic, requiredHours, description } = req.body;
    
    await request.update({
      subject: subject || request.subject,
      topic: topic || request.topic,
      requiredHours: requiredHours || request.requiredHours,
      description: description || request.description
    });
    
    res.json(request);
  } catch (error) {
    console.error('Error updating volunteer request:', error);
    res.status(500).json({ 
      message: 'Failed to update volunteer request',
      error: error.message 
    });
  }
};

module.exports = {
  getVolunteerRequests,
  getVolunteerRequest,
  createVolunteerRequest,
  cancelVolunteerRequest,
  updateVolunteerRequest
};