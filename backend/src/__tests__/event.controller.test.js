const request = require('supertest');
const express = require('express')
var eventRouter = require('../routes/event.route');
const { IdNotFoundError } = require("../helpers/errors");

const getAllEvents = jest.fn()
const getAllPublicEvents = jest.fn()
const findEventById = jest.fn()
const getAllEventsForUser = jest.fn()
const createEvent = jest.fn()
const updateEvent = jest.fn()
const deleteEvent = jest.fn()
const getOwnerId = jest.fn()
const eventModel = {
    getAllEvents,
    getAllPublicEvents,
    getOwnerId,
    findEventById,
    getAllEventsForUser,
    createEvent,
    updateEvent,
    deleteEvent
}

const user = {
    ID_USER: 20,
    EMAIL: 'planbuddy@gmail.com',
    iat: 1639779643,
    exp: 1639786843
}

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// use mock function as middelware
app.use('/event', (req, res, next) => {
    req.model = eventModel;
    req.user = user
    next();
})
// event routes
app.use('/event', eventRouter)

describe("GET /event ", () => {

    beforeEach(() => {
        getAllEvents.mockReset()
        getAllEvents.mockResolvedValue(0)
    })

    describe("sucessful response", () => {

        test("should respond with 200 status code", (done) => {
            request(app)
                .get('/event')
                .expect(200, done)
        })

        test("should specify json in the content-type response header", (done) => {
            request(app)
                .get('/event')
                .then((response) => {
                    expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
                    done()
                })
        })

        test("should respond with all events in body", async () => {
            const data = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { ID_FACH: 4, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            ]
            getAllEvents.mockResolvedValue(data)
            const response = await request(app).get('/event')
            expect(getAllEvents.mock.calls.length).toBe(1)
            expect(response.body).toEqual(data)

        })

    })

    describe("unsuccesful respond", () => {

        test("error in database, should respond with 404 status code", (done) => {
            getAllEvents.mockRejectedValue("Error")
            request(app)
                .get('/event')
                .expect(404, done)
        })

        test("error in database, should respond with empty list in response body", (done) => {
            getAllEvents.mockRejectedValue("Error")
            request(app)
                .get('/event')
                .then((response) => {
                    expect(response.body).toEqual([])
                    done()
                })
        })
    })

})

describe("GET /event/public ", () => {

    beforeEach(() => {
        getAllPublicEvents.mockReset()
        getAllPublicEvents.mockResolvedValue(0)
    })

    describe("sucessful response", () => {

        test("should respond with 200 status code", (done) => {
            request(app)
                .get('/event/public')
                .expect(200, done)
        })

        test("should specify json in the content-type response header", (done) => {
            request(app)
                .get('/event/public')
                .then((response) => {
                    expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
                    done()
                })
        })

        test("should respond with all events in body", async () => {
            const data = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 4, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true }
            ]
            getAllPublicEvents.mockResolvedValue(data)
            const response = await request(app).get('/event/public')
            expect(getAllPublicEvents.mock.calls.length).toBe(1)
            expect(response.body).toEqual(data)

        })

    })

    describe("unsuccesful respond", () => {

        test("error in database, should respond with 404 status code", (done) => {
            getAllPublicEvents.mockRejectedValue("Error")
            request(app)
                .get('/event/public')
                .expect(404, done)
        })

        test("error in database, should respond with empty list in response body", (done) => {
            getAllPublicEvents.mockRejectedValue("Error")
            request(app)
                .get('/event/public')
                .then((response) => {
                    expect(response.body).toEqual([])
                    done()
                })
        })
    })

})

describe("GET /event/user/:id", () => {

    beforeEach(() => {
        getAllEventsForUser.mockReset()
        getAllEventsForUser.mockResolvedValue(0)
    })

    describe("successful respond", () => {

        test("should request the query in database with correct id", async () => {
            const id = "1";
            const data = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { ID_FACH: 4, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            ]
            getAllEventsForUser.mockResolvedValue(data)
            await request(app).get(`/event/user/${id}`)
            expect(getAllEventsForUser.mock.calls.length).toBe(1)
            expect(getAllEventsForUser.mock.calls[0][0]).toBe(id)

        })

        test("should respond with the correct data in body", async () => {
            const id = "1";
            const data = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { ID_FACH: 4, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            ]
            getAllEventsForUser.mockResolvedValue(data)
            const response = await request(app).get(`/event/user/${id}`)
            expect(response.body).toEqual(data)
        })

        test("should respond with a 200 status code", async () => {
            const id = "1";
            const data = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { ID_FACH: 4, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            ]
            getAllEventsForUser.mockResolvedValue(data)
            const response = await request(app).get(`/event/user/${id}`)
            expect(response.statusCode).toBe(200)
        })

        test("should specify json as content-type in response header", async () => {
            const id = "1";
            const data = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { ID_FACH: 4, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            ]
            getAllEventsForUser.mockResolvedValue(data)
            const response = await request(app).get(`/event/user/${id}`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/event/user/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

        test("wrong id type should respond with error object in body", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/event/user/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })
        test("id not found in database should respond with 404 status code", async () => {
            const id = "111111000"
            getAllEventsForUser.mockRejectedValue("Error")
            const response = await request(app).get(`/event/user/${id}`)
            expect(response.statusCode).toBe(404)
        })
        test("id not found in database should respond with empty list in body", async () => {
            const id = "111111000"
            getAllEventsForUser.mockRejectedValue("Error")
            const response = await request(app).get(`/event/user/${id}`)
            expect(response.body).toEqual([])
        })
    })
})

describe("GET /event/:id", () => {

    beforeEach(() => {
        findEventById.mockReset()
        findEventById.mockResolvedValue(0)
    })

    describe("successful response", () => {

        test("should request the query in database with correct id", async () => {
            const id = "1";


            await request(app).get(`/event/${id}`)
            expect(findEventById.mock.calls.length).toBe(1)
            expect(findEventById.mock.calls[0][0]).toBe(id)

        })

        test("should respond with the correct data in body", async () => {
            const id = "1";
            const data =
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true }

            findEventById.mockResolvedValue(data)
            const response = await request(app).get(`/event/${id}`)
            expect(response.body).toEqual(data)
        })

        test("should respond with a 200 status code", async () => {
            const id = "1";
            const data =
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true }
            findEventById.mockResolvedValue(data)
            const response = await request(app).get(`/event/${id}`)
            expect(response.statusCode).toBe(200)
        })

        test("should specify json as content-type in response header", async () => {
            const id = "1";
            const data =
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true }
            findEventById.mockResolvedValue(data)
            const response = await request(app).get(`/event/${id}`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })


    })

    describe("unsuccesful response", () => {
        test("wrong id type should respond with 400 status code", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/event/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

        test("wrong id type should respond with error object in body", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/event/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })
        test("id not found in database should respond with 404 status code", async () => {
            const id = "111111000"
            findEventById.mockRejectedValue("Error")
            const response = await request(app).get(`/event/${id}`)
            expect(response.statusCode).toBe(404)
        })
        test("id not found in database should respond with empty list in body", async () => {
            const id = "111111000"
            findEventById.mockRejectedValue("Error")
            const response = await request(app).get(`/event/${id}`)
            expect(response.body).toEqual({})
        })
    })

})

describe("POST /event", () => {

    beforeEach(() => {
        createEvent.mockReset()
        createEvent.mockResolvedValue(0)
    })


    describe("successful response", () => {

        test("should save the correct data to the database", async () => {
            const bodyData = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { ID_FACH: 4, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            ]

            for (const body of bodyData) {
                createEvent.mockReset()
                createEvent.mockResolvedValue(0)
                await request(app).post('/event').send(body)
                expect(createEvent.mock.calls.length).toBe(1)
                expect(createEvent.mock.calls[0][0]).toBe(body.ID_FACH)
                expect(createEvent.mock.calls[0][1]).toBe(user.ID_USER)
                expect(createEvent.mock.calls[0][2]).toBe(body.START_DATUM_UHRZEIT)
                expect(createEvent.mock.calls[0][3]).toBe(body.END_DATUM_UHRZEIT)
                expect(createEvent.mock.calls[0][4]).toBe(body.NAME)
                expect(createEvent.mock.calls[0][5]).toBe(body.TYP)
                expect(createEvent.mock.calls[0][6]).toBe(body.OEFFENTLICH)
                expect(createEvent.mock.calls[0][7]).toBe(body.NOTIZ)
            }

        })

        test("should save correct data to the database with (only required types)", async () => {
            const bodyData = [
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', OEFFENTLICH: true },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', OEFFENTLICH: true },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', OEFFENTLICH: false },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', OEFFENTLICH: false }
            ]

            for (const body of bodyData) {
                createEvent.mockReset()
                createEvent.mockResolvedValue(0)
                await request(app).post('/event').send(body)
                expect(createEvent.mock.calls.length).toBe(1)
                expect(createEvent.mock.calls[0][0]).toBe(null)
                expect(createEvent.mock.calls[0][1]).toBe(user.ID_USER)
                expect(createEvent.mock.calls[0][2]).toBe(body.START_DATUM_UHRZEIT)
                expect(createEvent.mock.calls[0][3]).toBe(body.END_DATUM_UHRZEIT)
                expect(createEvent.mock.calls[0][4]).toBe(body.NAME)
                expect(createEvent.mock.calls[0][5]).toBe(null)
                expect(createEvent.mock.calls[0][6]).toBe(body.OEFFENTLICH)
                expect(createEvent.mock.calls[0][7]).toBe(null)
            }
        })

        test("should respond with a user object", async () => {
            const bodyData = [
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', OEFFENTLICH: true },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', OEFFENTLICH: true },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', OEFFENTLICH: false },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', OEFFENTLICH: false }
            ]

            for (const body of bodyData) {
                createEvent.mockReset()
                createEvent.mockResolvedValue(body)
                const response = await request(app).post('/event').send(body)
                expect(response.body).toBeDefined()
            }
        })

        test("should specify json in the content-type response header", async () => {
            const body = { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', OEFFENTLICH: true }
            const response = await request(app).post('/event').send(body)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })

        test("should save the correct data to the database", async () => {
            const bodyData = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', OEFFENTLICH: false }
            ]

            for (const body of bodyData) {
                createEvent.mockReset()
                createEvent.mockResolvedValue(0)
                const response = await request(app).post('/event').send(body)
                expect(response.statusCode).toBe(200)
            }

        })

        test("should respond with event id and requested attributes", async () => {
            const body = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', OEFFENTLICH: false }

            ]

            const returnValueData = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { ID_FACH: null, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', TYP: null, NOTIZ: null, OEFFENTLICH: false }
            ]

            for (let i = 0; i < body.length; i++) {
                createEvent.mockReset()
                createEvent.mockResolvedValue(returnValueData[i])
                const response = await request(app).post('/event').send(body[i])
                expect(response.body.ID_FACH).toBeDefined();
                expect(response.body.START_DATUM_UHRZEIT).toBeDefined();
                expect(response.body.END_DATUM_UHRZEIT).toBeDefined();
                expect(response.body.NAME).toBeDefined();
                expect(response.body.TYP).toBeDefined();
                expect(response.body.NOTIZ).toBeDefined();
                expect(response.body.OEFFENTLICH).toBeDefined();
            }

        })
    })

    describe("unsuccessful response", () => {

        test("wrong types in the json request object should respond with 400 status code ", (done) => {
            const bodyData = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: "yes" },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: "no" },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: "yes" },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', OEFFENTLICH: "no" }

            ]
            for (const body of bodyData) {
                request(app)
                    .post('/event')
                    .send(body)
                    .expect(400, done)
            }
        })


        test("wrong id type should respond with error object in body", async () => {
            const bodyData = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: "yes" },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: "no" },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: "yes" },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', OEFFENTLICH: "no" }

            ]
            for (const body of bodyData) {
                const response = await request(app).post('/event')
                expect(response.body.errors).toBeDefined()
            }
        })

        test("database error should respond with 400 error code", async () => {
            const bodyData = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', OEFFENTLICH: false }

            ]

            for (const body of bodyData) {
                createEvent.mockReset()
                createEvent.mockRejectedValue("Error")
                const response = await request(app).post('/event').send(body)
                expect(response.statusCode).toBe(400)
            }

        })

        test("database error should respond with empty json body", async () => {
            const bodyData = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'TI Übung', OEFFENTLICH: false }

            ]

            for (const body of bodyData) {
                createEvent.mockReset()
                createEvent.mockRejectedValue("Error")
                const response = await request(app).post('/event').send(body)
                expect(response.body).toEqual({})
            }

        })

    })
})

describe("PUT /event", () => {

    beforeEach(() => {
        updateEvent.mockReset()
        findEventById.mockReset()
        getOwnerId.mockReset()
        updateEvent.mockRejectedValue(0)
        findEventById.mockRejectedValue(0)
        getOwnerId.mockRejectedValue(0)
    })

    describe("successful respond", () => {

        test("should save the correct data to the database", async () => {
            const body = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            ]


            const foundEvents = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'ohne kamera', OEFFENTLICH: false },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'fällt aus', OEFFENTLICH: false }
            ]

            for (let i = 0; i < body.length; i++) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                findEventById.mockReset()
                findEventById.mockResolvedValue(foundEvents[i])
                updateEvent.mockReset()
                updateEvent.mockResolvedValue(body[i])
                await request(app).put(`/event/${i + 1}`).send(body[i])
                expect(updateEvent.mock.calls.length).toBe(1)
                expect(findEventById.mock.calls.length).toBe(1)
                expect(updateEvent.mock.calls[0][1]).toBe(foundEvents[i].ID_FACH)
                expect(updateEvent.mock.calls[0][2]).toBe(body[i].START_DATUM_UHRZEIT)
                expect(updateEvent.mock.calls[0][3]).toBe(body[i].END_DATUM_UHRZEIT)
                expect(updateEvent.mock.calls[0][4]).toBe(body[i].NAME)
                expect(updateEvent.mock.calls[0][5]).toBe(body[i].TYP)
                expect(updateEvent.mock.calls[0][6]).toBe(body[i].OEFFENTLICH)
                expect(updateEvent.mock.calls[0][7]).toBe(body[i].NOTIZ)
            }

        })

        test("should save the correct data to the database (only the send attribute changes)", async () => {
            const body = [
                { ID_TERMIN: 1, NOTIZ: 'ohne kamera', OEFFENTLICH: true },
                { ID_TERMIN: 2, NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_TERMIN: 3, NOTIZ: 'mit kamera', OEFFENTLICH: false }
            ]


            const foundEvents = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'ohne kamera', OEFFENTLICH: false },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'fällt aus', OEFFENTLICH: false }
            ]

            for (let i = 0; i < body.length; i++) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                findEventById.mockReset()
                findEventById.mockResolvedValue(foundEvents[i])
                updateEvent.mockReset()
                updateEvent.mockResolvedValue(body[i])
                await request(app).put(`/event/${i + 1}`).send(body[i])
                expect(updateEvent.mock.calls.length).toBe(1)
                expect(findEventById.mock.calls.length).toBe(1)
                expect(updateEvent.mock.calls[0][1]).toBe(foundEvents[i].ID_FACH)
                expect(updateEvent.mock.calls[0][2]).toBe(foundEvents[i].START_DATUM_UHRZEIT)
                expect(updateEvent.mock.calls[0][3]).toBe(foundEvents[i].END_DATUM_UHRZEIT)
                expect(updateEvent.mock.calls[0][4]).toBe(foundEvents[i].NAME)
                expect(updateEvent.mock.calls[0][5]).toBe(foundEvents[i].TYP)
                expect(updateEvent.mock.calls[0][6]).toBe(body[i].OEFFENTLICH)
                expect(updateEvent.mock.calls[0][7]).toBe(body[i].NOTIZ)
            }

        })

        test("should respond with eventObject", async () => {
            const body = [
                { ID_TERMIN: 1, NOTIZ: 'ohne kamera', OEFFENTLICH: true },
                { ID_TERMIN: 2, NOTIZ: 'mit kamera', OEFFENTLICH: true },
                { ID_TERMIN: 3, NOTIZ: 'mit kamera', OEFFENTLICH: false }
            ]


            const foundEvents = [
                { ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false },
                { ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Mathe E-Assessment 1', TYP: '', NOTIZ: 'ohne kamera', OEFFENTLICH: false },
                { ID_FACH: 3, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'OOP Praktikum', TYP: '', NOTIZ: 'fällt aus', OEFFENTLICH: false }
            ]

            for (let i = 0; i < body.length; i++) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                findEventById.mockReset()
                findEventById.mockResolvedValue(foundEvents[i])
                updateEvent.mockReset()
                updateEvent.mockResolvedValue(body)
                const response = await request(app).put(`/event/${i + 1}`).send(body[i])
                expect(response.body).toBeDefined()
            }
        })

        test("should respond with the updated event attributes", async () => {
            const id = 1
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundEvents = { ID_TERMIN: 1, ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }

            const returnValue = { ID_TERMIN: 1, ID_FACH: 2, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'Systemprogrammierung 1', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true }


            getOwnerId.mockResolvedValue(user.ID_USER)
            findEventById.mockResolvedValue(foundEvents)
            updateEvent.mockResolvedValue(returnValue)
            const response = await request(app).put(`/event/${id}`).send(body)
            expect(response.body.ID_TERMIN).toBe(id)
            expect(response.body.ID_FACH).toBe(body.ID_FACH)
            expect(response.body.START_DATUM_UHRZEIT).toBe(foundEvents.START_DATUM_UHRZEIT)
            expect(response.body.END_DATUM_UHRZEIT).toBe(foundEvents.END_DATUM_UHRZEIT)
            expect(response.body.NAME).toBe(body.NAME)
            expect(response.body.TYP).toBe(foundEvents.TYP)
            expect(response.body.NOTIZ).toBe(foundEvents.NOTIZ)
            expect(response.body.OEFFENTLICH).toBe(body.OEFFENTLICH)
        })

        test("should respond with 200 status code", async () => {
            const id = 1
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundEvents = { ID_TERMIN: 1, ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }

            getOwnerId.mockResolvedValue(user.ID_USER)
            findEventById.mockResolvedValue(foundEvents)
            updateEvent.mockResolvedValue(0)
            const response = await request(app).put(`/event/${id}`).send(body)
            expect(response.statusCode).toBe(200)
        })


        test("should specify json as content-type in respone header", async () => {
            const id = 1
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundEvents = { ID_TERMIN: 1, ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }

            getOwnerId.mockResolvedValue(user.ID_USER)
            findEventById.mockResolvedValue(foundEvents)
            updateEvent.mockResolvedValue(0)
            const response = await request(app).put(`/event/${id}`).send(body)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const id = "aa"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundEvents = { ID_TERMIN: 1, ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            findEventById.mockResolvedValue(foundEvents)
            updateEvent.mockResolvedValue(0)
            const response = await request(app).put(`/event/${id}`).send(body)
            expect(response.statusCode).toBe(400)
        })

        test("wrong id type should respond with 400 status code", async () => {
            const id = "aa"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundEvents = { ID_TERMIN: 1, ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            findEventById.mockResolvedValue(foundEvents)
            updateEvent.mockResolvedValue(0)
            const response = await request(app).put(`/event/${id}`).send(body)
            expect(response.body.errors).toBeDefined()
        })

        test("id not found in database should respond with 404 status code", async () => {
            const id = "11111000"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundEvents = { ID_TERMIN: 1, ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            getOwnerId.mockResolvedValue(user.ID_USER)
            findEventById.mockRejectedValue("Error")
            updateEvent.mockResolvedValue(0)
            const response = await request(app).put(`/event/${id}`).send(body)
            expect(response.statusCode).toBe(404)
        })

        test("id not found in database should respond with empty json", async () => {
            const id = "11111000"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundEvents = { ID_TERMIN: 1, ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            getOwnerId.mockResolvedValue(user.ID_USER)
            findEventById.mockRejectedValue("Error")
            updateEvent.mockResolvedValue(0)
            const response = await request(app).put(`/event/${id}`).send(body)
            expect(response.body).toEqual({})
        })

        test("error when updating the event in database should respond with 400 status code", async () => {
            const id = "11111000"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundEvents = { ID_TERMIN: 1, ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            getOwnerId.mockResolvedValue(user.ID_USER)
            findEventById.mockResolvedValue(foundEvents)
            updateEvent.mockRejectedValue("Error")
            const response = await request(app).put(`/event/${id}`).send(body)
            expect(response.statusCode).toBe(400)
        })


        test("error when updating the event in database should respond empty json", async () => {
            const id = "11111000"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundEvents = { ID_TERMIN: 1, ID_FACH: 1, START_DATUM_UHRZEIT: '2021-12-14 14:00:00', END_DATUM_UHRZEIT: '2021-12-14 16:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            getOwnerId.mockResolvedValue(user.ID_USER)
            findEventById.mockResolvedValue(foundEvents)
            updateEvent.mockRejectedValue("Error")
            const response = await request(app).put(`/event/${id}`).send(body)
            expect(response.body).toEqual({})
        })
    })
})

describe("DELETE /event", () => {

    beforeEach(() => {
        getOwnerId.mockReset()
        deleteEvent.mockReset()
        getOwnerId.mockResolvedValue(0)
        deleteEvent.mockResolvedValue(0)
    })
    describe("successful respond", () => {

        test("event should be deleted in the database", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteEvent.mockReset()
                deleteEvent.mockResolvedValue(0)
                await request(app).delete(`/event/${id}`)
                expect(deleteEvent.mock.calls.length).toBe(1)
                expect(deleteEvent.mock.calls[0][0]).toBe(id.toString())
            }
        })

        test("should respond with 200 status code", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteEvent.mockReset()
                deleteEvent.mockResolvedValue(0)
                const response = await request(app).delete(`/event/${id}`)
                expect(response.statusCode).toBe(200)
            }
        })

        test("should respond with empty json body", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteEvent.mockReset()
                deleteEvent.mockResolvedValue(0)
                const response = await request(app).delete(`/event/${id}`)
                expect(response.body).toEqual({})
            }
        })

        test("should specify json in content-type response header", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteEvent.mockReset()
                deleteEvent.mockResolvedValue(0)
                const response = await request(app).delete(`/event/${id}`)
                expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            }
        })

    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const idData = ['aa', '*', '9wwer999', '123l']
            for (const id of idData) {
                const response = await request(app).delete(`/event/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

        test("wrong id type should respond with error object", async () => {
            const idData = ['aa', '*', '9wwer999', '123l']
            for (const id of idData) {
                const response = await request(app).delete(`/event/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })

        test("id not found in database should respond with 404 status code", async () => {
            const idData = [111, 10, 15, 1000000]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteEvent.mockReset()
                deleteEvent.mockRejectedValue(new IdNotFoundError("Nothing was deleted!"))
                const response = await request(app).delete(`/event/${id}`)
                expect(response.statusCode).toBe(404)
            }
        })

        test("error in database should respond with 400 status code", async () => {
            const idData = [111, 10, 15, 1000000]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteEvent.mockReset()
                deleteEvent.mockRejectedValue("Error")
                const response = await request(app).delete(`/event/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })
    })
})