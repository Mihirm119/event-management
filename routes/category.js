var express = require('express');
var router = express.Router();
const categorycontroller = require('../controller/category');

/* GET users listing. */
router.post('/create', categorycontroller.createUser);
router.get('/read', categorycontroller.readUser);
router.patch('/update/:id', categorycontroller.updateUser);
router.delete('/delete/:id', categorycontroller.deleteUser);

module.exports = router;
