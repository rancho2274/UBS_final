// frontend/src/components/dashboard/VideoConferencing.js
import React, { useState } from 'react';
import MeetingNotification from '../dashboard/MeetingNotification';

const VideoConferencing = ({ userType }) => {
  // For demo purposes, hardcode the meeting URL
  const meetingUrl = "https://go-krushna.daily.co/FgPd5KEtqkLKgCu6vXk3";
  
  return (
    <div className="video-conferencing">
      <h3 className="text-xl font-semibold text-secondary-800 mb-4">
        {userType === "volunteer" ? "Create & Host Live Classes" : "Join Live Classes"}
      </h3>
      
      {userType === "student" && (
        <MeetingNotification meetingUrl={meetingUrl} />
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
          
          {meetingUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Share this link with students:</p>
              <div className="flex mt-2">
                <input 
                  type="text" 
                  value={meetingUrl} 
                  className="flex-grow border border-gray-300 rounded-l-md py-2 px-3 text-sm" 
                  readOnly
                />
                <button 
                  className="bg-gray-200 px-4 py-2 rounded-r-md text-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(meetingUrl);
                    alert("Meeting URL copied to clipboard!");
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
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
