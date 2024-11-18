const request = require('supertest');
const express = require('express')
var degreeprogramRouter = require('../routes/degreeprogram.route');

// mock database access functions
const getAll = jest.fn()
const findOneById = jest.fn()
const degreeprogramModel = {
    getAll,
    findOneById
}

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// use mock function as middelware
app.use('/degreeprogram', (req, res, next) => {
    req.model = degreeprogramModel;
    next();
})
// degreeprogram routes
app.use('/degreeprogram', degreeprogramRouter)

describe("GET /degreeprogram", () => {

    beforeEach(() => {
        getAll.mockReset()
        getAll.mockResolvedValue(0)
    })

    describe("successful response", () => {
        test("should respond with a 200 status code", async () => {
            const response = await request(app).get('/degreeprogram')
            expect(response.statusCode).toBe(200)
        })

        test("should specify json in the content-type response header", async () => {
            const response = await request(app).get('/degreeprogram')
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })

        test("should respond with all degree programs in body", async () => {
            const data = {
                0: "Informatik",
                1: "Mathematik",
                2: "Physik",
            }
            getAll.mockResolvedValue(data)
            const response = await request(app).get('/degreeprogram')
            expect(getAll.mock.calls.length).toBe(1)
            expect(response.body).toEqual(data)
        })
    })

    describe("unsuccessful response", () => {

        test("error in database, should respond with 404 status code", async () => {
            getAll.mockRejectedValue("Error")
            const response = await request(app).get('/degreeprogram/')
            expect(response.statusCode).toBe(404)
        })
        test("error in database, should respond with empty json in response body", async () => {
            getAll.mockRejectedValue("Error")
            const response = await request(app).get('/degreeprogram/')
            expect(response.body).toEqual({})
        })
    })

})

describe("GET /degreeprogram/:id", () => {

    beforeEach(() => {
        findOneById.mockReset()
        findOneById.mockResolvedValue(0)
        findOneById.mockRejectedValue(0)

    })

    describe("successful response", () => {

        test("should request the query in database with correct id", async () => {
            const id = "1";
            const data = { 1: "informatik" }
            findOneById.mockResolvedValue(data)
            await request(app).get(`/degreeprogram/${id}`)
            expect(findOneById.mock.calls.length).toBe(1)
            expect(findOneById.mock.calls[0][0]).toBe(id)
        })

        test("should respond with the correct data in body", async () => {
            const id = "1";
            const data = { 1: "informatik" }
            findOneById.mockResolvedValue(data)
            const response = await request(app).get(`/degreeprogram/${id}`)
            expect(response.body).toEqual(data)
        })

        test("should respond with a 200 status code", async () => {
            const id = "1";
            const data = { 1: "informatik" }
            findOneById.mockResolvedValue(data)
            const response = await request(app).get(`/degreeprogram/${id}`)
            expect(response.statusCode).toBe(200)
        })

        test("should specify json as content-type in response header", async () => {
            const id = "1";
            const data = { 1: "informatik" }
            findOneById.mockResolvedValue(data)
            const response = await request(app).get(`/degreeprogram/${id}`)
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    })

    describe("unsuccessful response", () => {

        test("wrong id type should respond with 400 status code", async () => {
            const id = "aa";
            const response = await request(app).get(`/degreeprogram/${id}`)
            expect(response.statusCode).toBe(400)
        })

        test("wrong id type should respond with error object in body", async () => {
            const id = "aa";
            const response = await request(app).get(`/degreeprogram/${id}`)
            expect(response.body.errors).toBeDefined()
        })
        
        test("id not found in database should respond with 404 status code", async () => {
            const id = 1;
            findOneById.mockRejectedValue("Error")
            const response = await request(app).get(`/degreeprogram/${id}`)
            expect(response.statusCode).toBe(404)
        })

        test("id not found in database should respond with empty json in body", async () => {
            const id = 1;
            findOneById.mockRejectedValue("Error")
            const response = await request(app).get(`/degreeprogram/${id}`)
            expect(response.body).toEqual({})
        })
    })


})