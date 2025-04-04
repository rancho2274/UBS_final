// frontend/src/components/dashboard/VideoConferencing.js
import React from 'react';
import MeetingNotification from '../dashboard/MeetingNotification';

const VideoConferencing = ({ userType, hideUrl = false }) => {
  // For demo purposes, hardcode the meeting URL but don't display it
  const meetingUrl = "https://go-krushna.daily.co/FgPd5KEtqkLKgCu6vXk3";
  
  return (
    <div className="video-conferencing">
      <h3 className="text-xl font-semibold text-secondary-800 mb-4">
        {userType === "volunteer" ? "Create & Host Live Classes" : "Join Live Classes"}
      </h3>
      
      {userType === "student" && (
        <MeetingNotification meetingUrl={meetingUrl} hideUrl={hideUrl} />
      )}
      
      {userType === "volunteer" ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium mb-4">Create a New Meeting</h4>
          <button 
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
            onClick={() => window.open(meetingUrl, "_blank")}
          >
            Start Meeting
          </button>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">You can share this meeting with your students directly from the session page</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-medium mb-4">Available Live Classes</h4>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Mathematics Class</p>
                <p className="text-sm text-gray-500">Teacher: Dr. Sunil Kumar</p>
              </div>
              
              <a 
                href={meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
              >
                Join Now
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConferencing;