var express = require('express');
var router = express.Router();
const purchasecontroller = require('../controller/purchase');

/* GET users listing. */
router.post('/create', purchasecontroller.security, purchasecontroller.createUser);
router.get('/read', purchasecontroller.security, purchasecontroller.readUser);
router.patch('/update/:id', purchasecontroller.security, purchasecontroller.updateUser);
router.delete('/delete/:id', purchasecontroller.security, purchasecontroller.deleteUser);

module.exports = router;