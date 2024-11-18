const { IdNotFoundError } = require("../helpers/errors");
const { param, body, validationResult } = require('express-validator');

exports.getAll = async (request, response) => {
    request.model.getAllCourses().then(courseArray => {
        response.status(200).json(courseArray);
    }).catch(error => {
        response.status(404).json([]);
    });
}

exports.getAllForUser = async (request, response) => {
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    request.model.getAllCoursesForUser(request.params.id).then(courseArray => {
        response.status(200).json(courseArray);
    }).catch(error => {
        response.status(404).json([]);
    });
}

exports.getSingle = async (request, response) => {
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    request.model.findCourseById(request.params.id).then(courseObject => {
        response.status(200).json(courseObject);
    }).catch(error => {
        response.status(404).json({});
    });
}

exports.createCourse = async (request, response) => {
    await body('NAME').trim().not().isEmpty().run(request);
    await body('SEMESTER').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }

    //sanitize input
    body('NAME').trim();
    body('SEMESTER').toInt();
    body('ID_STUDIENGANG').toInt();
    body('CP').toInt();
    var name = request.body.NAME;
    var semester = request.body.SEMESTER;
    var studiengangID = (typeof request.body.ID_STUDIENGANG !== 'undefined') ? request.body.ID_STUDIENGANG : null;
    var creditPoints = (typeof request.body.CP !== 'undefined') ? request.body.CP : null;

    request.model.createCourse(studiengangID, name, semester, creditPoints).then(newCourse => {
        response.status(200).json(newCourse);
    }).catch(error => {
        response.status(400).json({});
    });
}

exports.updateCourse = async (request, response) => {
    //TODO check if sender has permission to modify this course
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    let courseObject
    try {
        courseObject = await request.model.findCourseById(request.params.id);
    } catch (error) {
        response.status(404).json({});
        return;
    }

    //sanitize input
    body('NAME').trim();
    body('SEMESTER').toInt();
    body('ID_STUDIENGANG').toInt();
    body('CP').toInt();

    courseObject.NAME = (typeof request.body.NAME !== 'undefined') ? request.body.NAME : courseObject.NAME;
    courseObject.SEMESTER = (typeof request.body.SEMESTER !== 'undefined') ? request.body.SEMESTER : courseObject.SEMESTER;
    courseObject.ID_STUDIENGANG = (typeof request.body.ID_STUDIENGANG !== 'undefined') ? request.body.ID_STUDIENGANG : courseObject.ID_STUDIENGANG;
    courseObject.CP = (typeof request.body.CP !== 'undefined') ? request.body.CP : courseObject.CP;

    request.model.updateCourse(courseObject.ID_FACH, courseObject.ID_STUDIENGANG, courseObject.NAME, courseObject.SEMESTER, courseObject.CP).then(message => {
        response.status(200).json(courseObject);
    }).catch(error => {
        response.status(400).json({});
    });
}

exports.deleteCourse = async (request, response) => {
    //TODO check if sender has permission to delete this course
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    request.model.deleteCourse(request.params.id).then(message => {
        response.status(200).json({});
    }).catch(error => {
        if (error instanceof IdNotFoundError) {
            response.status(404).json({});
        } else {
            response.status(400).json({});
        }
    });
}

exports.addUser = async (request, response) => {
    await param('courseID').isInt().run(request);
    await body('ID_USER').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        return response.status(400).json({ errors: result.array() });
    }
    //check if provided user is logged in user or admin
    if (request.user.ID_USER != request.body.ID_USER) {
        return response.status(403).json({});
    }
    request.model.findCourseById(request.params.courseID).catch(error => {
        return response.status(404).json({});
    });
    request.model.addUserToCourse(request.params.courseID, request.body.ID_USER).then(message => {
        response.status(200).json({});
    }).catch(error => {
        console.log(error);
        response.status(400).json({});
    });
}

exports.removeUser = async (request, response) => {
    await param('courseID').isInt().run(request);
    await param('userID').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    //check if provided user is logged in user or admin
    if (request.user.ID_USER != request.params.userID) {
        return response.status(403).json({});
    }
    request.model.findCourseById(request.params.courseID).catch(error => {
        return response.status(404).json({});
    });
    request.model.removeUserFromCourse(request.params.courseID, request.params.userID).then(message => {
        response.status(200).json({});
    }).catch(error => {
        console.log(error);
        response.status(400).json({});
    });
}