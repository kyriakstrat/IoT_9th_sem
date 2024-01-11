// middleware/checkSession.js
const User = require('../models/userModel');

const checkSessionMiddleware = async (req, res, next) => {
    // Check if a user session is active
    if (req.session.userId) {
      // User is authenticated, proceed to the next middleware or route handler
      await User.findOneAndUpdate({ _id: req.session.userId }, { key_reg:false }, { new: true });
      next();
    } else {
      // User is not authenticated, redirect to the login page
      res.redirect('/login');
      return;
    }
  };
  
  module.exports = checkSessionMiddleware;
  