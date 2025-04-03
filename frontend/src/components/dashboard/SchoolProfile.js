import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

const SchoolProfile = ({ school }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: school.schoolName || '',
    location: school.location || '',
    email: school.email || '',
    phone: school.phone || '',
    principalName: school.principalName || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this to your backend
    setEditMode(false);
  };

  return (
    <div className="school-profile">
      <div className="profile-header">
        <h2>School Profile</h2>
        <button 
          onClick={() => setEditMode(!editMode)}
          className="edit-btn"
        >
          {editMode ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>School Name</label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label>Principal Name</label>
            <input
              type="text"
              name="principalName"
              value={formData.principalName}
              onChange={handleChange}
            />
          </div>
          
          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      ) : (
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">School Name:</span>
            <span className="detail-value">{school.schoolName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Location:</span>
            <span className="detail-value">{school.location}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{school.email}</span>
          </div>
          {school.phone && (
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{school.phone}</span>
            </div>
          )}
          {school.principalName && (
            <div className="detail-item">
              <span className="detail-label">Principal:</span>
              <span className="detail-value">{school.principalName}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchoolProfile;