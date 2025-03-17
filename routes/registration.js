var express = require('express');
var router = express.Router();
const registrationcontroller = require('../controller/registration');

/* GET users listing. */
router.post('/create',registrationcontroller.security, registrationcontroller.createUser);
router.get('/read', registrationcontroller.security, registrationcontroller.readUser);
router.patch('/update/:id', registrationcontroller.security,registrationcontroller.updateUser);
router.delete('/delete/:id', registrationcontroller.security,registrationcontroller.deleteUser);

module.exports = router;