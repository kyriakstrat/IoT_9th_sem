// models/device.js

const mongoose = require('./db');

const deviceSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value:{
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  value:{
    type: String,
    required: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
