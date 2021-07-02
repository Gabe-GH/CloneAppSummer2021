const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const request = require("supertest");
const app = require('../Server/app');

const Professor = require("../Mongo/TestProfessors");
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@utrgvrmp.zsqqp.mongodb.net/${process.env.DB_TESTDB}?retryWrites=true&w=majority`


afterEach(async() => {
    await Professor.deleteMany({}).exec(); 
});

beforeAll(async() => {
    await mongoose.connect(
        URI,
        {useNewUrlParser: true,
         useUnifiedTopology: true}
    );
    const db = mongoose.connection;
});

afterAll(async() => {
    await mongoose.connection.close({});
});

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


// Tests if document reads all documents residing in collection
describe("GET /test", () => {
    test("Should read all documents in collection", async() => {
        const newProfessor = await createFiveEntries();
        
        const result = await request(app)
        .get("/test/");
        
        const professors = await Professor.find();
        //console.log(professors);
        
        expect(professors.length).toEqual(5);
        expect(result.body.length).toEqual(5);
    });
    
    
});

// Tests if server calls document correctly through id
describe("GET /test/:id", () => {
    test("Should get document through id call", async () => {
        const newProfessor = await createOneEntry();
        
        const server_result = await request(app)
        .get(`/test/${newProfessor.body._id}`);
        
        expect(newProfessor.body._id.toString()).toStrictEqual(server_result.body._id);
        expect(server_result.status).toBe(205);
    });
});

// Tests return body of a POST request
describe("POST /test", () => {
    test("Should return same data sent to db", async() => {
        const newProfessor = await createOneEntry();

        // checks for name in res.body just sent to match
        // for a status of 201
        expect(newProfessor.body.name).toBe("testCase");
        expect(newProfessor.statusCode).toBe(201);

    });
});


// Tests saving a Professor to collection
describe("POST /test", () => {
    test("Should save a professor to database", async () => {
        const newProfessor = await createOneEntry();
        
        // Searches for the professor in the database
        const professor = await Professor.findOne({name: 'testCase'});

        //checks for document to be created in collection
        expect(professor.name).toEqual(newProfessor.body.name);
        expect(professor.department).toEqual(newProfessor.body.department);
    });
});

// Tests updating a professor in collection
describe("POST /test/:id", () => {
    test("Should update a professor in database", async () => {
        const newProfessor = await createOneEntry();

        expect(newProfessor.body.name).toEqual("testCase");
        expect(newProfessor.body.department).toEqual("testDept");

        const updateData = {
            name: "Name Updated",
            department: "Department Updated"
        };

        server_result = await request(app)
            .post(`/test/${newProfessor.body._id}`)
            .send(updateData);

        const db_professor = await Professor.findOne({_id: server_result.body._id})
        
        expect(server_result.body).toBeTruthy();
        expect(server_result.body.name).toEqual(updateData.name);
        expect(server_result.body.department).toEqual(updateData.department);

        expect(db_professor).toBeTruthy();
        expect(db_professor.name).toEqual(server_result.body.name);
        expect(db_professor.department).toEqual(server_result.body.department);

    });
});

describe("DELETE /test/:id", () => {
    test("Should delete a professor from the database", async() => {

        const newProfessors = await createFiveEntries();
        expect(newProfessors).toBeTruthy();
        
        const count = await Professor.estimatedDocumentCount();
        expect(count).toEqual(5);

        const prof =  await Professor.findOne({name: "testCase3"});
        expect(prof).toBeTruthy();

        server_result = await request(app)
            .delete(`/test/${prof._id}`);
        
        const queryResult = await Professor.findById(prof._id);

        expect(queryResult).not.toBeTruthy();
        expect(queryResult).toBe(null);
        expect(server_result.body.message).toEqual("document deleted");
        expect(server_result.body._id).toEqual(prof._id.toString())
        expect(server_result.body.count).toEqual(4);
        expect(server_result.status).toEqual(202);

    });
});

// Tests proper server response when attempting to
// access an empty collection
describe("GET /test", () => {
    test("Should receive an error message when accessing an empty collection", async() => {
        await Professor.deleteMany({}).exec();
        const professors = await Professor.find();
        expect(professors.length).toEqual(0);
        
        const result = await request(app)
        .get("/test");

        expect(result.body.message).toBeTruthy();
        expect(result.body.message).toEqual("The collection is reporting empty!");
        expect(result.body.count).toEqual(0);
        expect(result.status).toBe(404);
    });
});



// Functions for DRY
async function createFiveEntries() {
    let newProfessor;
    try {
        for (let i = 0; i < 5; i++) {
            newProfessor = await request(app)
                .post("/test")
                .send({
                    name: "testCase" + i,
                    department: "testDept" + i
                });
        };
    } catch(e) {
        return console.log(e);
    }
    return newProfessor;
};

async function createOneEntry(name = "testCase") {
    let newProfessor;

    try{
        newProfessor = await request(app)
            .post("/test")
            .send({
                name: name,
                department: "testDept"
            });

        return newProfessor;
    } catch(e) {
        return console.log(e);
    }
};


