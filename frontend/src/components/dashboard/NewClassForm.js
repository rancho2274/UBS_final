// frontend/src/components/dashboard/NewClassForm.js
import React, { useState } from 'react';

const NewClassForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    syllabus: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      syllabus: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a FormData object to handle file upload
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('subject', formData.subject);
    if (formData.syllabus) {
      formDataToSubmit.append('syllabus', formData.syllabus);
    }

    onSubmit(formDataToSubmit);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Create New Class</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Class Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Curriculum (Optional)</label>
            <input
              type="file"
              name="syllabus"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClassForm;