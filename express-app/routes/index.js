// routes/index.js
const express = require('express');
const router = express.Router();
// const session = require('express-session');
const Device = require('../models/devicemodel');
const User = require('../models/userModel'); // Adjust the path as needed
const Log = require('../models/logModel');
const Card = require('../models/cardModel');

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

    // Check if the device type is 'Card Reader'
    if (device.type.toLowerCase() === 'card reader') {
      // Fetch all cards associated with the user
      const cards = await Card.find({ owner: req.session.userId });

      // Render the 'deviceDetails' page with device details and associated cards
      res.render('deviceDetails', { title: 'Device Details', username, device, types, cards });
    } else {
      // Render the 'deviceDetails' page with only device details
      res.render('deviceDetails', { title: 'Device Details', username, device, types });
    }
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
    if(device.type == 'card reader'){
      const card = await Card.findOne({deviceCode:device.value});
      let cardOwner;
      if(card)cardOwner = card.deviceName;
      else if(device.value == 'None') cardOwner = 'None';
      else cardOwner = 'Unauth user';
      // Return the device data including type as JSON response
      res.json({
        deviceName: device.url,
        value: cardOwner,
        type: device.type,
        // Add other device properties as needed
      });
    }else{
      // Return the device data including type as JSON response
      res.json({
        deviceName: device.url,
        value: device.value,
        type: device.type,
        // Add other device properties as needed
      });

    }
  } catch (error) {
    console.error('Error fetching device data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/updateSessionCard', async (req, res) => {
  const newCardValue = req.body.newCardValue;

  try {
    const userId = req.session.userId; // You need to have a way to get the user's ID
    const updatedUser = await User.findByIdAndUpdate(userId, { key_reg: newCardValue }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send a response indicating success
    res.json({ message: 'Session card and user key_reg updated successfully' });
  } catch (error) {
    console.error('Error updating session card and user key_reg:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Add this route to your index.js file or the relevant router file
router.get('/deleteKey/:id', async (req, res) => {
  try {
      const keyId = req.params.id;

      // Find the key by ID and delete it
      await Card.findByIdAndDelete(keyId);

      // Redirect back to the device details page or any desired page
      res.redirect('/');
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Add this route to your index.js file or the relevant router file
router.post('/renameKey', async (req, res) => {
  try {
      const cardId = req.body.selectCard;
      const newKeyName = req.body.newKeyName;

      // Find the selected card and update its name
      const updatedCard = await Card.findByIdAndUpdate(cardId, { deviceName: newKeyName }, { new: true });

      if (!updatedCard) {
          return res.status(404).json({ error: 'Card not found' });
      }

      // Redirect back to the device details page or any desired page
      res.redirect('/');
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
