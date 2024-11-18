const { IdNotFoundError } = require("../helpers/errors");
const { param, body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

exports.createUser = async (request, response) => {

    try {

        await body("USERNAME").trim().not().isEmpty().run(request)
        await body("EMAIL").trim().not().isEmpty().isEmail().run(request)
        await body("PASSWORT").trim().not().isEmpty().isStrongPassword({minlength: 10, minUppercase: 1, minNumbers: 1, minSymbols: 1}).run(request)

        const result = validationResult(request);
        if (!result.isEmpty()) {
            response.status(400).json({ errors: result.array() });
            return;
        }

        const { USERNAME, EMAIL, PASSWORT } = request.body
        // check if user exists
        
        if (await request.model.checkIfEmailIsTaken(EMAIL)) {
            return response.status(409).send("Email is already taken.");
        }


        //Encrypt user password
        encryptedPassword = await bcrypt.hash(PASSWORT, 10)

        //Create User in Database
        const user = await request.model.createUser(USERNAME, EMAIL, encryptedPassword)

        //Create token
        const token = jwt.sign(
            {
                ID_USER: user.ID_USER,
                EMAIL: user.EMAIL
            }, process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        user.TOKEN = token;
        delete user.PASSWORT

        response.status(200).json(user);

    } catch (error) {
        response.status(400).send(error)
    }

}

exports.loginUser = async (request, response) => {

    try {

        await body("EMAIL").trim().not().isEmpty().isEmail().run(request)
        await body("PASSWORT").trim().not().isEmpty().run(request)

        const result = validationResult(request);
        if (!result.isEmpty()) {
            response.status(400).json({ errors: result.array() });
            return;
        }

        const { EMAIL, PASSWORT } = request.body;
        const user = await request.model.findUserByEmail(EMAIL);

        if (user && (await bcrypt.compare(PASSWORT, user.PASSWORT))) {
            const token = jwt.sign(
                {
                    ID_USER: user.ID_USER,
                    EMAIL: user.EMAIL
                },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h"
                }
            )

            user.TOKEN = token
            delete user.PASSWORT

            response.status(200).json(user)
            return
        }
        response.status(400).send("Invalid Credential")
    } catch (error) {
        response.status(400).send(error)
    }
}

exports.getSingle = async (request, response) => {
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    request.model.findUserById(request.params.id).then(userObject => {
        delete userObject.PASSWORT
        response.status(200).json(userObject);
    }).catch(error => {
        response.status(404).json({});
    });
}

exports.getTopUsers = async (request, response) => {
    await param('number').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    request.model.getTopUsers(request.params.number).then(listOfUserObjects => {
        response.status(200).json(listOfUserObjects);
    }).catch(error => {
        response.status(404).json([]);
    });
}

exports.updateUser = async (request, response) => {
    //TODO check if sender has permission to modify this course
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    let userObject
    try {
        userObject = await request.model.findUserById(request.params.id);
    } catch (error) {
        response.status(404).json({});
        return;
    }

    //sanitize input
    body('USERNAME').trim();
    body('ID_STUDIENGANG').toInt();

    userObject.USERNAME = (typeof request.body.USERNAME !== 'undefined') ? request.body.USERNAME : userObject.USERNAME;
    userObject.ID_STUDIENGANG = (typeof request.body.ID_STUDIENGANG !== 'undefined') ? request.body.ID_STUDIENGANG : userObject.ID_STUDIENGANG;


    request.model.updateUser(userObject.ID_USER, userObject.ID_STUDIENGANG, userObject.USERNAME).then(message => {
        delete userObject.PASSWORT;
        response.status(200).json(userObject);
    }).catch(error => {
        response.status(400).json({});
    });
}

exports.deleteUser = async (request, response) => {
    //TODO check if sender has permission to delete this course
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    request.model.deleteUser(request.params.id).then(message => {
        response.status(200).json({});
    }).catch(error => {
        if (error instanceof IdNotFoundError) {
            response.status(404).json({});
        } else {
            response.status(400).json({});
        }
    });
}

exports.getAllUser = async (request, response) => {
    request.model.getAllUsers().then(userArray => {
        response.status(200).json(userArray);
    }).catch(error => {
        response.status(404).json([]);
    });
}
