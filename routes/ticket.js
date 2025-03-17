var express = require('express');
var router = express.Router();
const ticketcontroller = require('../controller/ticket');

/* GET users listing. */
router.post('/create', ticketcontroller.security, ticketcontroller.createUser);
router.get('/read', ticketcontroller.readUser);
router.patch('/update/:id', ticketcontroller.security, ticketcontroller.updateUser);
router.delete('/delete/:id', ticketcontroller.security, ticketcontroller.deleteUser);

module.exports = router;