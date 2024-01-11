// middleware/fetchDataMiddleware.js
// const fetch = require('node-fetch');
const Device = require('../models/devicemodel');
const Log = require('../models/logModel');

const fetchDataMiddleware = async (req, res, next) => {
  try {
    // Fetch all devices from the database
    const devices = await Device.find();
    // console.log(devices.length);

    // Iterate through each device and fetch data from the external API
    for (const device of devices) {
      const deviceURL = device.url;
      const deviceName = device.name;
      const response = await fetch(`http://localhost:1026/v2/entities/sensor_${deviceURL}/attrs/value`);
      const data = await response.json();
    //   console.log("%s,%s,%s",deviceURL,data.value,device.value);
      // Update the device value in the database if it has changed
      if (data.value !== device.value) {
        if (['Sensor','Lamp','Lock'].includes(device.type)){
            await Device.findOneAndUpdate({ url: deviceURL }, { value: data.value }, { new: true });
        }else if(device.type = 'Card Reader'){
            console.log('here');
        }
        

        // Create a new log entry
        const log = new Log({
          deviceName,
          value: data.value,
          owner: device.owner,
        });

        await log.save(); // Save the new log entry to the database
      }
    }

    // next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error('Error fetching and storing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = fetchDataMiddleware;
