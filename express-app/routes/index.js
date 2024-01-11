// routes/index.js
const express = require('express');
const router = express.Router();
// const session = require('express-session');
const Device = require('../models/devicemodel');
const User = require('../models/userModel'); // Adjust the path as needed
const Log = require('../models/logModel');
let username ;
// const devicesController = require('../controllers/devicesController');
let types = ['Sensor','Lamp','Card Reader','Camera','Lock']
router.get('/', async (req, res) => {

    const userData = await User.findById(req.session.userId);
    username = userData.name;
    
    const devices = await Device.find({ _id: { $in: userData.devices }});
    res.render('devices', { title: 'Home',username,devices,types});
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

router.post('/add_device', async (req, res) => {
    const { deviceUrl, deviceName,deviceType } = req.body;
    const userId = req.session.userId;
    const newDevice = new Device({ url: deviceUrl, name: deviceName, type: deviceType, owner: userId });
    // Save the device to the database
    await newDevice.save();

    // Find the user by their userId
    const user = await User.findById(userId);

    // Add the ID of the newly created device to the user's devices array
    user.devices.push(newDevice._id);

    // Save the updated user document
    await user.save();

    res.redirect("/");
});

// Route to access a specific device by ID
router.get('/device/:id', async (req, res) => {
    try {
      const deviceId = req.params.id;
  
      // Retrieve the device details by ID
      const device = await Device.findById(deviceId);

      res.render('deviceDetails', { title: 'Device Details',username, device ,types});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // Handle form submission to update the device details
router.post('/editDevice/:id', async (req, res) => {
    try {
      const deviceId = req.params.id;
      const { name, url, type } = req.body;
  
      const updatedDevice = await Device.findByIdAndUpdate(
        deviceId,
        { name, url, type },
        { new: true } // Return the updated document
      );  
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Handle device deletion
router.get('/deleteDevice/:id', async (req, res) => {
    try {
      const deviceId = req.params.id;
        // console.log(deviceId);
      const deviceToDelete = await Device.findByIdAndDelete(deviceId);
    //   console.log(deviceToDelete);
    //   await deviceToDelete.remove();
  
      res.redirect('/');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Custom route to handle device value requests
router.get('/api/device/:deviceName/value', async (req, res) => {
  try {
    const deviceName = req.params.deviceName;

    // Fetch the device from the database using the provided device name
    const device = await Device.findOne({ url: deviceName });

    if (!device) {
      // If the device is not found, return an appropriate response
      return res.status(404).json({ error: 'Device not found' });
    }

    // Return the device data including type as JSON response
    res.json({
      deviceName: device.url,
      value: device.value,
      type: device.type,
      // Add other device properties as needed
    });
  } catch (error) {
    console.error('Error fetching device data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
