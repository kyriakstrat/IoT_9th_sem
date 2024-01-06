// db.js
const mongoose = require('mongoose');

const DB_URI = 'mongodb+srv://kyriakstrat:ks280101@cluster0.q9zbued.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(DB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

module.exports = mongoose;
