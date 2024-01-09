// models/device.js

const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
