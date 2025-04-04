// frontend/src/components/feedback/FeedbackList.js
import React from 'react';

const FeedbackList = ({ feedback, averageRating }) => {
  // Use the provided feedback data or fall back to sample data if empty
  const displayFeedback = feedback && feedback.length > 0 ? feedback : [
    {
      id: 1,
      Student: { name: 'Arjun Kumar' },
      rating: 4.5,
      comment: 'The class was very informative and Dr. Kumar explained all concepts clearly. Would love to attend more sessions.',
      createdAt: '2025-03-20T10:30:00Z'
    },
    {
      id: 2,
      Student: { name: 'Priya Patel' },
      rating: 5,
      comment: 'Excellent teaching style! The volunteer made complex physics concepts easy to understand with great examples and demonstrations.',
      createdAt: '2025-03-15T14:45:00Z'
    },
    {
      id: 3,
      Student: { name: 'Amit Sharma' },
      rating: 3.5,
      comment: 'The session was helpful but I would appreciate more practice problems. The explanations were good but we need more time for questions.',
      createdAt: '2025-03-10T11:20:00Z'
    }
  ];

  // Calculate average rating if not provided
  const calculatedAverageRating = averageRating || (displayFeedback.reduce((sum, item) => sum + item.rating, 0) / displayFeedback.length);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${
              i < Math.floor(rating) ? 'text-yellow-400' : 
              i < rating ? 'text-yellow-300' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Feedback & Ratings</h3>
        {calculatedAverageRating !== undefined && (
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Average Rating:</span>
            {renderStars(calculatedAverageRating)}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {displayFeedback.map((item) => (
          <div key={item.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.Student?.name || 'Anonymous Student'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              {renderStars(item.rating)}
            </div>
            <p className="mt-2 text-sm text-gray-600">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackList;