const { IdNotFoundError } = require("../helpers/errors");
const { param, body, validationResult } = require('express-validator');

exports.getAll = async (request, response) => {
    request.model.getAllTodos().then(todoArray => {
        response.status(200).json(todoArray);
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
    request.model.getAllTodosForUser(request.params.id).then(todoArray => {
        response.status(200).json(todoArray);
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
    request.model.findTodoById(request.params.id).then(todoObject => {
        response.status(200).json(todoObject);
    }).catch(error => {
        response.status(404).json({});
    });
}

exports.createTodo = async (request, response) => {
    await body('NAME').trim().not().isEmpty().run(request);
    await body('OEFFENTLICH').isBoolean().run(request);
    await body('ERLEDIGT').isBoolean().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }

    //sanitize input
    //body('NAME').trim();
    body('OEFFENTLICH').toBoolean();
    body('ERLEDIGT').toBoolean();
    body('ID_FACH').toInt();
    body('WORKLOAD').toInt();
    body('DATUM').trim();
    body('TYP').trim();
    body('NOTIZ').trim();

    var name = request.body.NAME;
    var oeffentlich = request.body.OEFFENTLICH;
    var erledigt = request.body.ERLEDIGT;
    var id_besitzer = request.user.ID_USER;
    var id_fach = (typeof request.body.ID_FACH !== 'undefined') ? request.body.ID_FACH : null;
    var workload = (typeof request.body.WORKLOAD !== 'undefined') ? request.body.WORKLOAD : null;
    var datum = (typeof request.body.DATUM !== 'undefined') ? request.body.DATUM : null;
    var typ = (typeof request.body.TYP !== 'undefined') ? request.body.TYP : null;
    var notiz = (typeof request.body.NOTIZ !== 'undefined') ? request.body.NOTIZ : null;



    request.model.createTodo(id_fach, id_besitzer, name, erledigt, workload, datum, typ, notiz, oeffentlich).then(newTodo => {
        response.status(200).json(newTodo);
    }).catch(error => {
        response.status(400).json({});
    });
}

exports.updateTodo = async (request, response) => {
    //TODO check if sender has permission to modify this todo
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    try {
        const owner = await request.model.getOwnerId(request.params.id);
        /*
        if (request.user.ID_USER != owner) {
            */
            let todoObject
            try {
                todoObject = await request.model.findTodoById(request.params.id);
            } catch (error) {
                response.status(404).json({});
                return;
            }

            //sanitize input
            body('NAME').trim();
            body('OEFFENTLICH').toBoolean();
            body('ERLEDIGT').toBoolean();
            body('ID_FACH').toInt();
            body('WORKLOAD').toInt();
            body('DATUM').trim();
            body('TYP').trim();
            body('NOTIZ').trim();

            todoObject.NAME = (typeof request.body.NAME !== 'undefined') ? request.body.NAME : todoObject.NAME;
            todoObject.OEFFENTLICH = (typeof request.body.OEFFENTLICH !== 'undefined') ? request.body.OEFFENTLICH : todoObject.OEFFENTLICH;
            todoObject.ERLEDIGT = (typeof request.body.ERLEDIGT !== 'undefined') ? request.body.ERLEDIGT : todoObject.ERLEDIGT;
            todoObject.ID_FACH = (typeof request.body.ID_FACH !== 'undefined') ? request.body.ID_FACH : todoObject.ID_FACH;
            todoObject.WORKLOAD = (typeof request.body.WORKLOAD !== 'undefined') ? request.body.WORKLOAD : todoObject.WORKLOAD;
            todoObject.DATUM = (typeof request.body.DATUM !== 'undefined') ? request.body.DATUM : todoObject.DATUM;
            todoObject.TYP = (typeof request.body.TYP !== 'undefined') ? request.body.TYP : todoObject.TYP;
            todoObject.NOTIZ = (typeof request.body.NOTIZ !== 'undefined') ? request.body.NOTIZ : todoObject.NOTIZ;

            request.model.updateTodo(todoObject.ID_AUFGABE, todoObject.ID_FACH, todoObject.NAME, todoObject.ERLEDIGT,
                todoObject.WORKLOAD, todoObject.DATUM, todoObject.TYP, todoObject.NOTIZ, todoObject.OEFFENTLICH).then(message => {
                    response.status(200).json(todoObject);
                }).catch(error => {
                    response.status(400).json({error: error.message});
                });
        /*
        }
        else {
            response.status(400).send("You are not allowed to edit this todo");
        }
        */
    } catch (error) {
        response.status(404).send(error)
    }
}

exports.deleteTodo = async (request, response) => {
    //TODO check if sender has permission to delete this todo
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    try {
        const owner = await request.model.getOwnerId(request.params.id)
        if (request.user.ID_USER == owner) {
            request.model.deleteTodo(request.params.id).then(message => {
                response.status(200).json({});
            }).catch(error => {
                if (error instanceof IdNotFoundError) {
                    response.status(404).json({});
                } else {
                    response.status(400).json({});
                }
            });
        }
        else {
            response.status(400).send("You are not allowed to delete this todo")
        }
    }
    catch (error) {
        response.status(408).send(error)
    }
}

exports.addUser = async (request, response) => {
    await param('todoID').isInt().run(request);
    await body('ID_USER').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        return response.status(400).json({ errors: result.array() });
    }
    //check if provided user is logged in user or admin
    if (request.user.ID_USER != request.body.ID_USER) {
        return response.status(403).json({});
    }
    request.model.findTodoById(request.params.todoID).then(todo => {
        if (todo.OEFFENTLICH == true) {
            request.model.addUserToTodo(request.params.todoID, request.body.ID_USER).then(message => {
                return response.status(200).json({});
            }).catch(error => {
                return response.status(400).json({});
            });
        } else {
            return response.status(403).json({});
        }
    }).catch(error => {
        return response.status(404).json({});
    });
}

exports.removeUser = async (request, response) => {
    await param('todoID').isInt().run(request);
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
    request.model.findTodoById(request.params.todoID).then(todo => {
        //if user is owner of todo, delete todo should be used
        if (todo.ID_BESITZER == request.user.ID_USER) {
            return response.status(403).json({});
        } else {
            request.model.removeUserFromTodo(request.params.todoID, request.params.userID).then(message => {
                response.status(200).json({});
            }).catch(error => {
                response.status(400).json({});
            });
        }
    }).catch(error => {
        return response.status(404).json({});
    });
}