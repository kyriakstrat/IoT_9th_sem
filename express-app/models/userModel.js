// models/userModel.js
const mongoose = require('./db');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  key_reg:{
    type: Boolean,
    required : false,
  },
  devices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
  }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
