// routes/index.js
const express = require('express');
const router = express.Router();
// const session = require('express-session');
const Device = require('../models/devicemodel');
const User = require('../models/userModel'); // Adjust the path as needed

// const devicesController = require('../controllers/devicesController');

router.get('/', async (req, res) => {

    const userData = await User.findById(req.session.userId);
    const username = userData.name;
    
    const devices = await Device.find({ _id: { $in: userData.devices }});
    // const devices = [
    //     { name: 'device1', value: 20 },
    //     { name: 'device2', value: 15 },
    //     { name: 'device3', value: 25 },
    //     { name: 'device1', value: 20 },
    //     { name: 'device2', value: 15 },
    //     { name: 'device3', value: 25 },
    //     { name: 'device1', value: 20 },
    //     { name: 'device2', value: 15 },
    //     { name: 'device3', value: 25 },
    // ];
    res.render('devices', { title: 'Home',username,devices});
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

      res.render('deviceDetails', { title: 'Device Details', device });
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
module.exports = router;
