const mariadb = require('mariadb');

let pool;
if (process.env.PRODUCTION == 'true') {
    pool = mariadb.createPool({
        user: process.env.PRODUCTION_DB_USER,
        password: process.env.PRODUCTION_DB_PASSWORD,
        host: process.env.PRODUCTION_DB_HOST,
        port: process.env.PRODUCTION_DB_PORT,
        database: process.env.PRODUCTION_DB_DATABASE,
        sslmode: process.env.PRODUCTION_DB_SSLMODE,
        allowPublicKeyRetrieval: true    
    });

} else {
    pool = mariadb.createPool({
        host: "db",
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB
    });
}

module.exports = {
    getConnection: function () {
        return new Promise(function (resolve, reject) {
            pool.getConnection().then(function (connection) {
                resolve(connection);
            }).catch(function (error) {
                reject(error);
            });
        });
    }
}