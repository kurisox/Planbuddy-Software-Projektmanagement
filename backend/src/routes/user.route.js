var express = require('express');
const userController = require('../controllers/user.controller')

var router = express.Router();

//get all users
router.get('/', userController.getAllUser)

//get profile information
router.get('/:id', userController.getSingle);

//get a list of users with the most xp
router.get('/top/:number', userController.getTopUsers);

//update account
router.put('/:id', userController.updateUser);

//delete account
router.delete('/:id', userController.deleteUser);

module.exports = router;