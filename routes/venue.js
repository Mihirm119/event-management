var express = require('express');
var router = express.Router();
const venuecontroller = require('../controller/venue');

/* GET users listing. */
router.post('/create', venuecontroller.security, venuecontroller.createUser);
router.get('/read', venuecontroller.readUser);
router.patch('/update/:id', venuecontroller.security, venuecontroller.updateUser);
router.delete('/delete/:id', venuecontroller.security,  venuecontroller.deleteUser);

module.exports = router;