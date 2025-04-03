// frontend/src/components/chatbot/StudentChatbot.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api from '../../utils/api';
import './Chatbot.css';

const StudentChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const [sessionId, setSessionId] = useState('');
  
  useEffect(() => {
    // Generate a unique session ID for this user
    if (!sessionId) {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      setSessionId(userInfo?.id ? `student_${userInfo.id}` : `student_${Date.now()}`);
    }
    
    scrollToBottom();
  }, [messages, sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleFileUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('pdfs', file);
    });
    
    formData.append('sessionId', sessionId);
    
    try {
      await api.post('/chatbot/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setMessages([...messages, {
        type: 'system',
        content: `Uploaded ${files.length} file(s) successfully. You can now ask questions about the content.`
      }]);
      
      setFiles([]);
    } catch (error) {
      setMessages([...messages, {
        type: 'system',
        content: `Error uploading files: ${error.response?.data?.message || error.message}`
      }]);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      type: 'user',
      content: input
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      const { data } = await api.post('/chatbot/question', {
        question: input,
        sessionId: sessionId
      });
      
      setMessages(prevMessages => [...prevMessages, {
        type: 'assistant',
        content: data.answer
      }]);
    } catch (error) {
      setMessages(prevMessages => [...prevMessages, {
        type: 'system',
        content: `Error: ${error.response?.data?.message || error.message}`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Learning Assistant</h3>
      </div>
      <div className="chatbot-messages">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <p>Upload PDF study materials and ask questions about them!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.type === 'user' ? 'user-message' : message.type === 'assistant' ? 'assistant-message' : 'system-message'}`}
            >
              {message.content}
            </div>
          ))
        )}
        {loading && (
          <div className="message assistant-message">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="file-upload-section">
        <input 
          type="file" 
          id="pdf-upload" 
          accept=".pdf" 
          multiple 
          onChange={handleFileChange}
          className="file-input"
        />
        <label htmlFor="pdf-upload" className="file-label">
          {files.length > 0 ? `${files.length} file(s) selected` : 'Choose PDF files'}
        </label>
        {files.length > 0 && (
          <button 
            onClick={handleFileUpload} 
            className="upload-button"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question about your learning materials..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default StudentChatbot;