var express = require('express');
const courseController = require("../controllers/course.controller")


var router = express.Router();


//get all courses
router.get('/', courseController.getAll);

//get all courses for a specific user
router.get('/user/:id', courseController.getAllForUser);

//get all details for a specific course
router.get('/:id', courseController.getSingle);

//create new course
router.post('/', courseController.createCourse);

//update course
router.put('/:id', courseController.updateCourse);

//delete course
router.delete('/:id', courseController.deleteCourse);

//add a user to a course
router.post('/:courseID/addUser', courseController.addUser);

//remove a user from a course
router.delete('/:courseID/removeUser/:userID', courseController.removeUser)

module.exports = router;