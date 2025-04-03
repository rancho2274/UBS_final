// frontend/src/components/feedback/FeedbackForm.js
import React, { useState } from 'react';
import api from '../../utils/api';

const FeedbackForm = ({ volunteerId, sessionId, onSubmitSuccess }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Updated handleSubmit in FeedbackForm.js
const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Please enter your feedback');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      console.log('Submitting feedback:', {
        volunteerId,
        sessionId,
        comment
      });
      
      await api.post('/feedback', {
        volunteerId,
        sessionId,
        comment,
      });
      
      setSuccess(true);
      setComment('');
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      console.error('Feedback submission error:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Provide Feedback</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Thank you for your feedback! Our system has analyzed your comments.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback
            </label>
            <textarea
              id="comment"
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="Share your experience with this volunteer..."
              required
            ></textarea>
            <p className="mt-2 text-sm text-gray-500">
              Your feedback will be automatically analyzed to generate a rating.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackForm;