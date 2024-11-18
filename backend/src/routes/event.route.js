var express = require('express');
const eventController = require('../controllers/event.controller')

var router = express.Router();

//get all events
router.get('/', eventController.getAll);

router.get('/public', eventController.getAllPublic);

//get all events for a specific user
router.get('/user/:id', eventController.getAllForUser);

//get all details for a specific event
router.get('/:id', eventController.getSingle);

//create new event for personal calendar
router.post('/', eventController.createEvent);

//update event
router.put('/:id', eventController.updateEvent);

//delete event
router.delete('/:id', eventController.deleteEvent);

//add a user to a event
router.post('/:eventID/addUser', eventController.addUser);

//remove a user from a event
router.delete('/:eventID/removeUser/:userID', eventController.removeUser);

module.exports = router;