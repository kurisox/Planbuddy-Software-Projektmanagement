const { IdNotFoundError } = require("../helpers/errors");
const { param, body, validationResult } = require('express-validator');

exports.getAll = async (request, response) => {
    request.model.getAllEvents().then(events => {
        response.status(200).json(events)
    }).catch(error => {
        response.status(404).json([])
    })
}

exports.getAllPublic = async (request, response) => {
    request.model.getAllPublicEvents().then(events => {
        response.status(200).json(events)
    }).catch(error => {
        response.status(404).json([])
    })
}

exports.getAllForUser = async (request, response) => {
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    request.model.getAllEventsForUser(request.params.id).then(eventArray => {
        response.status(200).json(eventArray);
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
    request.model.findEventById(request.params.id).then(eventObject => {
        response.status(200).json(eventObject);
    }).catch(error => {
        response.status(404).json({});
    });
}

exports.createEvent = async (request, response) => {
    await body('START_DATUM_UHRZEIT').trim().not().isEmpty().run(request);
    await body('END_DATUM_UHRZEIT').trim().not().isEmpty().run(request);
    await body('NAME').trim().not().isEmpty().run(request);
    await body('OEFFENTLICH').isBoolean().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }

    //sanitize input
    body('ID_FACH').toInt();
    body('START_DATUM_UHRZEIT').trim();
    body('END_DATUM_UHRZEIT').trim();
    body('NAME').trim();
    body('TYP').trim();
    body('OEFFENTLICH').toBoolean();
    body('NOTIZ').trim();
    var fachID = (typeof request.body.ID_FACH !== 'undefined') ? request.body.ID_FACH : null;
    var besitzerID = request.user.ID_USER;
    var start_datum_uhrzeit = request.body.START_DATUM_UHRZEIT;
    var end_datum_uhrzeit = request.body.END_DATUM_UHRZEIT;
    var name = request.body.NAME;
    var typ = (typeof request.body.TYP !== 'undefined') ? request.body.TYP : null;
    var oeffentlich = request.body.OEFFENTLICH;
    var notiz = (typeof request.body.NOTIZ !== 'undefined') ? request.body.NOTIZ : null;

    request.model.createEvent(fachID, besitzerID, start_datum_uhrzeit, end_datum_uhrzeit, name, typ, oeffentlich, notiz).then(newEvent => {
        response.status(200).json(newEvent);
    }).catch(error => {
        response.status(400).json({});
    });
}

exports.updateEvent = async (request, response) => {
    //TODO check if sender has permission to modify this event
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    try {
        const owner = await request.model.getOwnerId(request.params.id);
        if (request.user.ID_USER == owner) {
            let eventObject
            try {
                eventObject = await request.model.findEventById(request.params.id);
            } catch (error) {
                response.status(404).json({});
                return;
            }

            //sanitize input
            body('ID_FACH').toInt();
            body('START_DATUM_UHRZEIT').trim();
            body('END_DATUM_UHRZEIT').trim();
            body('NAME').trim();
            body('TYP').trim();
            body('OEFFENTLICH').toBoolean();
            body('NOTIZ').trim();

            eventObject.ID_FACH = (typeof request.body.ID_FACH !== 'undefined') ? request.body.ID_FACH : eventObject.ID_FACH;
            eventObject.START_DATUM_UHRZEIT = (typeof request.body.START_DATUM_UHRZEIT !== 'undefined') ? request.body.START_DATUM_UHRZEIT : eventObject.START_DATUM_UHRZEIT;
            eventObject.END_DATUM_UHRZEIT = (typeof request.body.END_DATUM_UHRZEIT !== 'undefined') ? request.body.END_DATUM_UHRZEIT : eventObject.END_DATUM_UHRZEIT;
            eventObject.NAME = (typeof request.body.NAME !== 'undefined') ? request.body.NAME : eventObject.NAME;
            eventObject.TYP = (typeof request.body.TYP !== 'undefined') ? request.body.TYP : eventObject.TYP;
            eventObject.OEFFENTLICH = (typeof request.body.OEFFENTLICH !== 'undefined') ? request.body.OEFFENTLICH : eventObject.OEFFENTLICH;
            eventObject.NOTIZ = (typeof request.body.NOTIZ !== 'undefined') ? request.body.NOTIZ : eventObject.NOTIZ;

            request.model.updateEvent(eventObject.ID_TERMIN, eventObject.ID_FACH, eventObject.START_DATUM_UHRZEIT, eventObject.END_DATUM_UHRZEIT, eventObject.NAME, eventObject.TYP, eventObject.OEFFENTLICH, eventObject.NOTIZ).then(message => {
                response.status(200).json(eventObject);
            }).catch(error => {
                response.status(400).json({});
            });
        }
        else {
            response.status(400).send("You are not allowed to edit this event");
        }
    }
    catch (error) {
        response.status(404).send(error);
    }
}

exports.deleteEvent = async (request, response) => {
    //TODO check if sender has permission to delete this event
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    try {
        const owner = await request.model.getOwnerId(request.params.id)
        if (request.user.ID_USER == owner) {
            request.model.deleteEvent(request.params.id).then(message => {
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
            response.status(400).send("You are not allowed to delete this event");
        }
    }
    catch (error) {
        response.status(408).send(error);
    }
}

exports.addUser = async (request, response) => {
    await param('eventID').isInt().run(request);
    await body('ID_USER').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        return response.status(400).json({ errors: result.array() });
    }
    //check if provided user is logged in user or admin
    if (request.user.ID_USER != request.body.ID_USER) {
        return response.status(403).json({});
    }
    request.model.findEventById(request.params.eventID).then(event => {
        if (event.OEFFENTLICH == true) {
            request.model.addUserToEvent(request.params.eventID, request.body.ID_USER).then(message => {
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
    await param('eventID').isInt().run(request);
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
    request.model.findEventById(request.params.eventID).then(event => {
        //if user is owner of event, delete event should be used
        if (event.ID_BESITZER == request.user.ID_USER) {
            return response.status(403).json({});
        } else {
            request.model.removeUserFromEvent(request.params.eventID, request.params.userID).then(message => {
                return response.status(200).json({});
            }).catch(error => {
                return response.status(400).json({});
            });
        }
    }).catch(error => {
        return response.status(404).json({});
    });
}