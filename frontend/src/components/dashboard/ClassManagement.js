import React, { useState } from 'react';
import NewClassForm from './NewClassForm';
import ClassDetails from './ClassDetails';
import AddStudentsModal from './AddStudentsModal';
import UploadSyllabusModal from './UploadSyllabusModal';

const ClassManagement = ({ 
  classes, 
  students,
  onCreateClass,
  onAddStudents,
  onUploadSyllabus
}) => {
  const [showNewClassForm, setShowNewClassForm] = useState(false);
  const [showAddStudentsModal, setShowAddStudentsModal] = useState(false);
  const [showUploadSyllabusModal, setShowUploadSyllabusModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [unassignedStudents, setUnassignedStudents] = useState([]);

  const handleAddStudentsClick = (classItem) => {
    setSelectedClass(classItem);
    // Filter students not assigned to any class or assigned to this class
    const unassigned = students.filter(
      student => !student.classId || student.classId === classItem.id
    );
    setUnassignedStudents(unassigned);
    setShowAddStudentsModal(true);
  };

  const handleUploadSyllabusClick = (classItem) => {
    setSelectedClass(classItem);
    setShowUploadSyllabusModal(true);
  };

  const handleSubmitAddStudents = (selectedStudentIds) => {
    onAddStudents(selectedClass.id, selectedStudentIds);
    setShowAddStudentsModal(false);
  };

  const handleSubmitUploadSyllabus = (file) => {
    onUploadSyllabus(selectedClass.id, file);
    setShowUploadSyllabusModal(false);
  };

  return (
    <div className="class-management">
      <div className="section-header">
        <h2>Class Management</h2>
        <button 
          onClick={() => setShowNewClassForm(true)}
          className="add-class-btn"
        >
          Create New Class
        </button>
      </div>

      {showNewClassForm && (
        <NewClassForm 
          onClose={() => setShowNewClassForm(false)}
          onSubmit={onCreateClass}
        />
      )}

      <div className="class-list">
        {classes.length === 0 ? (
          <p>No classes created yet. Create your first class!</p>
        ) : (
          classes.map(classItem => (
            <ClassDetails 
              key={classItem.id}
              classItem={classItem}
              students={students.filter(s => s.classId === classItem.id)}
              onAddStudents={() => handleAddStudentsClick(classItem)}
              onUploadSyllabus={() => handleUploadSyllabusClick(classItem)}
            />
          ))
        )}
      </div>

      {showAddStudentsModal && (
        <AddStudentsModal
          students={unassignedStudents}
          onClose={() => setShowAddStudentsModal(false)}
          onSubmit={handleSubmitAddStudents}
          currentClass={selectedClass}
        />
      )}

      {showUploadSyllabusModal && (
        <UploadSyllabusModal
          onClose={() => setShowUploadSyllabusModal(false)}
          onSubmit={handleSubmitUploadSyllabus}
          currentClass={selectedClass}
        />
      )}
    </div>
  );
};

export default ClassManagement;