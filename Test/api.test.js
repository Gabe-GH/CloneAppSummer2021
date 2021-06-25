const URI_test = require('../Mongo/config').dev;
const mongoose = require('mongoose');
const http = require('http');
const request = require("supertest");
const app = require("../Server/server");
const Professor = require("../Mongo/TestProfessors");

afterEach(async() => {
    await Professor.deleteMany();
})

// Test if server is responding correctly
describe("GET /", () => {
    test("Should be connected to server", async() => {
        const serverResponse = await request(app).get("/");
        
        // checks if response body includes connection string
        // and a status of 202
        expect(serverResponse.body).toBe("Connected to server");
        expect(serverResponse.status).toBe(202);
    
    });
});

// Tests return body of a POST request
describe("POST /test/create", () => {
    test("Should return same data sent to db", async() => {
        const newProfessor = await createOneEntry();

        // checks for name in res.body just sent to match
        // for a status of 201
        expect(newProfessor.body.name).toBe("testCase");
        expect(newProfessor.statusCode).toBe(201);

    });
});

// // Tests saving a Professor to collection
describe("POST /test/create", () => {
    test("Should save a professor to database", async () => {
        const newProfessor = await createOneEntry();
        
        // Searches for the professor in the database
        const professor = await Professor.findOne({name: 'testCase'});

        //checks for document to be created in collection
        expect(professor.name).toBeTruthy();
        expect(professor.department).toBeTruthy();
    });
});

// Tests if document reads all documents residing in collection
describe("GET /test/", () => {
    test("Should read all documents in collection", async() => {
        const newProfessor = await createFiveEntries();
        
        const result = await request(app)
            .get("/test/");
        
        const professors = await Professor.find();
        console.log(professors);

        expect(professors.length).toEqual(5);
    });


})

async function createFiveEntries() {
    let newProfessor;
    try {
        for (let i = 0; i < 5; i++) {
            newProfessor = await request(app)
                .post("/test/create")
                .send({
                    name: "testCase" + i,
                    department: "testDept" + i
                });
        };
    } catch(e) {
        return console.log(e);
    }
    return newProfessor;
}

async function createOneEntry() {
    let newProfessor;

    try{
        newProfessor = await request(app)
            .post("/test/create")
            .send({
                name: "testCase",
                department: "testDept"
            });

        return newProfessor;
    } catch(e) {
        return console.log(e);
    }
};


