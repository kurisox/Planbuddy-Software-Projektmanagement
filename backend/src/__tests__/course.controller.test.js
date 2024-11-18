const request = require('supertest');
const express = require('express')
var courseRouter = require('../routes/course.route');
const { IdNotFoundError } = require("../helpers/errors");

// mock database access functions
const getAllCourses = jest.fn()
const findCourseById = jest.fn()
const getAllCoursesForUser = jest.fn()
const createCourse = jest.fn()
const updateCourse = jest.fn()
const deleteCourse = jest.fn()
const courseModel = {
    getAllCourses,
    findCourseById,
    getAllCoursesForUser,
    createCourse,
    updateCourse,
    deleteCourse
}

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// use mock function as middelware
app.use('/course', (req, res, next) => {
    req.model = courseModel;
    next();
})
// course routes
app.use('/course', courseRouter)

describe("GET /course ", () => {

    beforeEach(() => {
        getAllCourses.mockReset()
        getAllCourses.mockResolvedValue(0)
    })

    describe("sucessful response", () => {

        test("should respond with 200 status code", (done) => {
            request(app)
                .get('/course')
                .expect(200, done)
        })

        test("should specify json in the content-type response header", (done) => {
            request(app)
                .get('/course')
                .then((response) => {
                    expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
                    done()
                })
        })

        test("should respond with all courses in body", async () => {
            const data = [
                { "ID_FACH": 1, "ID_STUDIENGANG": 1, "NAME": "Einfuehrung in die Informatik", "SEMESTER": 1, "CP": 5 },
                { "ID_FACH": 2, "ID_STUDIENGANG": 1, "NAME": "Mathe fuer Informatiker 1", "SEMESTER": 1, "CP": 8 },
                { "ID_FACH": 3, "ID_STUDIENGANG": 1, "NAME": "Objektorientierte Programmierung", "SEMESTER": 1, "CP": 7 },
                { "ID_FACH": 4, "ID_STUDIENGANG": 2, "NAME": "Programmierung mit Skriptsprachen", "SEMESTER": 1, "CP": 5 },
                { "ID_FACH": 5, "ID_STUDIENGANG": 2, "NAME": "Technische Informatik", "SEMESTER": 1, "CP": 5 }
            ]
            getAllCourses.mockResolvedValue(data)
            const response = await request(app).get('/course')
            expect(getAllCourses.mock.calls.length).toBe(1)
            expect(response.body).toEqual(data)

        })

    })

    describe("unsuccesful respond", () => {

        test("error in database, should respond with 404 status code", (done) => {
            getAllCourses.mockRejectedValue("Error")
            request(app)
                .get('/course')
                .expect(404, done)
        })

        test("error in database, should respond with empty list in response body", (done) => {
            getAllCourses.mockRejectedValue("Error")
            request(app)
                .get('/course')
                .then((response) => {
                    expect(response.body).toEqual([])
                    done()
                })
        })
    })

})

describe("GET /course/user/:id", () => {

    beforeEach(() => {
        getAllCoursesForUser.mockReset()
        getAllCoursesForUser.mockResolvedValue(0)
    })

    describe("successful respond", () => {

        test("should request the query in database with correct id", async () => {
            const id = "1";
            const data = [
                { "ID_FACH": 1, "ID_STUDIENGANG": 1, "NAME": "Einfuehrung in die Informatik", "SEMESTER": 1, "CP": 5 },
                { "ID_FACH": 2, "ID_STUDIENGANG": 1, "NAME": "Mathe fuer Informatiker 1", "SEMESTER": 1, "CP": 8 },
                { "ID_FACH": 3, "ID_STUDIENGANG": 1, "NAME": "Objektorientierte Programmierung", "SEMESTER": 1, "CP": 7 },
            ]
            getAllCoursesForUser.mockResolvedValue(data)
            await request(app).get(`/course/user/${id}`)
            expect(getAllCoursesForUser.mock.calls.length).toBe(1)
            expect(getAllCoursesForUser.mock.calls[0][0]).toBe(id)

        })

        test("should respond with the correct data in body", async () => {
            const id = "1";
            const data = [
                { "ID_FACH": 1, "ID_STUDIENGANG": 1, "NAME": "Einfuehrung in die Informatik", "SEMESTER": 1, "CP": 5 },
                { "ID_FACH": 2, "ID_STUDIENGANG": 1, "NAME": "Mathe fuer Informatiker 1", "SEMESTER": 1, "CP": 8 },
                { "ID_FACH": 3, "ID_STUDIENGANG": 1, "NAME": "Objektorientierte Programmierung", "SEMESTER": 1, "CP": 7 },
            ]
            getAllCoursesForUser.mockResolvedValue(data)
            const response = await request(app).get(`/course/user/${id}`)
            expect(response.body).toEqual(data)
        })

        test("should respond with a 200 status code", async () => {
            const id = "1";
            const data = [
                { "ID_FACH": 1, "ID_STUDIENGANG": 1, "NAME": "Einfuehrung in die Informatik", "SEMESTER": 1, "CP": 5 },
                { "ID_FACH": 2, "ID_STUDIENGANG": 1, "NAME": "Mathe fuer Informatiker 1", "SEMESTER": 1, "CP": 8 },
                { "ID_FACH": 3, "ID_STUDIENGANG": 1, "NAME": "Objektorientierte Programmierung", "SEMESTER": 1, "CP": 7 },
            ]
            getAllCoursesForUser.mockResolvedValue(data)
            const response = await request(app).get(`/course/user/${id}`)
            expect(response.statusCode).toBe(200)
        })

        test("should specify json as content-type in response header", async () => {
            const id = "1";
            const data = [
                { "ID_FACH": 1, "ID_STUDIENGANG": 1, "NAME": "Einfuehrung in die Informatik", "SEMESTER": 1, "CP": 5 },
                { "ID_FACH": 2, "ID_STUDIENGANG": 1, "NAME": "Mathe fuer Informatiker 1", "SEMESTER": 1, "CP": 8 },
                { "ID_FACH": 3, "ID_STUDIENGANG": 1, "NAME": "Objektorientierte Programmierung", "SEMESTER": 1, "CP": 7 },
            ]
            getAllCoursesForUser.mockResolvedValue(data)
            const response = await request(app).get(`/course/user/${id}`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/course/user/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

        test("wrong id type should respond with error object in body", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/course/user/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })
        test("id not found in database should respond with 404 status code", async () => {
            const id = "111111000"
            getAllCoursesForUser.mockRejectedValue("Error")
            const response = await request(app).get(`/course/user/${id}`)
            expect(response.statusCode).toBe(404)
        })
        test("id not found in database should respond with empty list in body", async () => {
            const id = "111111000"
            getAllCoursesForUser.mockRejectedValue("Error")
            const response = await request(app).get(`/course/user/${id}`)
            expect(response.body).toEqual([])
        })
    })
})

describe("GET /course/:id", () => {

    beforeEach(() => {
        findCourseById.mockReset()
        findCourseById.mockResolvedValue(0)
    })

    describe("successful response", () => {

        test("should request the query in database with correct id", async () => {
            const id = "1";


            await request(app).get(`/course/${id}`)
            expect(findCourseById.mock.calls.length).toBe(1)
            expect(findCourseById.mock.calls[0][0]).toBe(id)

        })

        test("should respond with the correct data in body", async () => {
            const id = "1";
            const data = {
                "ID_FACH": 1,
                "ID_STUDIENGANG": 1,
                "NAME": "Einfuehrung in die Informatik",
                "SEMESTER": 1,
                "CP": 5
            }
            findCourseById.mockResolvedValue(data)
            const response = await request(app).get(`/course/${id}`)
            expect(response.body).toEqual(data)
        })

        test("should respond with a 200 status code", async () => {
            const id = "1";
            const data = {
                "ID_FACH": 1,
                "ID_STUDIENGANG": 1,
                "NAME": "Einfuehrung in die Informatik",
                "SEMESTER": 1,
                "CP": 5
            }
            findCourseById.mockResolvedValue(data)
            const response = await request(app).get(`/course/${id}`)
            expect(response.statusCode).toBe(200)
        })

        test("should specify json as content-type in response header", async () => {
            const id = "1";
            const data = {
                "ID_FACH": 1,
                "ID_STUDIENGANG": 1,
                "NAME": "Einfuehrung in die Informatik",
                "SEMESTER": 1,
                "CP": 5
            }
            findCourseById.mockResolvedValue(data)
            const response = await request(app).get(`/course/${id}`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })


    })

    describe("unsuccesful response", () => {
        test("wrong id type should respond with 400 status code", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/course/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

        test("wrong id type should respond with error object in body", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/course/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })
        test("id not found in database should respond with 404 status code", async () => {
            const id = "111111000"
            findCourseById.mockRejectedValue("Error")
            const response = await request(app).get(`/course/${id}`)
            expect(response.statusCode).toBe(404)
        })
        test("id not found in database should respond with empty list in body", async () => {
            const id = "111111000"
            findCourseById.mockRejectedValue("Error")
            const response = await request(app).get(`/course/${id}`)
            expect(response.body).toEqual({})
        })
    })

})

describe("POST /course", () => {

    beforeEach(() => {
        createCourse.mockReset()
        createCourse.mockResolvedValue(0)
    })


    describe("successful response", () => {

        test("should save the correct data to the database", async () => {
            const bodyData = [
                { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 },
                { ID_STUDIENGANG: 2, NAME: "Webentwicklung", SEMESTER: 4, CP: 5 },
                { ID_STUDIENGANG: 3, NAME: "Theoretische Informatik", SEMESTER: 3, CP: 5 }

            ]

            for (const body of bodyData) {
                createCourse.mockReset()
                createCourse.mockResolvedValue(0)
                await request(app).post('/course').send(body)
                expect(createCourse.mock.calls.length).toBe(1)
                expect(createCourse.mock.calls[0][0]).toBe(body.ID_STUDIENGANG)
                expect(createCourse.mock.calls[0][1]).toBe(body.NAME)
                expect(createCourse.mock.calls[0][2]).toBe(body.SEMESTER)
                expect(createCourse.mock.calls[0][3]).toBe(body.CP)
            }

        })

        test("should save correct data to the database with (only required types)", async () => {
            const bodyData = [
                { NAME: "Systemprogrammierung", SEMESTER: 3 },
                { NAME: "Webentwicklung", SEMESTER: 4 },
                { NAME: "Theoretische Informatik", SEMESTER: 3 }

            ]

            for (const body of bodyData) {
                createCourse.mockReset()
                createCourse.mockResolvedValue(0)
                await request(app).post('/course').send(body)
                expect(createCourse.mock.calls.length).toBe(1)
                expect(createCourse.mock.calls[0][0]).toBe(null)
                expect(createCourse.mock.calls[0][1]).toBe(body.NAME)
                expect(createCourse.mock.calls[0][2]).toBe(body.SEMESTER)
                expect(createCourse.mock.calls[0][3]).toBe(null)
            }
        })

        test("should respond with a user object", async () => {
            const bodyData = [
                { NAME: "Systemprogrammierung", SEMESTER: 3 },
                { NAME: "Webentwicklung", SEMESTER: 4 },
                { NAME: "Theoretische Informatik", SEMESTER: 3 }
            ]

            for (const body of bodyData) {
                createCourse.mockReset()
                createCourse.mockResolvedValue(body)
                const response = await request(app).post('/course').send(body)
                expect(response.body).toBeDefined()
            }
        })

        test("should specify json in the content-type response header", async () => {
            const body = { NAME: "Systemprogrammierung", SEMESTER: 4 }
            const response = await request(app).post('/course').send(body)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })

        test("should save the correct data to the database", async () => {
            const bodyData = [
                { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 },
                { ID_STUDIENGANG: 2, NAME: "Webentwicklung", SEMESTER: 4, CP: 5 },
                { NAME: "Theoretische Informatik", SEMESTER: 3 }

            ]

            for (const body of bodyData) {
                createCourse.mockReset()
                createCourse.mockResolvedValue(0)
                const response = await request(app).post('/course').send(body)
                expect(response.statusCode).toBe(200)
            }

        })

        test("should respond with course id and requested attributes", async () => {
            const body = [
                { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 },
                { ID_STUDIENGANG: 2, NAME: "Webentwicklung", SEMESTER: 4, CP: 5 },
                { NAME: "Theoretische Informatik", SEMESTER: 3 }

            ]

            const returnValueData = [
                { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 },
                { ID_FACH: 2, ID_STUDIENGANG: 2, NAME: "Webentwicklung", SEMESTER: 4, CP: 5 },
                { ID_FACH: 3, ID_STUDIENGANG: null, NAME: "Theoretische Informatik", SEMESTER: 3, CP: null }
            ]

            for (let i = 0; i < body.length; i++) {
                createCourse.mockReset()
                createCourse.mockResolvedValue(returnValueData[i])
                const response = await request(app).post('/course').send(body[i])
                expect(response.body.ID_FACH).toBeDefined();
                expect(response.body.ID_STUDIENGANG).toBeDefined();
                expect(response.body.NAME).toBeDefined();
                expect(response.body.SEMESTER).toBeDefined();
                expect(response.body.CP).toBeDefined();
            }

        })
    })

    describe("unsuccessful response", () => {

        test("wrong types in the json request object should respond with 400 status code ", (done) => {
            const bodyData = [
                { ID_STUDIENGANG: 1, NAME: "hello", SEMESTER: "*", CP: 7 },
                { ID_STUDIENGANG: 2, NAME: "Webentwicklung", SEMESTER: "WISE", CP: 5 },
                { NAME: "Theoretische Informatik", SEMESTER: "four" }

            ]
            for (const body of bodyData) {
                request(app)
                    .post('/course')
                    .send(body)
                    .expect(400, done)
            }
        })


        test("wrong id type should respond with error object in body", async () => {
            const bodyData = [
                { ID_STUDIENGANG: 1, NAME: "hello", SEMESTER: "*", CP: 7 },
                { ID_STUDIENGANG: 2, NAME: "Webentwicklung", SEMESTER: "WISE", CP: 5 },
                { NAME: "Theoretische Informatik", SEMESTER: "four" }

            ]
            for (const body of bodyData) {
                const response = await request(app).post('/course')
                expect(response.body.errors).toBeDefined()
            }
        })

        test("database error should respond with 400 error code", async () => {
            const bodyData = [
                { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 },
                { ID_STUDIENGANG: 2, NAME: "Webentwicklung", SEMESTER: 4, CP: 5 },
                { NAME: "Theoretische Informatik", SEMESTER: 3 }

            ]

            for (const body of bodyData) {
                createCourse.mockReset()
                createCourse.mockRejectedValue("Error")
                const response = await request(app).post('/course').send(body)
                expect(response.statusCode).toBe(400)
            }

        })

        test("database error should respond with empty json body", async () => {
            const bodyData = [
                { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 },
                { ID_STUDIENGANG: 2, NAME: "Webentwicklung", SEMESTER: 4, CP: 5 },
                { NAME: "Theoretische Informatik", SEMESTER: 3 }

            ]

            for (const body of bodyData) {
                createCourse.mockReset()
                createCourse.mockRejectedValue("Error")
                const response = await request(app).post('/course').send(body)
                expect(response.body).toEqual({})
            }

        })

    })
})

describe("PUT /course", () => {

    beforeEach(() => {
        updateCourse.mockReset()
        findCourseById.mockReset()
        updateCourse.mockRejectedValue(0)
        findCourseById.mockRejectedValue(0)
    })

    describe("successful respond", () => {

        test("should save the correct data to the database", async () => {
            const body = [
                { ID_STUDIENGANG: 3, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 8 },
                { ID_STUDIENGANG: 6, NAME: "Webentwicklung", SEMESTER: 4, CP: 4 },
                { ID_STUDIENGANG: 0, NAME: "Theoretische Informatik", SEMESTER: 3, CP: 6 },
            ]


            const foundCourses = [
                { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 },
                { ID_FACH: 2, ID_STUDIENGANG: 2, NAME: "Webentwicklung", SEMESTER: 4, CP: 5 },
                { ID_FACH: 3, ID_STUDIENGANG: 3, NAME: "Theoretische Informatik", SEMESTER: 3, CP: 5 }
            ]

            for (let i = 0; i < body.length; i++) {
                findCourseById.mockReset()
                findCourseById.mockResolvedValue(foundCourses[i])
                updateCourse.mockReset()
                updateCourse.mockResolvedValue(body)
                await request(app).put(`/course/${i + 1}`).send(body[i])
                expect(updateCourse.mock.calls.length).toBe(1)
                expect(findCourseById.mock.calls.length).toBe(1)
                expect(updateCourse.mock.calls[0][0]).toBe(foundCourses[i].ID_FACH)
                expect(updateCourse.mock.calls[0][1]).toBe(body[i].ID_STUDIENGANG)
                expect(updateCourse.mock.calls[0][2]).toBe(body[i].NAME)
                expect(updateCourse.mock.calls[0][3]).toBe(body[i].SEMESTER)
                expect(updateCourse.mock.calls[0][4]).toBe(body[i].CP)
            }

        })

        test("should save the correct data to the database (only the send attribute changes)", async () => {
            const body = [
                { ID_STUDIENGANG: 3, NAME: "Systemprogrammierung" },
                { ID_STUDIENGANG: 6, NAME: "Webentwicklung" },
                { ID_STUDIENGANG: 0, NAME: "Theoretische Informatik" },
            ]


            const foundCourses = [
                { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 },
                { ID_FACH: 2, ID_STUDIENGANG: 2, NAME: "Webentwicklung", SEMESTER: 4, CP: 5 },
                { ID_FACH: 3, ID_STUDIENGANG: 3, NAME: "Theoretische Informatik", SEMESTER: 3, CP: 5 }
            ]

            for (let i = 0; i < body.length; i++) {
                findCourseById.mockReset()
                findCourseById.mockResolvedValue(foundCourses[i])
                updateCourse.mockReset()
                updateCourse.mockResolvedValue(body)
                await request(app).put(`/course/${i + 1}`).send(body[i])
                expect(updateCourse.mock.calls.length).toBe(1)
                expect(findCourseById.mock.calls.length).toBe(1)
                expect(updateCourse.mock.calls[0][0]).toBe(foundCourses[i].ID_FACH)
                expect(updateCourse.mock.calls[0][1]).toBe(body[i].ID_STUDIENGANG)
                expect(updateCourse.mock.calls[0][2]).toBe(body[i].NAME)
                expect(updateCourse.mock.calls[0][3]).toBe(foundCourses[i].SEMESTER)
                expect(updateCourse.mock.calls[0][4]).toBe(foundCourses[i].CP)
            }

        })

        test("should respond with courseObject", async () => {
            const body = [
                { ID_STUDIENGANG: 3, NAME: "Systemprogrammierung" },
                { ID_STUDIENGANG: 6, NAME: "Webentwicklung" },
                { ID_STUDIENGANG: 0, NAME: "Theoretische Informatik" },
            ]


            const foundCourses = [
                { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 },
                { ID_FACH: 2, ID_STUDIENGANG: 2, NAME: "Webentwicklung", SEMESTER: 4, CP: 5 },
                { ID_FACH: 3, ID_STUDIENGANG: 3, NAME: "Theoretische Informatik", SEMESTER: 3, CP: 5 }
            ]

            for (let i = 0; i < body.length; i++) {
                findCourseById.mockReset()
                findCourseById.mockResolvedValue(foundCourses[i])
                updateCourse.mockReset()
                updateCourse.mockResolvedValue(body)
                const response = await request(app).put(`/course/${i + 1}`).send(body[i])
                expect(response.body).toBeDefined()
            }
        })

        test("should respond with the updated course attributes", async () => {
            const id = 1
            const body = { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung 1", SEMESTER: 4 }


            const foundCourses = { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 }

            const returnValue = { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung 1", SEMESTER: 4, CP: 7 }



            findCourseById.mockResolvedValue(foundCourses)
            updateCourse.mockResolvedValue(returnValue)
            const response = await request(app).put(`/course/${id}`).send(body)
            expect(response.body.ID_FACH).toBe(id)
            expect(response.body.ID_STUDIENGANG).toBe(body.ID_STUDIENGANG)
            expect(response.body.NAME).toBe(body.NAME)
            expect(response.body.SEMESTER).toBe(body.SEMESTER)
            expect(response.body.CP).toBe(foundCourses.CP)
        })

        test("should respond with 200 status code", async () => {
            const id = 1
            const body = { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung 1", SEMESTER: 4 }


            const foundCourses = { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 }

            findCourseById.mockResolvedValue(foundCourses)
            updateCourse.mockResolvedValue(0)
            const response = await request(app).put(`/course/${id}`).send(body)
            expect(response.statusCode).toBe(200)
        })
        test("should specify json as content-type in respone header", async () => {
            const id = 1
            const body = { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung 1", SEMESTER: 4 }


            const foundCourses = { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 }

            findCourseById.mockResolvedValue(foundCourses)
            updateCourse.mockResolvedValue(0)
            const response = await request(app).put(`/course/${id}`).send(body)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const id = "aa"
            const body = { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung 1", SEMESTER: 4 }


            const foundCourses = { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 }
            findCourseById.mockResolvedValue(foundCourses)
            updateCourse.mockResolvedValue(0)
            const response = await request(app).put(`/course/${id}`).send(body)
            expect(response.statusCode).toBe(400)
        })

        test("wrong id type should respond with 400 status code", async () => {
            const id = "aa"
            const body = { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung 1", SEMESTER: 4 }


            const foundCourses = { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 }
            findCourseById.mockResolvedValue(foundCourses)
            updateCourse.mockResolvedValue(0)
            const response = await request(app).put(`/course/${id}`).send(body)
            expect(response.body.errors).toBeDefined()
        })

        test("id not found in database should respond with 404 status code", async () => {
            const id = "11111000"
            const body = { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung 1", SEMESTER: 4 }


            const foundCourses = { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 }
            findCourseById.mockRejectedValue("Error")
            updateCourse.mockResolvedValue(0)
            const response = await request(app).put(`/course/${id}`).send(body)
            expect(response.statusCode).toBe(404)
        })

          test("id not found in database should respond with empty json", async () => {
            const id = "11111000"
            const body = { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung 1", SEMESTER: 4 }


            const foundCourses = { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 }
            findCourseById.mockRejectedValue("Error")
            updateCourse.mockResolvedValue(0)
            const response = await request(app).put(`/course/${id}`).send(body)
            expect(response.body).toEqual({})
        })

        test("error when updating the course in database should respond with 400 status code", async () => {
            const id = "11111000"
            const body = { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung 1", SEMESTER: 4 }


            const foundCourses = { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 }
            findCourseById.mockResolvedValue(foundCourses)
            updateCourse.mockRejectedValue("Error")
            const response = await request(app).put(`/course/${id}`).send(body)
            expect(response.statusCode).toBe(400)
        })


        test("error when updating the course in database should respond empty json", async () => {
            const id = "11111000"
            const body = { ID_STUDIENGANG: 1, NAME: "Systemprogrammierung 1", SEMESTER: 4 }


            const foundCourses = { ID_FACH: 1, ID_STUDIENGANG: 1, NAME: "Systemprogrammierung", SEMESTER: 3, CP: 7 }
            findCourseById.mockResolvedValue(foundCourses)
            updateCourse.mockRejectedValue("Error")
            const response = await request(app).put(`/course/${id}`).send(body)
            expect(response.body).toEqual({})
        })
    })
})

describe("DELETE /course", () => {

    beforeEach( () => {
        deleteCourse.mockReset
        deleteCourse.mockResolvedValue(0)
    })
    describe("successful respond", () => {

        test("course should be deleted in the database", async () => {
            const idData = [ 1, 10, 11000, 123]
            for (const id of idData) {
                deleteCourse.mockReset()
                deleteCourse.mockResolvedValue(0)
                await request(app).delete(`/course/${id}`)
                expect(deleteCourse.mock.calls.length).toBe(1)
                expect(deleteCourse.mock.calls[0][0]).toBe(id.toString())
            }
        })

        test("should respond with 200 status code", async () => {
            const idData = [ 1, 10, 11000, 123]
            for (const id of idData) {
                deleteCourse.mockReset()
                deleteCourse.mockResolvedValue(0)
                const response = await request(app).delete(`/course/${id}`)
                expect(response.statusCode).toBe(200)
            }
        })

        test("should respond with empty json body", async () => {
            const idData = [ 1, 10, 11000, 123]
            for (const id of idData) {
                deleteCourse.mockReset()
                deleteCourse.mockResolvedValue(0)
                const response = await request(app).delete(`/course/${id}`)
                expect(response.body).toEqual({})
            }
        })

        test("should specify json in content-type response header", async () => {
            const idData = [ 1, 10, 11000, 123]
            for (const id of idData) {
                deleteCourse.mockReset()
                deleteCourse.mockResolvedValue(0)
                const response = await request(app).delete(`/course/${id}`)
                expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            }
        })

    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const idData = [ 'aa', '*', '9wwer999', '123l']
            for (const id of idData) {
                const response = await request(app).delete(`/course/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

         test("wrong id type should respond with error object", async () => {
            const idData = [ 'aa', '*', '9wwer999', '123l']
            for (const id of idData) {
                const response = await request(app).delete(`/course/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })

        test("id not found in database should respond with 404 status code", async () => {
            const idData = [ 111, 10, 15, 1000000]
            for (const id of idData) {
                deleteCourse.mockReset()
                deleteCourse.mockRejectedValue(new IdNotFoundError("Nothing was deleted!"))
                const response = await request(app).delete(`/course/${id}`)
                expect(response.statusCode).toBe(404)
            }
        })

         test("error in database should respond with 400 status code", async () => {
            const idData = [ 111, 10, 15, 1000000]
            for (const id of idData) {
                deleteCourse.mockReset()
                deleteCourse.mockRejectedValue("Error")
                const response = await request(app).delete(`/course/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })
    })
})
