// routes/index.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path as needed

// const devicesController = require('../controllers/devicesController');

router.get('/', async (req, res) => {

    const userData = await User.findById(req.session.userId);
    const username = userData.name;
    const devices = [
        { name: 'device1', value: 20 },
        { name: 'device2', value: 15 },
        { name: 'device3', value: 25 },
        { name: 'device1', value: 20 },
        { name: 'device2', value: 15 },
        { name: 'device3', value: 25 },
        { name: 'device1', value: 20 },
        { name: 'device2', value: 15 },
        { name: 'device3', value: 25 },
    ];
    res.render('profile', { title: 'Home',username,userData});
});

router.post('/edit', async (req, res) => {
    try {
      // Retrieve new name and password from the request body
      const newName = req.body.newName;
      const newPassword = req.body.newPassword;
  
  
      // Find the user by the userId stored in the session
      const userId = req.session.userId;
      const user = await User.findById(userId);
  
      // Update the user's name and/or password if provided
      if (newName) {
        user.name = newName;
      }
  
      if (newPassword) {
        user.password = newPassword;
      }
  
      // Save the updated user document
      await user.save();
  
      // Respond with a success message
      res.redirect('/profile');
    } catch (error) {
      // Handle errors, e.g., database error or validation error
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
