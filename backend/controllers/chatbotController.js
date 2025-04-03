// backend/controllers/chatbotController.js
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { User } = require('../models');

// Store active sessions
const activeSessions = new Map();

// @desc    Upload PDF file
// @route   POST /api/chatbot/upload
// @access  Private
exports.uploadPdf = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files were uploaded' });
    }
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads/pdfs');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Get file paths
    const filePaths = req.files.map(file => file.path);
    
    // Store session information
    activeSessions.set(sessionId, {
      userId: req.user.id,
      pdfs: filePaths,
      timestamp: new Date(),
    });
    
    // Process PDFs with Python script in the background
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../scripts/process_pdfs.py'),
      sessionId,
      ...filePaths
    ]);
    
    // For debugging purposes
    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    res.status(200).json({ 
      message: 'Files uploaded successfully',
      sessionId,
      fileCount: req.files.length
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Answer question based on PDF content
// @route   POST /api/chatbot/question
// @access  Private
exports.answerQuestion = async (req, res) => {
  try {
    const { question, sessionId } = req.body;
    
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    
    // Check if session exists
    const session = activeSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found. Please upload PDFs first.' });
    }
    
    // Check if user is authorized to access this session
    if (session.userId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to access this session' });
    }
    
    // Call Python script to get answer
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../scripts/answer_question.py'),
      sessionId,
      question
    ]);
    
    let answer = '';
    pythonProcess.stdout.on('data', (data) => {
      answer += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      //if (code !== 0) {
       // return res.status(500).json({ message: 'Error processing question' });
     // }
      
      res.status(200).json({ answer: answer.trim() });
    });
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ message: error.message });
  }
};