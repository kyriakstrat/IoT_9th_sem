// middleware/checkSession.js

const checkSessionMiddleware = (req, res, next) => {
    // Check if a user session is active
    if (req.session.userId) {
      // User is authenticated, proceed to the next middleware or route handler
      next();
    } else {
      // User is not authenticated, redirect to the login page
      res.redirect('/login');
      return;
    }
  };
  
  module.exports = checkSessionMiddleware;
  