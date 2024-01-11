// models/cardModel.js

const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  deviceName: {
    type: String,
    required: true,
  },
  deviceCode:{
    type: String,
    required: true,
  },
  deviceValue:{
    type: String,
    required: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
});

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
