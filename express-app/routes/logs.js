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
  
      // Render the logs.ejs page with the fetched logs
      res.render('logs', { title: 'Logs', logs });
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  module.exports = router;