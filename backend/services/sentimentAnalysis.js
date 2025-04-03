// backend/services/sentimentAnalysis.js
const axios = require('axios');

// Using Hugging Face Inference API for sentiment analysis
// You'll need to sign up for a free API token at huggingface.co
const analyzeSentiment = async (text) => {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // The API returns sentiment labels (POSITIVE/NEGATIVE) with scores
    const result = response.data[0];
    
    // Convert the sentiment score to a 1-5 rating scale
    let rating = 3; // Default neutral rating
    
    if (result[0].label === 'POSITIVE') {
      // Map 0.5-1.0 confidence to 3-5 rating
      rating = Math.round(3 + (result[0].score * 2));
    } else {
      // Map 0.5-1.0 confidence to 1-3 rating
      rating = Math.round(3 - (result[0].score * 2));
    }
    
    return {
      text,
      sentiment: result[0].label,
      confidence: result[0].score,
      rating // 1-5 rating
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    // Return a neutral sentiment if the API fails
    return {
      text,
      sentiment: 'NEUTRAL',
      confidence: 0.5,
      rating: 3
    };
  }
};

module.exports = { analyzeSentiment };