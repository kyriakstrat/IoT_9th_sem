// routes/index.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path as needed
const Log = require('../models/logModel');
// const devicesController = require('../controllers/devicesController');

router.get('/', async (req, res) => {
    try {
      // Fetch logs associated with the user ID (assuming user ID is in req.session.userId)
      const logs = await Log.find({ owner: req.session.userId });
      
    const userData = await User.findById(req.session.userId);
    username = userData.name;
      // Render the logs.ejs page with the fetched logs
      res.render('logs', {username, title: 'Logs', logs });
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.post('/delete', async (req, res) => {
    try {
      // Delete all logs associated with the user ID (assuming user ID is in req.session.userId)
      await Log.deleteMany({ owner: req.session.userId });
  
      res.redirect('/logs'); // Redirect to the logs page after successful deletion
    } catch (error) {
      console.error('Error deleting logs:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  module.exports = router;