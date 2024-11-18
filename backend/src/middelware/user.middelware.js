const jwt = require("jsonwebtoken")

const config = process.env

const verifyToken = (request, response, next) => {
    const token =
        request.body.token || request.query.token || request.headers["x-access-token"]
    
    if (!token) {
        return response.status(403).send("A token is required for authentication")
    }

    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY)
        request.user = decoded
    } catch(error) {
        return response.status(401).send("Invalid Token")
    }
    return next();
}

module.exports = verifyToken;