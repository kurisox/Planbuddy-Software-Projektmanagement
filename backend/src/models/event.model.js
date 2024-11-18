const mariadb = require("../mariadb");
const { IdNotFoundError } = require("../helpers/errors");

exports.getAllEvents = () => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM TERMIN;";
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

exports.getAllPublicEvents = () => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM TERMIN WHERE OEFFENTLICH=1;";
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

exports.getAllEventsForUser = (userID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM TERMIN JOIN TERMIN_USER USING(ID_TERMIN) WHERE TERMIN_USER.ID_USER=?;";
            conn.query(query, [userID]).then(rows => {
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

exports.findEventById = (eventID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM TERMIN WHERE ID_TERMIN=? LIMIT 1;";
            conn.query(query, [eventID]).then(rows => {
                conn.end();
                (rows.length == 1) ? resolve(rows[0]) : reject("Can't find an event with this id!");
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.createEvent = (fachID, besitzerID, start_datum_uhrzeit, end_datum_uhrzeit, name, typ, oeffentlich, notiz) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            var id_termin;
            const query = "INSERT INTO TERMIN(ID_FACH, ID_BESITZER, START_DATUM_UHRZEIT, END_DATUM_UHRZEIT, NAME, TYP, OEFFENTLICH, NOTIZ) VALUES(?, ?, ?, ?, ?, ?, ?, ?);";
            conn.query(query, [fachID, besitzerID, start_datum_uhrzeit, end_datum_uhrzeit, name, typ, oeffentlich, notiz]).then(result => {
                conn.end();
                if (result.affectedRows && result.affectedRows == 1) {
                    id_termin=result.insertId;
                    resolve(this.findEventById(result.insertId));
                }
            const query = "INSERT INTO TERMIN_USER(ID_USER,ID_TERMIN) VALUES(?,?);";
            conn.query(query, [besitzerID,id_termin]).then(result => {
                conn.end();
                (result.affectedRows && result.affectedRows == 1) ? resolve("Success") : reject("User wasn't connected to his event!");
            })
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.updateEvent = (eventID, fachID, start_datum_uhrzeit, end_datum_uhrzeit, name, typ, oeffentlich, notiz) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "UPDATE TERMIN SET ID_FACH=?, START_DATUM_UHRZEIT=?, END_DATUM_UHRZEIT=?, NAME=?, TYP=?, OEFFENTLICH=?, NOTIZ=? WHERE ID_TERMIN=? LIMIT 1;";
            conn.query(query, [fachID, start_datum_uhrzeit, end_datum_uhrzeit, name, typ, oeffentlich, notiz, eventID]).then(result => {
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

exports.deleteEvent = (eventID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "DELETE FROM TERMIN WHERE ID_TERMIN=? LIMIT 1;";
            conn.query(query, [eventID]).then(result => {
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

exports.getOwnerId = (eventID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT ID_BESITZER FROM TERMIN WHERE ID_TERMIN=? LIMIT 1;";
            conn.query(query, [eventID]).then(rows => {
                conn.end();
                (rows.length == 1) ? resolve(rows[0].ID_BESITZER) : reject("Can't find an owner id for this event.");
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.addUserToEvent = (eventID, userID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "INSERT IGNORE INTO TERMIN_USER(ID_USER, ID_TERMIN) VALUES (?, ?);";
            conn.query(query, [userID, eventID]).then(result => {
                conn.end();
                (result.affectedRows && result.affectedRows == 1) ? resolve() : reject(new Error("Nothing was added!"));
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.removeUserFromEvent = (eventID, userID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "DELETE FROM TERMIN_USER WHERE ID_USER=? AND ID_TERMIN=? LIMIT 1;";
            conn.query(query, [userID, eventID]).then(result => {
                conn.end();
                (result.affectedRows && result.affectedRows == 1) ? resolve() : reject(new Error("Nothing was removed!"));
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}
