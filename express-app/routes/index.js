// routes/index.js
const express = require('express');
const router = express.Router();
// const devicesController = require('../controllers/devicesController');


router.get('/', (req, res) => {
    const username = req.user ? req.user.username : 'Guest';
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

module.exports = router;
