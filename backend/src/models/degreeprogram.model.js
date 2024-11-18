const mariadb = require("../mariadb");

exports.getAll = () => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM STUDIENGANG;";
            conn.query(query, []).then(rows => {
                conn.end();
                resolve(rows);
            }).catch(error => {
                reject(error);
            })
        }).catch(error => {
            reject(error);
        })
    });
}

exports.findOneById = (courseID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM STUDIENGANG WHERE ID_STUDIENGANG=? LIMIT 1;";
            conn.query(query, [courseID]).then(rows => {
                conn.end();
                (rows.length == 1) ? resolve(rows[0]) : reject("Can't find degree program with given id");
            }).catch(error => {
                reject(error);
            })
        }).catch(error => {
            reject(error);
        });
    });
}