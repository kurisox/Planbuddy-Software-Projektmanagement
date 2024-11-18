const mariadb = require("../mariadb");
const { IdNotFoundError } = require("../helpers/errors");

exports.findCourseById = (courseID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM FACH WHERE ID_FACH=? LIMIT 1;";
            conn.query(query, [courseID]).then(rows => {
                conn.end();
                (rows.length == 1) ? resolve(rows[0]) : reject("Can't find a course with this id!");
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.getAllCoursesForUser = (userID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM FACH JOIN USER_FACH USING(ID_FACH) WHERE USER_FACH.ID_USER=?;";
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

exports.getAllCourses = () => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "SELECT * FROM FACH;";
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

exports.createCourse = (studiengangID, name, semester, creditpoints) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "INSERT INTO FACH(ID_STUDIENGANG, NAME, SEMESTER, CP) VALUES(?, ?, ?, ?);";
            conn.query(query, [studiengangID, name, semester, creditpoints]).then(result => {
                conn.end();
                if (result.affectedRows && result.affectedRows == 1) {
                    resolve(this.findCourseById(result.insertId));
                }
            }).catch(error => {
                reject(error);
            });
        }).catch(error => {
            reject(error);
        });
    });
}

exports.updateCourse = (courseID, studiengangID, name, semester, creditpoints) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "UPDATE FACH SET ID_STUDIENGANG=?, NAME=?, SEMESTER=?, CP=? WHERE ID_FACH=? LIMIT 1;";
            conn.query(query, [studiengangID, name, semester, creditpoints, courseID]).then(result => {
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

exports.deleteCourse = (courseID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "DELETE FROM FACH WHERE ID_FACH=? LIMIT 1;";
            conn.query(query, [courseID]).then(result => {
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

exports.addUserToCourse = (courseID, userID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "INSERT IGNORE INTO USER_FACH(ID_USER, ID_FACH) VALUES (?, ?);";
            conn.query(query, [userID, courseID]).then(result => {
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

exports.removeUserFromCourse = (courseID, userID) => {
    return new Promise((resolve, reject) => {
        mariadb.getConnection().then(conn => {
            const query = "DELETE FROM USER_FACH WHERE ID_USER=? AND ID_FACH=? LIMIT 1;";
            conn.query(query, [userID, courseID]).then(result => {
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
