const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  let token;
  console.log('Auth middleware - Headers:', req.headers);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token);
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);
      
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] },
      });
      
      if (!req.user) {
        console.log('User not found with id:', decoded.id);
        return res.status(401).json({ message: 'User not found' });
      }
      
      console.log('User found:', req.user.id);
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No Authorization header found');
    res.status(401).json({ message: 'Not authorized, no token' });
    return;
  }
};

module.exports = { protect };