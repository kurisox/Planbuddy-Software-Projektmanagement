var express = require('express');
const dpController = require('../controllers/degreeprogram.controller')

var router = express.Router();

//get all degree programs
router.get('/', dpController.getAll);

//get all details for a specific degree program
router.get('/:id', dpController.getSingle);

module.exports = router;