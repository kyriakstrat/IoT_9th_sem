// middleware/fetchDataMiddleware.js
// const fetch = require('node-fetch');
const Device = require('../models/devicemodel');
const Log = require('../models/logModel');
const User = require('../models/userModel');
const Card = require('../models/cardModel');



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
      let dataValue = data.value;

      if (dataValue !== device.value) {
          await Device.findOneAndUpdate({ url: deviceURL }, { value: dataValue }, { new: true });


          if (device.type == 'card reader'){
            if(dataValue != 'None'){
              // console.log('here2')
              const cardReaderOwner = await User.findById(device.owner);
              if (cardReaderOwner && cardReaderOwner.key_reg) {
                //create a new key. 
                const key = await Card.findOne({deviceCode:dataValue})
                
                //deviceName = 'Test', deviceCode = dataValue, owner: device.owner
                // Create a new key entry
                if(!key){
                  const newKey = new Card({
                    deviceName: 'Auth user', // Set the appropriate deviceName
                    deviceCode: dataValue,
                    owner: device.owner,
                });

                await newKey.save();
                console.log('key created');
              }else{
                console.log("Key already exists");
                console.log(key);
              }
              }else{
              // check if there is a key associated with the user in the db. 
              //if there is make a log with value = '{cardName} checked in'
              //else make a log with value = 'unauth user tried to check in'
                // Create a new log entry
                const key = await Card.findOne({deviceCode:dataValue})
                let val;
                if (key){
                  val = key.deviceName;
                }else{
                  val = 'Unauth person';
                }
                console.log(val)
                const log = new Log({
                  deviceName,
                  value: val,
                  owner: device.owner,
                });

                await log.save(); // Save the new log entry to the database
              }
            }
          }else{
            // Create a new log entry for all the other types of sensors
            const log = new Log({
              deviceName,
              value: dataValue,
              owner: device.owner,
            });

            await log.save(); // Save the new log entry to the database

          }

      }
    }

    // next(); // Proceed to the next middleware or route
  } catch (error) {
    console.error('Error fetching and storing data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = fetchDataMiddleware;
