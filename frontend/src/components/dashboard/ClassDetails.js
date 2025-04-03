import React from 'react';

const ClassDetails = ({ classItem, students, onAddStudents, onUploadSyllabus }) => {
  return (
    <div className="class-card">
      <h3>{classItem.name}</h3>
      <p>Subject: {classItem.subject}</p>
      <p>Students: {students.length}</p>
      {classItem.syllabus && (
        <p>Syllabus: <a href={`/syllabus/${classItem.syllabus}`}>{classItem.syllabus}</a></p>
      )}
      <div className="class-actions">
        <button onClick={onAddStudents}>Add Students</button>
        <button onClick={onUploadSyllabus}>Upload Syllabus</button>
      </div>
    </div>
  );
};

export default ClassDetails;