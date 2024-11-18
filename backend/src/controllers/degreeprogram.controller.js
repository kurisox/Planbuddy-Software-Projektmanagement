const { param, validationResult } = require('express-validator');

exports.getAll = async (request, response) => {
    request.model.getAll().then(dpArray => {
        response.status(200).json(dpArray);
    }).catch(error => {
        response.status(404).json({});
    })
}

exports.getSingle = async (request, response) => {
    await param('id').isInt().run(request);
    const result = validationResult(request);
    if (!result.isEmpty()) {
        response.status(400).json({ errors: result.array() });
        return;
    }
    request.model.findOneById(request.params.id).then(dpObject => {
        response.status(200).json(dpObject);
    }).catch(error => {
        response.status(404).json({});
    })
}