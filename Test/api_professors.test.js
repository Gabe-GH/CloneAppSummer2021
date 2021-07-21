const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const request = require("supertest");
const app = require('../Server/app');

const Professor = require('../Mongo/Professors')

const URI = process.env.DB_TEST;


beforeAll(async() => {
    await mongoose.connect(
        URI,
        {useNewUrlParser: true,
         useUnifiedTopology: true}
    );
    const db = mongoose.connection;
});

afterEach(async() => {
    await Professor.deleteMany({}).exec(); 
});


afterAll(async() => {
    await mongoose.connection.close({});
});

// ************
// HAPPY PATHS
// ************

// Test if server is responding correctly
describe("GET /", () => {
    test("Should be connected to server", async() => {
        const serverResponse = await request(app).get("/");
        
        // checks for a status of 204
        expect(serverResponse.status).toBe(204);
    });
});


// Tests if document reads all documents residing in collection
describe("GET /test", () => {
    test("Should read all documents in collection", async() => {
        const newProfessor = await createFiveEntries();
        
        const result = await request(app)
        .get("/professors/");
        
        const professors = await Professor.find();
        //console.log(professors);
        
        expect(professors.length).toEqual(5);
        expect(result.body.length).toEqual(5);
        expect(result.status).toBe(200);
    });
    
    
});

// Tests if server calls document correctly through id
describe("GET /test/:id", () => {
    test("Should get document through id call", async () => {
        const newProfessor = await createOneEntry();
        
        const server_result = await request(app)
        .get(`/professors/${newProfessor.body._id}`);
        
        expect(newProfessor.body._id.toString()).toStrictEqual(server_result.body._id);
        expect(server_result.status).toBe(200);
    });
});

// Tests return body of a POST request
describe("POST /test", () => {
    test("Should return same data sent to db", async() => {
        const newProfessor = await createOneEntry();

        // checks for name in res.body just sent to match
        // for a status of 201
        expect(newProfessor.body.name).toBe("testCase");
        expect(newProfessor.status).toBe(201);

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
            .post(`/professors/${newProfessor.body._id}`)
            .send(updateData);

        const db_professor = await Professor.findOne({_id: server_result.body._id})
        
        expect(server_result.body).toBeTruthy();
        expect(server_result.body.name).toEqual(updateData.name);
        expect(server_result.body.department).toEqual(updateData.department);
        expect(server_result.status).toEqual(201);

        expect(db_professor).toBeTruthy();
        expect(db_professor.name).toEqual(server_result.body.name);
        expect(db_professor.department).toEqual(server_result.body.department);

    });
});


// Tests deleting a document from the collection
describe("DELETE /test/:id", () => {
    test("Should delete a professor from the database", async() => {

        const newProfessors = await createFiveEntries();
        expect(newProfessors).toBeTruthy();
        
        const count = await Professor.estimatedDocumentCount();
        expect(count).toEqual(5);

        const prof =  await Professor.findOne({name: "testCase3"});
        expect(prof).toBeTruthy();

        server_result = await request(app)
            .delete(`/professors/${prof._id}`);
        
        const queryResult = await Professor.findById(prof._id);

        expect(queryResult).not.toBeTruthy();
        expect(queryResult).toBe(null);
        expect(server_result.body.message).toEqual("document deleted");
        expect(server_result.body._id).toEqual(prof._id.toString())
        expect(server_result.body.count).toEqual(4);
        expect(server_result.status).toEqual(202);

    });
});

// *************
//  ERROR TESTS 
// *************

// Tests proper server response when attempting to
// access an empty collection
describe("GET /test", () => {
    test("Should receive an error message when accessing an empty collection", async() => {
        await Professor.deleteMany({}).exec();
        const professors = await Professor.find();
        expect(professors.length).toEqual(0);
        
        const result = await request(app)
        .get("/professors");

        expect(result.body.Error).toBeTruthy();
        expect(result.status).toBe(404);
    });
});

// Tests proper server response when attempting to acces
// a nonexistent doc by id
describe("GET /test/:id", () => {
    test("Should receive an error message when accessing a nonexistent document in collection", async() => {
        const newProfessor = await createOneEntry();
        let professors = await Professor.find();
        expect(professors.length).toEqual(1);

        const professor_id = newProfessor.body._id;
        expect(professor_id).toBeTruthy();

        await Professor.deleteMany({}).exec();
        professors = await Professor.find();
        expect(professors.length).toEqual(0);

        const result = await request(app)
            .get(`/professors/${professor_id}`);

        expect(result.body).toBeTruthy();
        expect(result.body.Error).toBeTruthy();
        expect(result.status).toBe(404);
    });
});

// Tests returning an error status when
// attempting to save an unvalidated schema doc
// with no fields sent to server
describe("POST /test", () => {
    test("Should receive an error when attempting to create a document with no fields passed", async() => {
        newProfessor = await request(app)
            .post("/professors")
            .send({});
        
        expect(newProfessor.body).toBeTruthy();
        expect(newProfessor.body.errors).toBeTruthy();
        expect(400)
    });
});

// Tests returning an error status when
// attempting to save an unvalidated schema doc
// with only partial fields sent to server
describe("POST /test", () => {
    test("Should receive an error when attempting to create a document with only name field passed", async() => {
        newProfessor = await request(app)
            .post("/professors")
            .send({name: "name1"});
        
        expect(newProfessor.body).toBeTruthy();
        expect(newProfessor.body.errors).toBeTruthy();
        expect(400)
    });
});

// Tests returning an error status when
// attempting to save an unvalidated schema doc
// with only partial fields sent to server
describe("POST /test", () => {
    test("Should receive an error when attempting to create a document with only name and department field passed", async() => {
        newProfessor = await request(app)
            .post("/professors")
            .send({
                name: "name1",
                department: "department1"
            });
        
        expect(newProfessor.body).toBeTruthy();
        expect(newProfessor.body.errors).toBeTruthy();
        expect(400)
    });
});

// Tests returning an error status when
// attempting to save an unvalidated schema doc
// with only partial fields sent to server
describe("POST /test", () => {
    test("Should receive an error when attempting to create a document with only name and email field passed", async() => {
        newProfessor = await request(app)
            .post("/professors")
            .send({
                name: "name1",
                email: "email1"
            });
        
        expect(newProfessor.body).toBeTruthy();
        expect(newProfessor.body.errors).toBeTruthy();
        expect(400)
    });
});

// Tests returning an error status when
// attempting to save an unvalidated schema doc
// with only partial fields sent to server
describe("POST /test", () => {
    test("Should receive an error when attempting to create a document with only department and email field passed", async() => {
        newProfessor = await request(app)
            .post("/professors")
            .send({
                department: "department1",
                email: "email1"
            });
        
        expect(newProfessor.body).toBeTruthy();
        expect(newProfessor.body.errors).toBeTruthy();
        expect(400)
    });
});

// Tests returning an error status when
// attempting to update a document not saved
// to the database
describe("POST /test/:id", () => {
    test("Should receive an error when attempting to update a nonexistent document in the collection", async() => {
        
        //  Model Prep
        const newProfessor = await createOneEntry();
        let professors = await Professor.find();
        expect(professors.length).toEqual(1);

        const professor_id= newProfessor.body._id;
        expect(professor_id).toBeTruthy();

        await Professor.deleteMany({}).exec();
        professors = await Professor.find();
        expect(professors.length).toEqual(0);

        // Action on server
        const server_result = await request(app)
            .post(`/professors/${professor_id}`)
            .send({
                name: "Updated Name",
                email: "updated Email",
                department: "Updated Dept"
            });
        
        expect(server_result.body).toBeTruthy();
        expect(server_result.body.Error).toBeTruthy();
        expect(server_result.status).toEqual(404);
    });
});

// Tests returning an error status when attempting
// to delete a nonexistent document from the collection

describe("DELETE /test/:id", () => {
    test("Should receive an error when attempting to delete a nonexistent document from the collection", async() => {

        //  Model Prep
        const newProfessor = await createOneEntry();
        let professors = await Professor.find();
        expect(professors.length).toEqual(1);

        const professor_id= newProfessor.body._id;
        expect(professor_id).toBeTruthy();

        await Professor.deleteMany({}).exec();
        professors = await Professor.find();
        expect(professors.length).toEqual(0);

        // Action on server
        const server_result = await request(app)
            .delete(`/professors/${professor_id}`);

        expect(server_result.body).toBeTruthy();
        expect(server_result.body.Error).toBeTruthy();
        expect(server_result.status).toEqual(404);
    })
})


// **********
//  FUNCTIONS
// **********

// Functions for DRY methods
async function createFiveEntries() {
    let newProfessor;
    try {
        for (let i = 1; i <= 5; i++) {
            newProfessor = await request(app)
                .post("/professors")
                .send({
                    name: "testCase" + i,
                    email: `email${i}@email.com`,
                    department: "testDept" + i
                });
        };
        return newProfessor;
    } catch(e) {
        return console.log(e);
    }
};

async function createOneEntry(name = "testCase") {
    let newProfessor;

    try{
        newProfessor = await request(app)
            .post("/professors")
            .send({
                name: name,
                email: "email@email.com",
                department: "testDept"
            });

        return newProfessor;
    } catch(e) {
        return console.log(e);
    }
};


