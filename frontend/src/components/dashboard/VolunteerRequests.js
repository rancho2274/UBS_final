import React, { useState } from 'react';

const VolunteerRequests = ({ classes, onRequestVolunteer }) => {
  const [requestData, setRequestData] = useState({
    classId: '',
    subject: '',
    topic: '',
    requiredHours: '',
    description: ''
  });

  const handleChange = (e) => {
    setRequestData({
      ...requestData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedClass = classes.find(c => c.id === parseInt(requestData.classId));
    onRequestVolunteer({
      ...requestData,
      className: selectedClass?.name || ''
    });
    setRequestData({
      classId: '',
      subject: '',
      topic: '',
      requiredHours: '',
      description: ''
    });
  };

  return (
    <div className="volunteer-requests">
      <h2>Request Volunteer Assistance</h2>
      
      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-group">
          <label>Select Class</label>
          <select
            name="classId"
            value={requestData.classId}
            onChange={handleChange}
            required
          >
            <option value="">Select a class</option>
            {classes.map(classItem => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.name} - {classItem.subject}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Subject</label>
          <input
            type="text"
            name="subject"
            value={requestData.subject}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Topic</label>
            <input
              type="text"
              name="topic"
              value={requestData.topic}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Required Hours</label>
            <input
              type="number"
              name="requiredHours"
              value={requestData.requiredHours}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={requestData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>
          
          <button type="submit" className="submit-request-btn">
            Submit Request
          </button>
        </form>
        
        <div className="pending-requests">
          <h3>Pending Volunteer Requests</h3>
          <div className="requests-list">
            {/* This would typically come from backend */}
            <div className="no-requests">
              <p>No pending requests currently</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default VolunteerRequests;