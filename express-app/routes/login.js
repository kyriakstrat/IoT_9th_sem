// routes/index.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path as needed
const Device = require('../models/devicemodel'); // Adjust the path as needed


// const devicesController = require('../controllers/devicesController');

router.get('/', (req, res) => {

    res.render('login',{title:"login"});
});

router.post('/', async (req, res) => {
    const { loginEmail, loginPassword } = req.body;
  
    try {
      // Find the user by email and password
      const user = await User.findOne({ email: loginEmail, password: loginPassword });
  
      // Check if the user exists
      if (!user) {
        res.redirect('/login');
        return;
      }
  
      // Create a session for the user
      req.session.userId = user._id;
      req.session.card = false;
  
      // Redirect the user to the home page
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// Handle user registration
router.post('/register', async (req, res) => {
    // const { name, email, password } = req.body;
    const name = req.body.registerName;
    const email = req.body.registerEmail;
    const password = req.body.registerPassword;
    // console.log(req.body);
  
      try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // return res.status(400).json({ message: 'User with this email already exists.' });
        res.redirect('/login');
        return;
      }
  
      // Create a new user
      const newUser = new User({ name:name, email:email, password:password });
  
      // Save the user to the database
      await newUser.save();
  
      // Respond with a success message
    //   res.status(201).json({ message: 'User registered successfully!' });
      res.redirect('/');

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  
router.post('/app_inv_pass', async (req, res) => {
  console.log(req.body);
  try {
    const { url, type,name } = req.body;

    // Check if a device with the same URL already exists
    const existingDevice = await Device.findOne({ url });
    const user = await User.findOne({ email:name });

    console.log(user._id);

    if (existingDevice || !user) {
      // Device with the same URL already exists
      res.status(409).json({ message: 'Device already exists with the provided URL' });
    } else {
      // Create a new device
      const newDevice = new Device({
        url:url,
        type:type,
        name: 'None',
        owner:user._id,
      });

      // Save the new device to the database
      await newDevice.save();
      console.log('new device created')
      user.devices.push(newDevice._id);
      await user.save();
      

      res.status(201).json({ message: 'Device created successfully', device: newDevice });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
