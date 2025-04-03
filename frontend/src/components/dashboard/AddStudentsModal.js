import React, { useState } from 'react';

const AddStudentsModal = ({ students, onClose, onSubmit, currentClass }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Students to {currentClass.name}</h3>
        <div className="students-list">
          {students.map(student => (
            <div key={student.id} className="student-item">
              <input
                type="checkbox"
                id={`student-${student.id}`}
                checked={selectedStudents.includes(student.id)}
                onChange={() => toggleStudentSelection(student.id)}
              />
              <label htmlFor={`student-${student.id}`}>
                {student.name} ({student.classId ? 'Already in class' : 'Not assigned'})
              </label>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSubmit(selectedStudents)}>Add Selected</button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentsModal;