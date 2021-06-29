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
describe("GET /test/", () => {
    test("Should read all documents in collection", async() => {
        const newProfessor = await createFiveEntries();
        
        const result = await request(app)
        .get("/test/");
        
        const professors = await Professor.find();
        //console.log(professors);
        
        expect(professors.length).toEqual(5);
    });
    
    
});

// Tests if server calls document correctly through id
describe("GET /test/:id", () => {
    test("Should get document through id call", async () => {
        const newProfessor = await createOneEntry();
        const professor_result = await Professor.findOne({name: newProfessor.body.name});
        
        const server_result = await request(app)
        .get(`/test/${professor_result._id}`);
        
        expect(professor_result._id.toString()).toStrictEqual(server_result.body._id);
        expect(server_result.status).toBe(205);
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
};

async function createOneEntry(name = "testCase") {
    let newProfessor;

    try{
        newProfessor = await request(app)
            .post("/test/create")
            .send({
                name: name,
                department: "testDept"
            });

        return newProfessor;
    } catch(e) {
        return console.log(e);
    }
};


