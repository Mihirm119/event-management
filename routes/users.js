var express = require('express');
var router = express.Router();
const usercontroller = require('../controller/user');

/* GET users listing. */
router.post('/create', usercontroller.createUser);
router.post('/login', usercontroller.loginuser);
router.get('/read', usercontroller.security, usercontroller.readUser);
router.patch('/update/:id',usercontroller.security, usercontroller.updateUser);
router.delete('/delete/:id', usercontroller.security,usercontroller.deleteUser);

module.exports = router;