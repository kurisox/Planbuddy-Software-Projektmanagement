const request = require('supertest');
const express = require('express')
var todoRouter = require('../routes/todo.route');
const { IdNotFoundError } = require("../helpers/errors");

const getAllTodos = jest.fn()
const findTodoById = jest.fn()
const getAllTodosForUser = jest.fn()
const createTodo = jest.fn()
const updateTodo = jest.fn()
const deleteTodo = jest.fn()
const getOwnerId = jest.fn()
const todoModel = {
    getAllTodos,
    getOwnerId,
    findTodoById,
    getAllTodosForUser,
    createTodo,
    updateTodo,
    deleteTodo
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
app.use('/todo', (req, res, next) => {
    req.model = todoModel;
    req.user = user
    next();
})
// todo routes
app.use('/todo', todoRouter)

describe("GET /todo ", () => {

    beforeEach(() => {
        getAllTodos.mockReset()
        getAllTodos.mockResolvedValue(0)
    })

    describe("sucessful response", () => {

        test("should respond with 200 status code", (done) => {
            request(app)
                .get('/todo')
                .expect(200, done)
        })

        test("should specify json in the content-type response header", (done) => {
            request(app)
                .get('/todo')
                .then((response) => {
                    expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
                    done()
                })
        })

        test("should respond with all todos in body", async () => {
            const data = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 4, NAME: 'Ueben fuer Klausuren', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-09-30 18:59:59',TYP: '', OEFFENTLICH: false, NOTIZ: 'Grosse Kanne Kaffee kochen!' }
               
            ]
            getAllTodos.mockResolvedValue(data)
            const response = await request(app).get('/todo')
            expect(getAllTodos.mock.calls.length).toBe(1)
            expect(response.body).toEqual(data)

        })

    })

    describe("unsuccesful respond", () => {

        test("error in database, should respond with 404 status code", (done) => {
            getAllTodos.mockRejectedValue("Error")
            request(app)
                .get('/todo')
                .expect(404, done)
        })

        test("error in database, should respond with empty list in response body", (done) => {
            getAllTodos.mockRejectedValue("Error")
            request(app)
                .get('/todo')
                .then((response) => {
                    expect(response.body).toEqual([])
                    done()
                })
        })
    })

})

describe("GET /todo/user/:id", () => {

    beforeEach(() => {
        getAllTodosForUser.mockReset()
        getAllTodosForUser.mockResolvedValue(0)
    })

    describe("successful respond", () => {

        test("should request the query in database with correct id", async () => {
            const id = "1";
            const data = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 4, NAME: 'Ueben fuer Klausuren', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-09-30 18:59:59',TYP: '', OEFFENTLICH: false, NOTIZ: 'Grosse Kanne Kaffee kochen!' }
            ]
            getAllTodosForUser.mockResolvedValue(data)
            await request(app).get(`/todo/user/${id}`)
            expect(getAllTodosForUser.mock.calls.length).toBe(1)
            expect(getAllTodosForUser.mock.calls[0][0]).toBe(id)

        })

        test("should respond with the correct data in body", async () => {
            const id = "1";
            const data = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 4, NAME: 'Ueben fuer Klausuren', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-09-30 18:59:59',TYP: '', OEFFENTLICH: false, NOTIZ: 'Grosse Kanne Kaffee kochen!' }
            ]
            getAllTodosForUser.mockResolvedValue(data)
            const response = await request(app).get(`/todo/user/${id}`)
            expect(response.body).toEqual(data)
        })

        test("should respond with a 200 status code", async () => {
            const id = "1";
            const data = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 4, NAME: 'Ueben fuer Klausuren', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-09-30 18:59:59',TYP: '', OEFFENTLICH: false, NOTIZ: 'Grosse Kanne Kaffee kochen!' }
            ]
            getAllTodosForUser.mockResolvedValue(data)
            const response = await request(app).get(`/todo/user/${id}`)
            expect(response.statusCode).toBe(200)
        })

        test("should specify json as content-type in response header", async () => {
            const id = "1";
            const data = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 4, NAME: 'Ueben fuer Klausuren', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-09-30 18:59:59',TYP: '', OEFFENTLICH: false, NOTIZ: 'Grosse Kanne Kaffee kochen!' }
            ]
            getAllTodosForUser.mockResolvedValue(data)
            const response = await request(app).get(`/todo/user/${id}`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/todo/user/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

        test("wrong id type should respond with error object in body", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/todo/user/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })
        test("id not found in database should respond with 404 status code", async () => {
            const id = "111111000"
            getAllTodosForUser.mockRejectedValue("Error")
            const response = await request(app).get(`/todo/user/${id}`)
            expect(response.statusCode).toBe(404)
        })
        test("id not found in database should respond with empty list in body", async () => {
            const id = "111111000"
            getAllTodosForUser.mockRejectedValue("Error")
            const response = await request(app).get(`/todo/user/${id}`)
            expect(response.body).toEqual([])
        })
    })
})

describe("GET /todo/:id", () => {

    beforeEach(() => {
        findTodoById.mockReset()
        findTodoById.mockResolvedValue(0)
    })

    describe("successful response", () => {

        test("should request the query in database with correct id", async () => {
            const id = "1";


            await request(app).get(`/todo/${id}`)
            expect(findTodoById.mock.calls.length).toBe(1)
            expect(findTodoById.mock.calls[0][0]).toBe(id)

        })

        test("should respond with the correct data in body", async () => {
            const id = "1";
            const data =
                { ID_FACH: 1, DATUM: '2021-12-14 14:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true }

            findTodoById.mockResolvedValue(data)
            const response = await request(app).get(`/todo/${id}`)
            expect(response.body).toEqual(data)
        })

        test("should respond with a 200 status code", async () => {
            const id = "1";
            const data =
                { ID_FACH: 1, DATUM: '2021-12-14 14:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true }
            findTodoById.mockResolvedValue(data)
            const response = await request(app).get(`/todo/${id}`)
            expect(response.statusCode).toBe(200)
        })

        test("should specify json as content-type in response header", async () => {
            const id = "1";
            const data =
                { ID_FACH: 1, DATUM: '2021-12-14 14:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: true }
            findTodoById.mockResolvedValue(data)
            const response = await request(app).get(`/todo/${id}`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })


    })

    describe("unsuccesful response", () => {
        test("wrong id type should respond with 400 status code", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/todo/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

        test("wrong id type should respond with error object in body", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/todo/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })
        test("id not found in database should respond with 404 status code", async () => {
            const id = "111111000"
            findTodoById.mockRejectedValue("Error")
            const response = await request(app).get(`/todo/${id}`)
            expect(response.statusCode).toBe(404)
        })
        test("id not found in database should respond with empty list in body", async () => {
            const id = "111111000"
            findTodoById.mockRejectedValue("Error")
            const response = await request(app).get(`/todo/${id}`)
            expect(response.body).toEqual({})
        })
    })

})

describe("POST /todo", () => {

    beforeEach(() => {
        createTodo.mockReset()
        createTodo.mockResolvedValue(0)
    })


    describe("successful response", () => {

        test("should save the correct data to the database", async () => {
            const bodyData = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true, NOTIZ: 'Grosse Kanne Kaffee kochen!' },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: true, NOTIZ: 'Grosse Kanne Kaffee kochen!'  },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: true, NOTIZ: 'Grosse Kanne Kaffee kochen!'  },
                { ID_FACH: 4, NAME: 'Ueben fuer Klausuren', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-09-30 18:59:59',TYP: '', OEFFENTLICH: false, NOTIZ: 'Grosse Kanne Kaffee kochen!' }
            ]

            for (const body of bodyData) {
                createTodo.mockReset()
                createTodo.mockResolvedValue(0)
                await request(app).post('/todo').send(body)
                expect(createTodo.mock.calls.length).toBe(1)
                expect(createTodo.mock.calls[0][0]).toBe(body.ID_FACH)
                expect(createTodo.mock.calls[0][1]).toBe(user.ID_USER)
                expect(createTodo.mock.calls[0][2]).toBe(body.NAME)
                expect(createTodo.mock.calls[0][3]).toBe(body.ERLEDIGT)
                expect(createTodo.mock.calls[0][4]).toBe(body.WORKLOAD)
                expect(createTodo.mock.calls[0][5]).toBe(body.DATUM)
                expect(createTodo.mock.calls[0][6]).toBe(body.TYP)
                expect(createTodo.mock.calls[0][7]).toBe(body.NOTIZ)
                expect(createTodo.mock.calls[0][8]).toBe(body.OEFFENTLICH)
            }

        })

        test("should save correct data to the database with (only required types)", async () => {
            const bodyData = [
                { ERLEDIGT: false, NAME: 'EIDI VL 01', OEFFENTLICH: true },
                { ERLEDIGT: false, NAME: 'Mathe E-Assessment 1', OEFFENTLICH: true },
                { ERLEDIGT: false, NAME: 'OOP Praktikum', OEFFENTLICH: false },
                { ERLEDIGT: false, NAME: 'TI Übung', OEFFENTLICH: false }
            ]

            for (const body of bodyData) {
                createTodo.mockReset()
                createTodo.mockResolvedValue(0)
                await request(app).post('/todo').send(body)
                expect(createTodo.mock.calls.length).toBe(1)
                expect(createTodo.mock.calls[0][0]).toBe(null)
                expect(createTodo.mock.calls[0][1]).toBe(user.ID_USER)
                expect(createTodo.mock.calls[0][2]).toBe(body.NAME)
                expect(createTodo.mock.calls[0][3]).toBe(body.ERLEDIGT)
                expect(createTodo.mock.calls[0][4]).toBe(null)
                expect(createTodo.mock.calls[0][5]).toBe(null)
                expect(createTodo.mock.calls[0][6]).toBe(null)
                expect(createTodo.mock.calls[0][7]).toBe(null)
                expect(createTodo.mock.calls[0][8]).toBe(body.OEFFENTLICH)
            }
        })

        test("should respond with a user object", async () => {
            const bodyData = [
                { DATUM: '2021-12-14 14:00:00', NAME: 'EIDI VL 01', OEFFENTLICH: true },
                { DATUM: '2021-12-14 14:00:00', NAME: 'Mathe E-Assessment 1', OEFFENTLICH: true },
                { DATUM: '2021-12-14 14:00:00', NAME: 'OOP Praktikum', OEFFENTLICH: false },
                { DATUM: '2021-12-14 14:00:00', NAME: 'TI Übung', OEFFENTLICH: false }
            ]

            for (const body of bodyData) {
                createTodo.mockReset()
                createTodo.mockResolvedValue(body)
                const response = await request(app).post('/todo').send(body)
                expect(response.body).toBeDefined()
            }
        })

        test("should specify json in the content-type response header", async () => {
            const body = { DATUM: '2021-12-14 14:00:00', NAME: 'EIDI VL 01', OEFFENTLICH: true }
            const response = await request(app).post('/todo').send(body)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })

        test("should save the correct data to the database", async () => {
            const bodyData = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 4, NAME: 'Ueben fuer Klausuren', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-09-30 18:59:59',TYP: '', OEFFENTLICH: false, NOTIZ: 'Grosse Kanne Kaffee kochen!' }
            ]

            for (const body of bodyData) {
                createTodo.mockReset()
                createTodo.mockResolvedValue(0)
                const response = await request(app).post('/todo').send(body)
                expect(response.statusCode).toBe(200)
            }

        })

        test("should respond with todo id and requested attributes", async () => {
            const body = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 4, NAME: 'Ueben fuer Klausuren', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-09-30 18:59:59', TYP: '', OEFFENTLICH: false, NOTIZ: 'Grosse Kanne Kaffee kochen!' }

            ]

            const returnValueData = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 4, NAME: 'Ueben fuer Klausuren', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-09-30 18:59:59', TYP: '', OEFFENTLICH: false, NOTIZ: 'Grosse Kanne Kaffee kochen!' }
            ]

            for (let i = 0; i < body.length; i++) {
                createTodo.mockReset()
                createTodo.mockResolvedValue(returnValueData[i])
                const response = await request(app).post('/todo').send(body[i])
                expect(response.body.ID_FACH).toBeDefined();
                expect(response.body.NAME).toBeDefined();
                expect(response.body.ERLEDIGT).toBeDefined();
                expect(response.body.WORKLOAD).toBeDefined();
                expect(response.body.DATUM).toBeDefined();
                expect(response.body.TYP).toBeDefined();
                expect(response.body.OEFFENTLICH).toBeDefined();
            }

        })
    })

    describe("unsuccessful response", () => {

        test("wrong types in the json request object should respond with 400 status code ", (done) => {
            const bodyData = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: 'yes' },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: 'yes' },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: 'yes' },
                { DATUM: '2021-09-30 18:59:59', NAME: 'Ueben fuer Klausuren', OEFFENTLICH: 'no' }

            ]
            for (const body of bodyData) {
                request(app)
                    .post('/todo')
                    .send(body)
                    .expect(400, done)
            }
        })


        test("wrong id type should respond with error object in body", async () => {
            const bodyData = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: 'yes' },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: 'yes' },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: 'yes' },
                { DATUM: '2021-09-30 18:59:59', NAME: 'Ueben fuer Klausuren', OEFFENTLICH: 'no' }

            ]
            for (const body of bodyData) {
                const response = await request(app).post('/todo')
                expect(response.body.errors).toBeDefined()
            }
        })

        test("database error should respond with 400 error code", async () => {
            const bodyData = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: true },
                { DATUM: '2021-09-30 18:59:59', NAME: 'Ueben fuer Klausuren', OEFFENTLICH: false }

            ]

            for (const body of bodyData) {
                createTodo.mockReset()
                createTodo.mockRejectedValue("Error")
                const response = await request(app).post('/todo').send(body)
                expect(response.statusCode).toBe(400)
            }

        })

        test("database error should respond with error object", async () => {
            const bodyData = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-11-25 18:59:59', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 8:00:00', TYP: '', OEFFENTLICH: true },
                { DATUM: '2021-09-30 18:59:59', NAME: 'Ueben fuer Klausuren', ERLEDIGT: false, OEFFENTLICH: false }

            ]

            for (const body of bodyData) {
                createTodo.mockReset()
                createTodo.mockRejectedValue("Error")
                const response = await request(app).post('/todo').send(body)
                expect(response.body).toEqual({})
            }

        })

    })
})

describe("PUT /todo", () => {

    beforeEach(() => {
        updateTodo.mockReset()
        findTodoById.mockReset()
        getOwnerId.mockReset()
        updateTodo.mockRejectedValue(0)
        findTodoById.mockRejectedValue(0)
        getOwnerId.mockRejectedValue(0)
    })

    describe("successful respond", () => {

        test("should save the correct data to the database", async () => {
            const body = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-25 18:59:59', TYP: '', OEFFENTLICH: true },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 08:00:00', TYP: '', OEFFENTLICH: true }
            ]

            const foundTodos = [
                {ID_AUFGABE: 1, ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', NOTIZ: '', OEFFENTLICH: false },
                {ID_AUFGABE: 2, ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-25 18:59:59', TYP: '', NOTIZ: '', OEFFENTLICH: false },
                {ID_AUFGABE: 3, ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 08:00:00', TYP: '', NOTIZ: '',OEFFENTLICH: false}
            ]

            for (let i = 0; i < body.length; i++) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                findTodoById.mockReset()
                findTodoById.mockResolvedValue(foundTodos[i])
                updateTodo.mockReset()
                updateTodo.mockResolvedValue(body[i])
                await request(app).put(`/todo/${i + 1}`).send(body[i])
                expect(updateTodo.mock.calls.length).toBe(1)
                expect(findTodoById.mock.calls.length).toBe(1)
                expect(updateTodo.mock.calls[0][0]).toBe(foundTodos[i].ID_AUFGABE)
                expect(updateTodo.mock.calls[0][1]).toBe(foundTodos[i].ID_FACH)
                expect(updateTodo.mock.calls[0][2]).toBe(body[i].NAME)
                expect(updateTodo.mock.calls[0][3]).toBe(body[i].ERLEDIGT)
                expect(updateTodo.mock.calls[0][4]).toBe(body[i].WORKLOAD)
                expect(updateTodo.mock.calls[0][5]).toBe(body[i].DATUM)
                expect(updateTodo.mock.calls[0][6]).toBe(body[i].TYP)
                expect(updateTodo.mock.calls[0][7]).toBe(foundTodos[i].NOTIZ)
                expect(updateTodo.mock.calls[0][8]).toBe(body[i].OEFFENTLICH)
            }

        })

        test("should save the correct data to the database (only the send attribute changes)", async () => {
            const body = [
                { ID_AUFGABE: 1, ERLEDIGT: true, WORKLOAD: 3 },
                { ID_AUFGABE: 2, ERLEDIGT: true, WORKLOAD: 3 },
                { ID_AUFGABE: 3, ERLEDIGT: true, WORKLOAD: 3 }
            ]


            const foundTodos = [
                {ID_AUFGABE: 1, ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', NOTIZ: '', OEFFENTLICH: false },
                {ID_AUFGABE: 2, ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-25 18:59:59', TYP: '', NOTIZ: '', OEFFENTLICH: false },
                {ID_AUFGABE: 3, ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 08:00:00', TYP: '', NOTIZ: '',OEFFENTLICH: false}
            ]

            for (let i = 0; i < body.length; i++) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                findTodoById.mockReset()
                findTodoById.mockResolvedValue(foundTodos[i])
                updateTodo.mockReset()
                updateTodo.mockResolvedValue(body[i])
                await request(app).put(`/todo/${i + 1}`).send(body[i])
                expect(updateTodo.mock.calls.length).toBe(1)
                expect(findTodoById.mock.calls.length).toBe(1)
                expect(updateTodo.mock.calls[0][0]).toBe(body[i].ID_AUFGABE)
                expect(updateTodo.mock.calls[0][1]).toBe(foundTodos[i].ID_FACH)
                expect(updateTodo.mock.calls[0][2]).toBe(foundTodos[i].NAME)
                expect(updateTodo.mock.calls[0][3]).toBe(body[i].ERLEDIGT)
                expect(updateTodo.mock.calls[0][4]).toBe(body[i].WORKLOAD)
                expect(updateTodo.mock.calls[0][5]).toBe(foundTodos[i].DATUM)
                expect(updateTodo.mock.calls[0][6]).toBe(foundTodos[i].TYP)
                expect(updateTodo.mock.calls[0][7]).toBe(foundTodos[i].NOTIZ)
                expect(updateTodo.mock.calls[0][8]).toBe(foundTodos[i].OEFFENTLICH)
            }

        })

        test("should respond with TodoObject", async () => {
            const body = [
                { ID_AUFGABE: 1, ERLEDIGT: true, WORKLOAD: 3 },
                { ID_AUFGABE: 2, ERLEDIGT: true, WORKLOAD: 3 },
                { ID_AUFGABE: 3, ERLEDIGT: true, WORKLOAD: 3 }
            ]


            const foundTodos = [
                { ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: false },
                { ID_FACH: 2, NAME: 'Polynomdivision 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-25 18:59:59', TYP: '', OEFFENTLICH: false },
                { ID_FACH: 3, NAME: 'Beispielprojekt erweitern', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-10-30 08:00:00', TYP: '', OEFFENTLICH: false}
            ]

            for (let i = 0; i < body.length; i++) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                findTodoById.mockReset()
                findTodoById.mockResolvedValue(foundTodos[i])
                updateTodo.mockReset()
                updateTodo.mockResolvedValue(body)
                const response = await request(app).put(`/todo/${i + 1}`).send(body[i])
                expect(response.body).toBeDefined()
            }
        })

        test("should respond with the updated Todo attributes", async () => {
            const id = 1
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundTodos = { ID_AUFGABE: 1, ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: false }

            const returnValue = { ID_AUFGABE: 1, ID_FACH: 2, NAME: 'Systemprogrammierung 1', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: true }


            getOwnerId.mockResolvedValue(user.ID_USER)
            findTodoById.mockResolvedValue(foundTodos)
            updateTodo.mockResolvedValue(returnValue)
            const response = await request(app).put(`/todo/${id}`).send(body)
            expect(response.body.ID_AUFGABE).toBe(id)
            expect(response.body.ID_FACH).toBe(body.ID_FACH)
            expect(response.body.DATUM).toBe(foundTodos.DATUM)
            expect(response.body.NAME).toBe(body.NAME)
            expect(response.body.ERLEDIGT).toBe(foundTodos.ERLEDIGT)
            expect(response.body.WORKLOAD).toBe(foundTodos.WORKLOAD)
            expect(response.body.TYP).toBe(foundTodos.TYP)
            expect(response.body.OEFFENTLICH).toBe(body.OEFFENTLICH)
        })

        test("should respond with 200 status code", async () => {
            const id = 1
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }

            const foundTodos = {  ID_AUFGABE: 1, ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: false  }

            getOwnerId.mockResolvedValue(user.ID_USER)
            findTodoById.mockResolvedValue(foundTodos)
            updateTodo.mockResolvedValue(0)
            const response = await request(app).put(`/todo/${id}`).send(body)
            expect(response.statusCode).toBe(200)
        })


        test("should specify json as content-type in respone header", async () => {
            const id = 1
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundTodo = {  ID_AUFGABE: 1, ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: false  }

            getOwnerId.mockResolvedValue(user.ID_USER)
            findTodoById.mockResolvedValue(foundTodo)
            updateTodo.mockResolvedValue(0)
            const response = await request(app).put(`/todo/${id}`).send(body)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const id = "aa"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundTodo = { ID_AUFGABE: 1, ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: false }
            findTodoById.mockResolvedValue(foundTodo)
            updateTodo.mockResolvedValue(0)
            const response = await request(app).put(`/todo/${id}`).send(body)
            expect(response.statusCode).toBe(400)
        })

        test("wrong id type should respond with 400 status code", async () => {
            const id = "aa"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundTodos = {  ID_AUFGABE: 1, ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: false }
            findTodoById.mockResolvedValue(foundTodos)
            updateTodo.mockResolvedValue(0)
            const response = await request(app).put(`/todo/${id}`).send(body)
            expect(response.body.errors).toBeDefined()
        })

        test("id not found in database should respond with 404 status code", async () => {
            const id = "11111000"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundTodos = { ID_AUFGABE: 1, ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: false }
            getOwnerId.mockResolvedValue(user.ID_USER)
            findTodoById.mockRejectedValue("Error")
            updateTodo.mockResolvedValue(0)
            const response = await request(app).put(`/todo/${id}`).send(body)
            expect(response.statusCode).toBe(404)
        })

        test("id not found in database should respond with empty json", async () => {
            const id = "11111000"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundTodos = { ID_AUFGABE: 1, ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: false }
            getOwnerId.mockResolvedValue(user.ID_USER)
            findTodoById.mockRejectedValue("Error")
            updateTodo.mockResolvedValue(0)
            const response = await request(app).put(`/todo/${id}`).send(body)
            expect(response.body).toEqual({})
        })

        test("error when updating the Todo in database should respond with 400 status code", async () => {
            const id = "11111000"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }

            const foundTodos = { ID_AUFGABE: 1, ID_FACH: 1, NAME: 'Uebungsblatt 6', ERLEDIGT: false, WORKLOAD: 1, DATUM: '2021-12-14 16:00:00', TYP: '', OEFFENTLICH: false }
            getOwnerId.mockResolvedValue(user.ID_USER)
            findTodoById.mockResolvedValue(foundTodos)
            updateTodo.mockRejectedValue("Error")
            const response = await request(app).put(`/todo/${id}`).send(body)
            expect(response.statusCode).toBe(400)
        })


        test("error when updating the Todo in database should respond empty json", async () => {
            const id = "11111000"
            const body = { ID_FACH: 2, NAME: "Systemprogrammierung 1", OEFFENTLICH: true }


            const foundTodos = { ID_TERMIN: 1, ID_FACH: 1, DATUM: '2021-12-14 14:00:00', NAME: 'EIDI VL 01', TYP: '', NOTIZ: 'mit kamera', OEFFENTLICH: false }
            getOwnerId.mockResolvedValue(user.ID_USER)
            findTodoById.mockResolvedValue(foundTodos)
            updateTodo.mockRejectedValue("Error")
            const response = await request(app).put(`/todo/${id}`).send(body)
            expect(response.body).toEqual({})
        })
    })
})

describe("DELETE /todo", () => {

    beforeEach(() => {
        getOwnerId.mockReset()
        deleteTodo.mockReset()
        getOwnerId.mockResolvedValue(0)
        deleteTodo.mockResolvedValue(0)
    })
    describe("successful respond", () => {

        test("Todo should be deleted in the database", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteTodo.mockReset()
                deleteTodo.mockResolvedValue(0)
                await request(app).delete(`/todo/${id}`)
                expect(deleteTodo.mock.calls.length).toBe(1)
                expect(deleteTodo.mock.calls[0][0]).toBe(id.toString())
            }
        })

        test("should respond with 200 status code", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteTodo.mockReset()
                deleteTodo.mockResolvedValue(0)
                const response = await request(app).delete(`/todo/${id}`)
                expect(response.statusCode).toBe(200)
            }
        })

        test("should respond with empty json body", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteTodo.mockReset()
                deleteTodo.mockResolvedValue(0)
                const response = await request(app).delete(`/todo/${id}`)
                expect(response.body).toEqual({})
            }
        })

        test("should specify json in content-type response header", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteTodo.mockReset()
                deleteTodo.mockResolvedValue(0)
                const response = await request(app).delete(`/todo/${id}`)
                expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            }
        })
    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const idData = ['aa', '*', '9wwer999', '123l']
            for (const id of idData) {
                const response = await request(app).delete(`/todo/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

        test("wrong id type should respond with error object", async () => {
            const idData = ['aa', '*', '9wwer999', '123l']
            for (const id of idData) {
                const response = await request(app).delete(`/todo/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })

        test("id not found in database should respond with 404 status code", async () => {
            const idData = [111, 10, 15, 1000000]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteTodo.mockReset()
                deleteTodo.mockRejectedValue(new IdNotFoundError("Nothing was deleted!"))
                const response = await request(app).delete(`/todo/${id}`)
                expect(response.statusCode).toBe(404)
            }
        })

        test("error in database should respond with 400 status code", async () => {
            const idData = [111, 10, 15, 1000000]
            for (const id of idData) {
                getOwnerId.mockReset()
                getOwnerId.mockResolvedValue(user.ID_USER)
                deleteTodo.mockReset()
                deleteTodo.mockRejectedValue("Error")
                const response = await request(app).delete(`/todo/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })
    })
})