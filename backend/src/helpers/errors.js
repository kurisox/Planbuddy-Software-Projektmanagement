
class IdNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "IdNotFoundError";
    }
}

module.exports = {
    IdNotFoundError
}