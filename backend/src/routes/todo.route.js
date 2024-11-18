var express = require('express');
const todoController = require('../controllers/todo.controller');

var router = express.Router();

//get all todos
router.get('/', todoController.getAll);

//get all todos for a specific user
router.get('/user/:id', todoController.getAllForUser);

//get all details for a specific todo
router.get('/:id', todoController.getSingle);

//create new todo
router.post('/', todoController.createTodo);

//update todo
router.put('/:id', todoController.updateTodo);

//delete todo
router.delete('/:id', todoController.deleteTodo);

//add a user to a todo
router.post('/:todoID/addUser', todoController.addUser);

//remove a user from a todo
router.delete('/:todoID/removeUser/:userID', todoController.removeUser);

module.exports = router;