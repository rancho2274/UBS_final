// frontend/src/components/dashboard/MeetingNotification.js
import React from 'react';

const MeetingNotification = ({ meetingUrl }) => {
  if (!meetingUrl) return null;
  
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-800 font-medium">
            A live class is available! 
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Meeting URL: <span className="font-mono">{meetingUrl}</span>
          </p>
        </div>
      </div>
      <div className="mt-4">
        <a
          href={meetingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Join Meeting
        </a>
      </div>
    </div>
  );
};

export default MeetingNotification;