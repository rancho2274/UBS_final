import React from 'react';

const VolunteerActivity = ({ volunteers, classes }) => {
  return (
    <div className="volunteer-activity">
      <h2>Volunteer Activity</h2>
      <div className="volunteers-list">
        {volunteers.map(volunteer => (
          <div key={volunteer.id} className="volunteer-card">
            <h3>{volunteer.name}</h3>
            <p>Subject: {volunteer.subject}</p>
            <p>Hours Taught: {volunteer.hoursTaught}</p>
            <p>Rating: {volunteer.rating}/5</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerActivity;