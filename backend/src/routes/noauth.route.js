var express = require('express');
const userController = require('../controllers/user.controller')

var router = express.Router();

//create account
router.post('/register', userController.createUser )
//login account
router.post('/login', userController.loginUser)

module.exports = router;
