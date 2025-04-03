import React from 'react';

const StudentPerformance = ({ students, classes }) => {
  return (
    <div className="student-performance">
      <h2>Student Performance</h2>
      <table>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Class</th>
            <th>Attendance</th>
            <th>Performance</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => {
            const studentClass = classes.find(c => c.id === student.classId);
            return (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{studentClass ? studentClass.name : 'Not assigned'}</td>
                <td>{student.attendance}</td>
                <td>{student.performance}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentPerformance;