const URI_test = require('../Mongo/config').dev;
const mongoose = require('mongoose');
const http = require('http');
const request = require("supertest");
const app = require("../Server/server");


// beforeAll(async () => {
//     await mongoose.connect(URI_test, {useNewUrlParser: true, useUnifiedTopology: true});

// })


// it('Should save new professor to database', async done => {
//     const options = {
//         port: 3000,
//         path: '/create',
//         method: 'POST'
//     };
//     const data = JSON.stringify({
//         'name': 'testCase',
//         'department': 'CSCI'
//     });

//     const res = await http.request(options, () => {
//         res.write(data);
//         res.end;
//         done()
//     })
// });

describe("POST /test/create", () => {
    test("Should save new professor to database", async() => {
        const newProfessor = await request(app)
            .post("/test/create")
            .send({
            name: "testCase",
            department: "testDept"
        });

        //expect(newProfessor.body).toHaveProperty("_id");
        expect(newProfessor.body.name).toBe("testCase");
        expect(newProfessor.statusCode).toBe(205);

        // const response = await request(app).get("/");
        // expect(response.body.length).toBe(1);

    });
});

