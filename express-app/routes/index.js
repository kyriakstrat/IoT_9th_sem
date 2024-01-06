// routes/index.js
const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Adjust the path as needed
const session = require('express-session');

// const devicesController = require('../controllers/devicesController');

router.get('/', async (req, res) => {

    const userData = await User.findById(req.session.userId);
    const username = userData.name;
    const devices = [
        { name: 'device1', value: 20 },
        { name: 'device2', value: 15 },
        { name: 'device3', value: 25 },
        { name: 'device1', value: 20 },
        { name: 'device2', value: 15 },
        { name: 'device3', value: 25 },
        { name: 'device1', value: 20 },
        { name: 'device2', value: 15 },
        { name: 'device3', value: 25 },
    ];
    res.render('devices', { title: 'Home',username,devices});
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;
