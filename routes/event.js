var express = require('express');
var router = express.Router();
const eventcontroller = require('../controller/event');

/* GET users listing. */
router.post('/create', eventcontroller.security, eventcontroller.createUser);
router.get('/read', eventcontroller.readUser);
router.patch('/update/:id', eventcontroller.security, eventcontroller.updateUser);
router.delete('/delete/:id', eventcontroller.security, eventcontroller.deleteUser);

module.exports = router;
