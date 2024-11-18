const dpModel = require('../models/degreeprogram.model');
const csModel = require('../models/course.model');
const todoModel = require('../models/todo.model');
const eventModel = require('../models/event.model');
const userModel = require('../models/user.model')

exports.courseModel = (req, res, next) => {
    req.model = csModel;
    next();
}

exports.todoModel = (req, res, next) => {
    req.model = todoModel;
    next();
}

exports.degreeprogramModel = (req, res, next) => {
    req.model = dpModel;
    next();
}

exports.eventModel =  (req, res, next) => {
    req.model = eventModel;
    next();
}

exports.userModel =  (req, res, next) => {
    req.model = userModel;
    next();
}