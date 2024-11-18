const mariadb = require("../mariadb");
const { IdNotFoundError } = require("../helpers/errors");

exports.createUser = (username, email , password) => {
    return new Promise( (resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "INSERT INTO USER(USERNAME, EMAIL, PASSWORT) VALUES(?, ?, ?);";
            conn.query(query, [username, email, password]).then(result => {
                conn.end();
                if (result.affectedRows && result.affectedRows == 1) {
                    resolve(this.findUserById(result.insertId));
                }
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        })
    })
}

exports.findUserById = (userID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM USER WHERE ID_USER=? LIMIT 1;";
            conn.query(query, [userID]).then(rows => {
                conn.end();
                (rows.length == 1) ? resolve(rows[0]) : reject("Can't find a user with this id!");
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM USER WHERE EMAIL=? LIMIT 1;";
            conn.query(query, [email]).then(rows => {
                conn.end();
                (rows.length == 1) ? resolve(rows[0]) : reject("Can't find a user with this email!");
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}


exports.checkIfEmailIsTaken = (email) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM USER WHERE EMAIL=? LIMIT 1;";
            conn.query(query, [email]).then(rows => {
                conn.end();
                (rows.length == 1) ? resolve(true) : resolve(false);
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.getTopUsers = (number) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = `SELECT ID_USER, ID_STUDIENGANG, USERNAME, XP FROM USER ORDER BY XP DESC LIMIT ${number};`;
            conn.query(query, []).then(rows => {
                conn.end();
                (rows.length != 0) ? resolve(rows) : reject("No Top List aviable in database");
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.updateUser = (userID, studiengangID, username) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "UPDATE USER SET ID_STUDIENGANG=?, USERNAME=? WHERE ID_USER=? LIMIT 1;";
            conn.query(query, [studiengangID, username, userID]).then(result => {
                conn.end();
                (result.affectedRows && result.affectedRows == 1) ? resolve("Success") : reject("Nothing was updated!");
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.deleteUser = (userID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "DELETE FROM USER WHERE ID_USER=? LIMIT 1;";
            conn.query(query, [userID]).then(result => {
                conn.end();
                (result.affectedRows && result.affectedRows == 1) ? resolve() : reject(new IdNotFoundError("Nothing was deleted!"));
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT ID_USER, ID_STUDIENGANG, USERNAME, EMAIL, XP, ROLLE FROM USER;";
            conn.query(query, []).then(rows => {
                conn.end();
                resolve(rows);
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

