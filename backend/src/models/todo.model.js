const mariadb = require("../mariadb");
const { IdNotFoundError } = require("../helpers/errors");

exports.findTodoById = (todoID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM AUFGABE WHERE ID_AUFGABE=? LIMIT 1;";
            conn.query(query, [todoID]).then(rows => {
                conn.end();
                (rows.length == 1) ? resolve(rows[0]) : reject(new IdNotFoundError("Can't find a todo with this id!"));
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.getAllTodosForUser = (userID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM AUFGABE JOIN USER_AUFGABE USING(ID_AUFGABE) WHERE USER_AUFGABE.ID_USER=?;";
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

exports.getAllTodos = () => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM AUFGABE;";
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

exports.createTodo = (id_fach, id_besitzer, name, erledigt, workload, datum, typ, notiz, oeffentlich) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            var id_aufgabe;
            const query = "INSERT INTO AUFGABE(ID_FACH, ID_BESITZER , NAME, ERLEDIGT, WORKLOAD, DATUM, TYP, NOTIZ, OEFFENTLICH) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?);";
            conn.query(query, [id_fach, id_besitzer, name, erledigt, workload, datum, typ, notiz, oeffentlich]).then(result => {
                conn.end();
                if (result.affectedRows && result.affectedRows == 1) {
                    id_aufgabe=result.insertId;
                    resolve(this.findTodoById(result.insertId));
                }
            const query = "INSERT INTO USER_AUFGABE(ID_USER,ID_AUFGABE) VALUES(?,?);";
            conn.query(query, [id_besitzer,id_aufgabe]).then(result => {
                conn.end();
                (result.affectedRows && result.affectedRows == 1) ? resolve("Success") : reject("User wasn't connected with his todo!");
            })
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });

}

exports.updateTodo = (id_aufgabe, id_fach, name, erledigt, workload, datum, typ, notiz, oeffentlich) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "UPDATE AUFGABE SET ID_FACH=?, NAME=?, ERLEDIGT=?, WORKLOAD=?, DATUM=?, TYP=?, NOTIZ=?, OEFFENTLICH=? WHERE ID_AUFGABE=? LIMIT 1;";
            conn.query(query, [id_fach, name, erledigt, workload, datum, typ, notiz, oeffentlich, id_aufgabe]).then(result => {
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

exports.deleteTodo = (todoID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "DELETE FROM AUFGABE WHERE ID_AUFGABE=? LIMIT 1;";
            conn.query(query, [todoID]).then(result => {
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

exports.getOwnerId = (todoID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT ID_BESITZER FROM AUFGABE WHERE ID_AUFGABE=? LIMIT 1;";
            conn.query(query, [todoID]).then(rows => {
                conn.end();
                (rows.length == 1) ? resolve(rows[0].ID_BESITZER) : reject("Can't find owner id for this todo.");
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.addUserToTodo = (todoID, userID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "INSERT IGNORE INTO USER_AUFGABE(ID_USER, ID_AUFGABE) VALUES (?, ?);";
            conn.query(query, [userID, todoID]).then(result => {
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

exports.removeUserFromTodo = (todoID, userID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "DELETE FROM USER_AUFGABE WHERE ID_USER=? AND ID_AUFGABE=? LIMIT 1;";
            conn.query(query, [userID, todoID]).then(result => {
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
