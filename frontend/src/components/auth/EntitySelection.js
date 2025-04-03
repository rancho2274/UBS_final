import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EntitySelection.css';
import axios from 'axios';

const EntitySelection = () => {
  const [activeTab, setActiveTab] = useState('school');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // School specific
    location: '',
    // Student specific
    school: '',
    class: '',
    rollNumber: '',
    // Volunteer specific
    qualification: '',
    skills: [],
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const skillOptions = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
    'English', 'Hindi', 'Social Studies', 'History', 'Geography',
    'Computer Science', 'Art', 'Music', 'Physical Education'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSkillChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData({
      ...formData,
      skills: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      let payload = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      };
      
      if (activeTab === 'school') {
        payload = {
          ...payload,
          userType: 'school',
          location: formData.location,
        };
      } else if (activeTab === 'student') {
        payload = {
          ...payload,
          userType: 'student',
          school: formData.school,
          class: formData.class,
          rollNumber: formData.rollNumber,
        };
      } else if (activeTab === 'volunteer') {
        payload = {
          ...payload,
          userType: 'volunteer',
          qualification: formData.qualification,
          skills: formData.skills,
        };
      }
      
      const { data } = await axios.post('http://localhost:5000/api/auth/register', payload);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect to appropriate dashboard
      navigate(`/dashboard/${activeTab}`);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entity-selection-container">
      <div className="entity-selection-card">
        <div className="welcome-section">
          <h2>Welcome to EdConnect</h2>
          <p>Connecting Schools with Expert Volunteers</p>
        </div>

        <div className="tab-group">
          <button
            onClick={() => setActiveTab('school')}
            className={`tab-button ${activeTab === 'school' ? 'active' : ''}`}
          >
            School
          </button>
          <button
            onClick={() => setActiveTab('volunteer')}
            className={`tab-button ${activeTab === 'volunteer' ? 'active' : ''}`}
          >
            Volunteer
          </button>
          <button
            onClick={() => setActiveTab('student')}
            className={`tab-button ${activeTab === 'student' ? 'active' : ''}`}
          >
            Student
          </button>
        </div>

        <div className="form-section">
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {/* Common fields */}
            <div className="form-group">
              <label htmlFor="name">
                {activeTab === 'school' ? 'School Name' : 'Full Name'}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                {activeTab === 'school' ? 'School Email' : 'Email Address'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            {/* School specific fields */}
            {activeTab === 'school' && (
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            
            {/* Student specific fields */}
            {activeTab === 'student' && (
              <>
                <div className="form-group">
                  <label htmlFor="school">School Name</label>
                  <input
                    type="text"
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="class">Class/Grade</label>
                  <input
                    type="text"
                    id="class"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="rollNumber">Roll Number</label>
                  <input
                    type="text"
                    id="rollNumber"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
            
            {/* Volunteer specific fields */}
            {activeTab === 'volunteer' && (
              <>
                <div className="form-group">
                  <label htmlFor="qualification">Qualification</label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="skills">Skills (Hold Ctrl/Cmd to select multiple)</label>
                  <select
                    id="skills"
                    name="skills"
                    multiple
                    value={formData.skills}
                    onChange={handleSkillChange}
                    required
                  >
                    {skillOptions.map((skill) => (
                      <option key={skill} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            <button type="submit" className="register-button" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>

        <div className="login-section">
          <p>Already have an account?</p>
          <Link to="/login" className="login-button">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EntitySelection;