const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const request = require("supertest");
const app = require('../Server/app');
const getCSCIProfessorData = require('../Scraper/scraper_professorNames');

const Professor = require("../Mongo/TestProfessors");
const URI = process.env.DB_TEST;

beforeAll(async() => {
    await mongoose.connect(
        URI,
        {useNewUrlParser: true,
         useUnifiedTopology: true,
         useFindAndModify: false,
         useCreateIndex: true
        }
    );
    const db = mongoose.connection;
});

afterEach(async() => {
    await Professor.deleteMany({}).exec(); 
});


afterAll(async() => {
    await mongoose.connection.close({});
});


// ******************************************
// CSCI PROFESSOR SCRAPER FROM UTRGV WEBSITE
// ******************************************

// Test gets data correctly from website
describe("Scrape data from CSCI staff page", () => {
    test("Should return an array full of objects with infromation pertaining to its respected staff member", async() => {
        const data = await getCSCIProfessorData();
        expect(data).toBeTruthy();

        expect(typeof data[0].name).toBe("string");
        expect(typeof data[0].email).toBe("string");
        expect(typeof data[0].department).toBe("string");

        expect(data[0].name).toBeTruthy();
        expect(data[0].email).toBeTruthy();
        expect(data[0].department).toBe("Computer Science");

        expect(data[0].email.includes("@")).toBe(true);
        expect(data[0].email.includes(".edu")).toBe(true);

    })
});

// describe("Scraped professor data should populate the collection in db",() => {
//     test("Db should contain scraped professor data including name, email, department", async() => {
//         const functionResult = await populateCSCIProfessorData();
//         expect(functionResult).toBe(true);
        
//         const dbResult = await  
        

//     })
// });
