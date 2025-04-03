// frontend/src/components/video/VideoMeeting.js
import React, { useState, useEffect } from "react";
import DailyIframe from "@daily-co/daily-js";
import "./VideoMeeting.css";

const VideoMeeting = ({ userType }) => {
  const [roomUrl, setRoomUrl] = useState("");
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [studentsConnected, setStudentsConnected] = useState(0);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);

  const API_KEY = "cf865a21f05ef5e046d18ed19336ff8acb9317a28467474b7aea2a94201dac1c";

  useEffect(() => {
    let interval;
    if (meetingStarted) {
      interval = setInterval(() => {
        setSessionTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [meetingStarted]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const createMeeting = async () => {
    try {
      const response = await fetch("https://api.daily.co/v1/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          privacy: "public",
        }),
      });

      const data = await response.json();
      setRoomUrl(data.url);
      setStudentsConnected(0);
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  const joinMeeting = () => {
    if (!roomUrl) {
      alert("Please create a meeting first.");
      return;
    }
    
    const call = DailyIframe.createCallObject();
    call.join({ url: roomUrl });
    
    call.on("participant-joined", () => {
      setStudentsConnected((prevCount) => prevCount + 1);
    });

    call.on("participant-left", () => {
      setStudentsConnected((prevCount) => Math.max(prevCount - 1, 0));
    });
    
    window.open(roomUrl, "_blank");
    setMeetingStarted(true);
    
    if (userType === "volunteer") {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: { mediaSource: "screen" }, 
        audio: true 
      });
      
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      let chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        saveRecording(blob);
        
        // Add session to history
        const now = new Date();
        setSessionHistory(prev => [...prev, {
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          duration: sessionTime,
          participants: studentsConnected,
          recordingUrl: URL.createObjectURL(blob)
        }]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      console.error("Error accessing screen recording:", error);
    }
  };

  const saveRecording = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `class_recording_${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const endMeeting = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
    
    setMeetingStarted(false);
    
    // Save session data
    if (userType === "volunteer") {
      const sessionData = {
        duration: sessionTime,
        participants: studentsConnected,
        date: new Date().toLocaleDateString()
      };
      
      // In a real app, you would save this to your backend
      console.log("Session ended:", sessionData);
    }
  };

  return (
    <div className="video-meeting">
      <div className="meeting-controls">
        {!meetingStarted ? (
          <>
            {!roomUrl ? (
              <button 
                className="btn-create" 
                onClick={createMeeting}
                disabled={userType !== "volunteer"}
              >
                Create Meeting
              </button>
            ) : (
              <div className="meeting-info">
                <p>Meeting URL: <a href={roomUrl} target="_blank" rel="noopener noreferrer">{roomUrl}</a></p>
                <button className="btn-join" onClick={joinMeeting}>
                  Join Meeting
                </button>
              </div>
            )}
          </>
        ) : (
          <button className="btn-end" onClick={endMeeting}>
            End Meeting
          </button>
        )}
      </div>

      {meetingStarted && (
        <div className="meeting-stats">
          <div className="stat-item">
            <span className="stat-label">Session Time:</span> 
            <span className="stat-value">{formatTime(sessionTime)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Students Connected:</span> 
            <span className="stat-value">{studentsConnected}</span>
          </div>
          {userType === "volunteer" && recording && (
            <div className="recording-indicator">
              <span className="record-dot"></span> Recording
            </div>
          )}
        </div>
      )}

      {userType === "volunteer" && sessionHistory.length > 0 && (
        <div className="session-history">
          <h3>Recent Sessions</h3>
          <div className="history-list">
            {sessionHistory.slice(0, 3).map((session, index) => (
              <div key={index} className="history-item">
                <div>
                  <strong>{session.date}</strong> at {session.time}
                </div>
                <div>Duration: {formatTime(session.duration)}</div>
                <div>Students: {session.participants}</div>
                <a href={session.recordingUrl} download className="download-link">
                  Download Recording
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoMeeting;