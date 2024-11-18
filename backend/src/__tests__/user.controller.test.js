const request = require('supertest');
const express = require('express')
var userRouter = require('../routes/user.route');
var noAuthRouter = require('../routes/noauth.route')
const { IdNotFoundError } = require("../helpers/errors");

// mock database access functions
const createUser = jest.fn()
const findUserById = jest.fn()
const findUserByEmail = jest.fn()
const checkIfEmailIsTaken = jest.fn()
const getTopUsers = jest.fn()
const updateUser = jest.fn()
const deleteUser = jest.fn()
const getAllUsers = jest.fn()
const userModel = {
    createUser,
    findUserById,
    findUserByEmail,
    checkIfEmailIsTaken,
    getTopUsers,
    updateUser,
    deleteUser,
    getAllUsers
}

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// use mock function as middelware
app.use('/user', (req, res, next) => {
    req.model = userModel;
    next();
})
// user routes
app.use('/user', userRouter)

app.use('/noauth', (req, res, next) => {
    req.model = userModel;
    next();
})
// noauth routes
app.use('/noauth', noAuthRouter)

describe("GET /user ", () => {

    beforeEach(() => {
        getAllUsers.mockReset()
        getAllUsers.mockResolvedValue(0)
    })

    describe("sucessful response", () => {

        test("should respond with 200 status code", (done) => {
            request(app)
                .get('/user')
                .expect(200, done)
        })

        test("should specify json in the content-type response header", (done) => {
            request(app)
                .get('/user')
                .then((response) => {
                    expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
                    done()
                })
        })

        test("should respond with all users in body", async () => {
            const data = [
                { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 1, "USERNAME": "User2", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 1, "USERNAME": "User3", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 2, "USERNAME": "User4", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 2, "USERNAME": "User5", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]
            getAllUsers.mockResolvedValue(data)
            const response = await request(app).get('/user')
            expect(getAllUsers.mock.calls.length).toBe(1)
            expect(response.body).toEqual(data)

        })


    })

    describe("unsuccesful respond", () => {

        test("error in database, should respond with 404 status code", (done) => {
            getAllUsers.mockRejectedValue("Error")
            request(app)
                .get('/user')
                .expect(404, done)
        })

        test("error in database, should respond with empty list in response body", (done) => {
            getAllUsers.mockRejectedValue("Error")
            request(app)
                .get('/user')
                .then((response) => {
                    expect(response.body).toEqual([])
                    done()
                })
        })
    })

})

describe("GET /user/:id", () => {

    beforeEach(() => {
        findUserById.mockReset()
        findUserById.mockResolvedValue(0)
    })

    describe("successful response", () => {

        test("should request the query in database with correct id", async () => {
            const id = "1";


            await request(app).get(`/user/${id}`)
            expect(findUserById.mock.calls.length).toBe(1)
            expect(findUserById.mock.calls[0][0]).toBe(id)

        })


        test("should respond with the correct data in body", async () => {
            const id = "20";
            const data = {
                "ID_USER": 20,
                "ID_STUDIENGANG": 1,
                "USERNAME": "planbuddy",
                "EMAIL": "planbuddy@gmail.com",
                "XP": 5,
                "ROLLE": "User",
            }
            findUserById.mockResolvedValue(data)
            const response = await request(app).get(`/user/${id}`)
            expect(response.body).toEqual(data)
        })

        test("should respond with a 200 status code", async () => {
            const id = "20";
            const data = {
                "ID_USER": 20,
                "ID_STUDIENGANG": 1,
                "USERNAME": "planbuddy",
                "EMAIL": "planbuddy@gmail.com",
                "XP": 5,
                "ROLLE": "User",
            }
            findUserById.mockResolvedValue(data)
            const response = await request(app).get(`/user/${id}`)
            expect(response.statusCode).toBe(200)
        })

        test("should specify json as content-type in response header", async () => {
            const id = "20";
            const data = {
                "ID_USER": 20,
                "ID_STUDIENGANG": 1,
                "USERNAME": "planbuddy",
                "EMAIL": "planbuddy@gmail.com",
                "XP": 5,
                "ROLLE": "User",
            }
            findUserById.mockResolvedValue(data)
            const response = await request(app).get(`/user/${id}`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })

    })

    describe("unsuccesful response", () => {
        test("wrong id type should respond with 400 status code", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/user/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

        test("wrong id type should respond with error object in body", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/user/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })

        test("id not found in database should respond with 404 status code", async () => {
            const id = "111111000"
            findUserById.mockRejectedValue("Error")
            const response = await request(app).get(`/user/${id}`)
            expect(response.statusCode).toBe(404)
        })

        test("id not found in database should respond with empty list in body", async () => {
            const id = "111111000"
            findUserById.mockRejectedValue("Error")
            const response = await request(app).get(`/user/${id}`)
            expect(response.body).toEqual({})
        })

    })

})

describe("GET /user/user/:id", () => {

    beforeEach(() => {
        getTopUsers.mockReset()
        getTopUsers.mockResolvedValue(0)
    })

    describe("successful respond", () => {

        test("should request the query in database with correct id", async () => {
            const id = "5";
            const data = [
                { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 1, "USERNAME": "User2", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 1, "USERNAME": "User3", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 2, "USERNAME": "User4", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 2, "USERNAME": "User5", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]
            getTopUsers.mockResolvedValue(data)
            await request(app).get(`/user/top/${id}`)
            expect(getTopUsers.mock.calls.length).toBe(1)
            expect(getTopUsers.mock.calls[0][0]).toBe(id)

        })

        test("should respond with the correct data in body", async () => {
            const id = "5";
            const data = [
                { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 1, "USERNAME": "User2", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 1, "USERNAME": "User3", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 2, "USERNAME": "User4", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 2, "USERNAME": "User5", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]
            getTopUsers.mockResolvedValue(data)
            const response = await request(app).get(`/user/top/${id}`)
            expect(response.body).toEqual(data)
        })

        test("should respond with a 200 status code", async () => {
            const id = "5";
            const data = [
                { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 1, "USERNAME": "User2", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 1, "USERNAME": "User3", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 2, "USERNAME": "User4", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 2, "USERNAME": "User5", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]
            getTopUsers.mockResolvedValue(data)
            const response = await request(app).get(`/user/top/${id}`)
            expect(response.statusCode).toBe(200)
        })

        test("should specify json as content-type in response header", async () => {
            const id = "5";
            const data = [
                { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 1, "USERNAME": "User2", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 1, "USERNAME": "User3", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 2, "USERNAME": "User4", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 2, "USERNAME": "User5", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]
            getTopUsers.mockResolvedValue(data)
            const response = await request(app).get(`/user/top/${id}`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })

    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/user/top/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

        test("wrong id type should respond with error object in body", async () => {
            const id_data = ["a", "username", "l2345", "*", "1e1", "u111"]
            for (const id of id_data) {
                const response = await request(app).get(`/user/top/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })

        test("id not found in database should respond with 404 status code", async () => {
            const id = "111111000"
            getTopUsers.mockRejectedValue("Error")
            const response = await request(app).get(`/user/top/${id}`)
            expect(response.statusCode).toBe(404)
        })

        test("id not found in database should respond with empty list in body", async () => {
            const id = "111111000"
            getTopUsers.mockRejectedValue("Error")
            const response = await request(app).get(`/user/top/${id}`)
            expect(response.body).toEqual([])
        })

    })
})


describe("PUT /user", () => {

    beforeEach(() => {
        updateUser.mockReset()
        findUserById.mockReset()
        updateUser.mockRejectedValue(0)
        findUserById.mockRejectedValue(0)
    })

    describe("successful respond", () => {

        test("should save the correct data to the database", async () => {
            const body = [
                { "ID_STUDIENGANG": 1, "USERNAME": "Max" },
                { "ID_STUDIENGANG": 1, "USERNAME": "Daniel" },
                { "ID_STUDIENGANG": 3, "USERNAME": "User3" },
                { "ID_STUDIENGANG": 2, "USERNAME": "Tom" },
                { "ID_STUDIENGANG": 1, "USERNAME": "User5" }
            ]


            const foundUsers = [
                { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 1, "USERNAME": "User2", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 1, "USERNAME": "User3", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 2, "USERNAME": "User4", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 2, "USERNAME": "User5", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]
            for (let i = 0; i < body.length; i++) {
                findUserById.mockReset()
                findUserById.mockResolvedValue(foundUsers[i])
                updateUser.mockReset()
                updateUser.mockResolvedValue(body[i])
                await request(app).put(`/user/${i + 1}`).send(body[i])
                expect(updateUser.mock.calls.length).toBe(1)
                expect(findUserById.mock.calls.length).toBe(1)
                expect(updateUser.mock.calls[0][0]).toBe(foundUsers[i].ID_USER)
                expect(updateUser.mock.calls[0][1]).toBe(body[i].ID_STUDIENGANG)
                expect(updateUser.mock.calls[0][2]).toBe(body[i].USERNAME)
            }

        })


        test("should respond with userObject", async () => {
            const body = [
                { "ID_STUDIENGANG": 1, "USERNAME": "Max" },
                { "ID_STUDIENGANG": 1, "USERNAME": "Daniel" },
                { "ID_STUDIENGANG": 3, "USERNAME": "User3" },
                { "ID_STUDIENGANG": 2, "USERNAME": "Tom" },
                { "ID_STUDIENGANG": 1, "USERNAME": "User5" }
            ]


            const foundUsers = [
                { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 1, "USERNAME": "User2", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 1, "USERNAME": "User3", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 2, "USERNAME": "User4", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 2, "USERNAME": "User5", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]

            const returnValue = [
                { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "Max", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 1, "USERNAME": "Daniel", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 3, "USERNAME": "User3", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 2, "USERNAME": "Tom", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 1, "USERNAME": "User5", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]

            for (let i = 0; i < body.length; i++) {
                findUserById.mockReset()
                findUserById.mockResolvedValue(foundUsers[i])
                updateUser.mockReset()
                updateUser.mockResolvedValue(returnValue[i])
                const response = await request(app).put(`/user/${i + 1}`).send(body[i])
                expect(response.body).toBeDefined()
            }
        })

        test("should respond with the updated user attribute username", async () => {
            const body = [
                { "ID_STUDIENGANG": 1, "USERNAME": "Max" },
                { "ID_STUDIENGANG": 2, "USERNAME": "Daniel" },
                { "ID_STUDIENGANG": 3, "USERNAME": "Kurt" },
                { "ID_STUDIENGANG": 4, "USERNAME": "Tom" },
                { "ID_STUDIENGANG": 5, "USERNAME": "Robert" }
            ]


            const foundUsers = [
                { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 2, "USERNAME": "User2", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 3, "USERNAME": "User3", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 4, "USERNAME": "User4", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 5, "USERNAME": "User5", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]

            const returnValue = [
                { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "Max", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 2, "USERNAME": "Daniel", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 3, "USERNAME": "Kurt", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 4, "USERNAME": "Tom", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 5, "USERNAME": "Kurt", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]
            for (let i = 0; i < body.length; i++) {
                findUserById.mockReset()
                updateUser.mockReset()
                findUserById.mockResolvedValue(foundUsers[i])
                updateUser.mockResolvedValue(returnValue[i])
                const response = await request(app).put(`/user/${i + 1}`).send(body[i])
                expect(response.body.ID_USER).toBe(foundUsers[i].ID_USER)
                expect(response.body.ID_STUDIENGANG).toBe(foundUsers[i].ID_STUDIENGANG)
                expect(response.body.USERNAME).toBe(body[i].USERNAME)
                expect(response.body.EMAIL).toBe(foundUsers[i].EMAIL)
                expect(response.body.XP).toBe(foundUsers[i].XP)
                expect(response.body.ROLLE).toBe(foundUsers[i].ROLLE)
            }
        })

        test("should respond with the updated user attribute id_studiengang", async () => {
            const body = [
                { "ID_STUDIENGANG": 3, "USERNAME": "User1" },
                { "ID_STUDIENGANG": 1, "USERNAME": "User2" },
                { "ID_STUDIENGANG": 2, "USERNAME": "User3" },
                { "ID_STUDIENGANG": 5, "USERNAME": "User4" },
                { "ID_STUDIENGANG": 4, "USERNAME": "User5" }
            ]


            const foundUsers = [
                { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 2, "USERNAME": "User2", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 3, "USERNAME": "User3", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 4, "USERNAME": "User4", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 5, "USERNAME": "User5", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]

            const returnValue = [
                { "ID_USER": 1, "ID_STUDIENGANG": 3, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" },
                { "ID_USER": 2, "ID_STUDIENGANG": 1, "USERNAME": "User2", "EMAIL": "user1@gmx.com", "XP": 1, "ROLLE": "User" },
                { "ID_USER": 3, "ID_STUDIENGANG": 2, "USERNAME": "User3", "EMAIL": "user2@gmail.com", "XP": 100, "ROLLE": "User" },
                { "ID_USER": 4, "ID_STUDIENGANG": 5, "USERNAME": "User4", "EMAIL": "user3@gmail.com", "XP": 40, "ROLLE": "User" },
                { "ID_USER": 5, "ID_STUDIENGANG": 4, "USERNAME": "User5", "EMAIL": "user4@gmx.com", "XP": 55, "ROLLE": "User" }
            ]

            for (let i = 0; i < body.length; i++) {
                findUserById.mockReset()
                updateUser.mockReset()
                findUserById.mockResolvedValue(foundUsers[i])
                updateUser.mockResolvedValue(returnValue[i])
                const response = await request(app).put(`/user/${i + 1}`).send(body[i])
                expect(response.body.ID_USER).toBe(foundUsers[i].ID_USER)
                expect(response.body.ID_STUDIENGANG).toBe(body[i].ID_STUDIENGANG)
                expect(response.body.USERNAME).toBe(foundUsers[i].USERNAME)
                expect(response.body.EMAIL).toBe(foundUsers[i].EMAIL)
                expect(response.body.XP).toBe(foundUsers[i].XP)
                expect(response.body.ROLLE).toBe(foundUsers[i].ROLLE)
            }
        })

        test("should respond with 200 status code", async () => {
            const id = 1
            const body = { "ID_STUDIENGANG": 3, "USERNAME": "User1" }
            const foundUsers = { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" }
            const returnValue = { "ID_USER": 1, "ID_STUDIENGANG": 3, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" }

            findUserById.mockResolvedValue(foundUsers)
            updateUser.mockResolvedValue(returnValue)
            const response = await request(app).put(`/user/${id}`).send(body)
            expect(response.statusCode).toBe(200)
        })

        test("should specify json as content-type in respone header", async () => {
            const id = 1
            const body = { "ID_STUDIENGANG": 3, "USERNAME": "User1" }
            const foundUsers = { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" }
            const returnValue = { "ID_USER": 1, "ID_STUDIENGANG": 3, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" }

            findUserById.mockResolvedValue(foundUsers)
            updateUser.mockResolvedValue(returnValue)
            const response = await request(app).put(`/user/${id}`).send(body)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })

    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const id = "aa"
            const body = { "ID_STUDIENGANG": 3, "USERNAME": "User1" }
            const foundUsers = { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" }
            const returnValue = { "ID_USER": 1, "ID_STUDIENGANG": 3, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" }

            findUserById.mockResolvedValue(foundUsers)
            updateUser.mockResolvedValue(returnValue)
            const response = await request(app).put(`/user/${id}`).send(body)
            expect(response.statusCode).toBe(400)
        })

        test("wrong id type should respond with error object", async () => {
            const id = "aa"
            const body = { "ID_STUDIENGANG": 3, "USERNAME": "User1" }
            const foundUsers = { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" }
            const returnValue = { "ID_USER": 1, "ID_STUDIENGANG": 3, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" }

            findUserById.mockResolvedValue(foundUsers)
            updateUser.mockResolvedValue(returnValue)
            const response = await request(app).put(`/user/${id}`).send(body)
            expect(response.body.errors).toBeDefined()
        })

        test("id not found in database should respond with 404 status code", async () => {
            const id = "11111000"
            const body = { "ID_STUDIENGANG": 3, "USERNAME": "User1" }

            findUserById.mockRejectedValue("Error")
            updateUser.mockResolvedValue(0)
            const response = await request(app).put(`/user/${id}`).send(body)
            expect(response.statusCode).toBe(404)
        })

        test("id not found in database should respond with empty json", async () => {
            const id = "11111000"
            const body = { "ID_STUDIENGANG": 3, "USERNAME": "User1" }

            findUserById.mockRejectedValue("Error")
            updateUser.mockResolvedValue(0)
            const response = await request(app).put(`/user/${id}`).send(body)
            expect(response.body).toEqual({})
        })

        test("error when updating the user in database should respond with 400 status code", async () => {
            const id = "11111000"
            const body = { "ID_STUDIENGANG": 3, "USERNAME": "User1" }
            const foundUsers = { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" }

            findUserById.mockResolvedValue(foundUsers)
            updateUser.mockRejectedValue("Error")
            const response = await request(app).put(`/user/${id}`).send(body)
            expect(response.statusCode).toBe(400)
        })

        test("error when updating the user in database should respond empty json", async () => {
            const id = "11111000"
            const body = { "ID_STUDIENGANG": 3, "USERNAME": "User1" }
            const foundUsers = { "ID_USER": 1, "ID_STUDIENGANG": 1, "USERNAME": "User1", "EMAIL": "user@gmail.com", "XP": 15, "ROLLE": "User" }

            findUserById.mockResolvedValue(foundUsers)
            updateUser.mockRejectedValue("Error")
            const response = await request(app).put(`/user/${id}`).send(body)
            expect(response.body).toEqual({})
        })
    })

})

describe("DELETE /user", () => {

    beforeEach(() => {
        deleteUser.mockReset
        deleteUser.mockResolvedValue(0)
    })
    describe("successful respond", () => {

        test("user should be deleted in the database", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                deleteUser.mockReset()
                deleteUser.mockResolvedValue(0)
                await request(app).delete(`/user/${id}`)
                expect(deleteUser.mock.calls.length).toBe(1)
                expect(deleteUser.mock.calls[0][0]).toBe(id.toString())
            }
        })

        test("should respond with 200 status code", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                deleteUser.mockReset()
                deleteUser.mockResolvedValue(0)
                const response = await request(app).delete(`/user/${id}`)
                expect(response.statusCode).toBe(200)
            }
        })

        test("should respond with empty json body", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                deleteUser.mockReset()
                deleteUser.mockResolvedValue(0)
                const response = await request(app).delete(`/user/${id}`)
                expect(response.body).toEqual({})
            }
        })

        test("should specify json in content-type response header", async () => {
            const idData = [1, 10, 11000, 123]
            for (const id of idData) {
                deleteUser.mockReset()
                deleteUser.mockResolvedValue(0)
                const response = await request(app).delete(`/user/${id}`)
                expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
            }
        })
    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const idData = ['aa', '*', '9wwer999', '123l']
            for (const id of idData) {
                const response = await request(app).delete(`/user/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })

        test("wrong id type should respond with error object", async () => {
            const idData = ['aa', '*', '9wwer999', '123l']
            for (const id of idData) {
                const response = await request(app).delete(`/user/${id}`)
                expect(response.body.errors).toBeDefined()
            }
        })

        test("id not found in database should respond with 404 status code", async () => {
            const idData = [111, 10, 15, 1000000]
            for (const id of idData) {
                deleteUser.mockReset()
                deleteUser.mockRejectedValue(new IdNotFoundError("Nothing was deleted!"))
                const response = await request(app).delete(`/user/${id}`)
                expect(response.statusCode).toBe(404)
            }
        })

        test("error in database should respond with 400 status code", async () => {
            const idData = [111, 10, 15, 1000000]
            for (const id of idData) {
                deleteUser.mockReset()
                deleteUser.mockRejectedValue("Error")
                const response = await request(app).delete(`/user/${id}`)
                expect(response.statusCode).toBe(400)
            }
        })
    })
})
/*
describe("POST /noauth/register", () => {

    beforeEach(() => {
        createUser.mockReset()
        createUser.mockResolvedValue(0)
        checkIfEmailIsTaken.mockReset()
        checkIfEmailIsTaken.mockResolvedValue(0)
    })


    describe("successful response", () => {

        test("should save the correct data to the database", async () => {
            const body = { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "planBUDDY123#" }

            checkIfEmailIsTaken.mockResolvedValue(false)
            const res = await request(app).post('/noauth/register').send(body)
            expect(createUser.mock.calls.length).toBe(1)
            expect(createUser.mock.calls[0][0]).toBe(body.USERNAME)
            expect(createUser.mock.calls[0][1]).toBe(body.EMAIL)
            expect(createUser.mock.calls[0][2]).toBeDefined()

        })

        test("should respond with a user object", async () => {
            const body = { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "planBUDDY123#" }

            createUser.mockReset()
            createUser.mockResolvedValue(body)
            const response = await request(app).post('/noauth/register').send(body)
            expect(response.body).toBeDefined()
        })

        test("should specify json in the content-type response header", async () => {
            const body = { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "planBUDDY123#" }
            const response = await request(app).post('/noauth/register').send(body)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })

        test("hsoud respond with a status code of 200", async () => {
            const body = { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "planBUDDY123#" }

            createUser.mockReset()
            createUser.mockResolvedValue(0)
            const response = await request(app).post('/noauth/register').send(body)
            expect(response.statusCode).toBe(200)

        })

        test("should respond with user object and requested attributes", async () => {
            const body = { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "planBUDDY123#" }

            const returnValueData = { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com" }

            createUser.mockReset()
            createUser.mockResolvedValue(returnValueData)
            const response = await request(app).post('/noauth/register').send(body)
            expect(response.body.USERNAME).toBe(body.USERNAME);
            expect(response.body.EMAIL).toBe(body.EMAIL);
            expect(response.body.TOKEN).toBeDefined();
        })
    })

    describe("unsuccessful response", () => {

        test("wrong attributes in the json request object should respond with 400 status code ", (done) => {
            const bodyData = [
                { USERNAME: "", EMAIL: "planbuddy@gmail.com", PASSWORT: "planBUDDY123#" },
                { USERNAME: "planbuddy", EMAIL: "planbuddy", PASSWORT: "planBUDDY123#" },
                { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "plan" }
            ]
            for (const body of bodyData) {
                request(app)
                    .post('/noauth/register')
                    .send(body)
                    .expect(400, done)
            }
        })

        test("wrong id type should respond with error object in body", async () => {
            const bodyData = [
                { USERNAME: "", EMAIL: "planbuddy@gmail.com", PASSWORT: "planBUDDY123#" },
                { USERNAME: "planbuddy", EMAIL: "planbuddy", PASSWORT: "planBUDDY123#" },
                { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "plan" }
            ]
            for (const body of bodyData) {
                const response = await request(app).post('/noauth/register').send(body)
                expect(response.body.errors).toBeDefined()
            }
        })

        test("database error should respond with 400 error code", async () => {
            const bodyData = [
                { USERNAME: "", EMAIL: "planbuddy@gmail.com", PASSWORT: "planBUDDY123#" },
                { USERNAME: "planbuddy", EMAIL: "planbuddy", PASSWORT: "planBUDDY123#" },
                { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "plan" }
            ]

            for (const body of bodyData) {
                createUser.mockReset()
                createUser.mockRejectedValue("Error")
                const response = await request(app).post('/noauth/register').send(body)
                expect(response.statusCode).toBe(400)
            }

        })

        test("email already exists should response with a status code of 409", async () => {
            const body = { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "planBUDDY123#" }

            checkIfEmailIsTaken.mockResolvedValue(true)
            const response = await request(app).post('/noauth/register').send(body)
            expect(response.statusCode).toBe(409)

        })

    })

})

describe("POST /noauth/login", () => {

    beforeEach(() => {
        findUserByEmail.mockReset()
        findUserByEmail.mockResolvedValue(0)
    })


    describe("successful response", () => {

        test("should save the correct data to the database", async () => {
            const body = { EMAIL: "planbuddy@gmail.com", PASSWORT: "123PLANbuddy#" }
            const user = { ID_USER: 1, ID_STUDIENGANG: 1, USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi", XP: 145, ROLLE: "User" }

            findUserByEmail.mockResolvedValue(user)
            await request(app).post('/noauth/login').send(body)
            expect(findUserByEmail.mock.calls.length).toBe(1)
            expect(findUserByEmail.mock.calls[0][0]).toBe(body.EMAIL)

        })


        test("should respond with a user object", async () => {
            const body = { EMAIL: "planbuddy@gmail.com", PASSWORT: "123PLANbuddy#" }
            const user = { ID_USER: 1, ID_STUDIENGANG: 1, USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi", XP: 145, ROLLE: "User" }

            findUserByEmail.mockResolvedValue(user)
            const response = await request(app).post('/noauth/login').send(body)
            expect(response).toBeDefined()
        })

        test("should specify json in the content-type response header", async () => {
            const body = { EMAIL: "planbuddy@gmail.com", PASSWORT: "123PLANbuddy#" }
            const user = { ID_USER: 1, ID_STUDIENGANG: 1, USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi", XP: 145, ROLLE: "User" }

            findUserByEmail.mockResolvedValue(user)
            const response = await request(app).post('/noauth/login').send(body)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })

        test("should respond with a status code of 200", async () => {
            const body = { EMAIL: "planbuddy@gmail.com", PASSWORT: "123PLANbuddy#" }
            const user = { ID_USER: 1, ID_STUDIENGANG: 1, USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi", XP: 145, ROLLE: "User" }

            findUserByEmail.mockResolvedValue(user)
            const response = await request(app).post('/noauth/login').send(body)
            expect(response.statusCode).toBe(200)

        })

        test("should respond with user object and requested attributes", async () => {
            const body = { EMAIL: "planbuddy@gmail.com", PASSWORT: "123PLANbuddy#" }
            const user = { ID_USER: 1, ID_STUDIENGANG: 1, USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi", XP: 145, ROLLE: "User" }

            findUserByEmail.mockResolvedValue(user)
            const response = await request(app).post('/noauth/login').send(body)
            expect(response.body.ID_USER).toBe(user.ID_USER);
            expect(response.body.ID_STUDIENGANG).toBe(user.ID_STUDIENGANG);
            expect(response.body.USERNAME).toBe(user.USERNAME);
            expect(response.body.EMAIL).toBe(user.EMAIL);
            expect(response.body.XP).toBe(user.XP);
            expect(response.body.ROLLE).toBe(user.ROLLE);
            expect(response.body.TOKEN).toBeDefined();
        })
    })

    describe("unsuccessful response", () => {

        test("wrong attributes in the json request object should respond with 400 status code ", (done) => {
            const bodyData = [
                { EMAIL: "", PASSWORT: "123PLANbuddy#" },
                { EMAIL: "planbuddy@gmail.com", PASSWORT: "" },
            ]
            for (const body of bodyData) {
                request(app)
                    .post('/noauth/login')
                    .send(body)
                    .expect(400, done)
            }
        })

        test("wrong attribute should respond with error object in body", async () => {
            const bodyData = [
                { EMAIL: "", PASSWORT: "123PLANbuddy#" },
                { EMAIL: "planbuddy@gmail.com", PASSWORT: "" },
            ]
            for (const body of bodyData) {
                const response = await request(app).post('/noauth/login').send(body)
                expect(response.body.errors).toBeDefined()
            }
        })
        
        test("database error should respond with 400 error code", async () => {
            const bodyData = [
                { USERNAME: "hello", EMAIL: "planbuddy@gmail.com", PASSWORT: "planBUDDY123#" },
                { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "planBUDDY123#" }
            ]

            for (const body of bodyData) {
                findUserByEmail.mockReset()
                findUserByEmail.mockRejectedValue("Error")
                const response = await request(app).post('/noauth/login').send(body)
                expect(response.statusCode).toBe(400)
            }

        })

        test("invalid credentials", async () => {
            const body = { USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "####planBUDDY123#1293812" }
            const user = { ID_USER: 1, ID_STUDIENGANG: 1, USERNAME: "planbuddy", EMAIL: "planbuddy@gmail.com", PASSWORT: "$2a$10$jyVVRXmAPGozuMrbBuHw9u90bHwcM1YBlNhTbpmN7KLBqc5KR7exi", XP: 145, ROLLE: "User" }

            findUserByEmail.mockResolvedValue(true)
            const response = await request(app).post('/noauth/login').send(body)
            expect(response.statusCode).toBe(400)
        })
    })
})
*/