const dotenv = require('dotenv');
dotenv.config();
const mongoose = require("mongoose");
const getCSCIProfessorData = require('../Scraper/scraper_professorNames');

const Professor = require("./Professors");


async function populateCSCIProfessorData() {
    const data = await getCSCIProfessorData();
    console.log(data[0]);
    console.log(data.length);

    await data.reduce(async (memo, professor) => {
        await memo;
        const newProfessor = new Professor({name: professor.name, email: professor.email, department: professor.department});
        
        try {
            const result = await newProfessor.save();
        } catch(e){
            console.log(e);
        };
        
        console.log(data.indexOf(professor));
        console.log("success");

    }, undefined);
    console.log("done");
};

async function connectMongoose() {
    const URI = (process.env.NODE_ENV == "test_env") ? process.env.DB_TEST : process.env.DB_DEV;

    mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, async() => {
        db = mongoose.connection;
        console.log(`Connected to MongoDB`);
    });
};

async function disconnectMongoose() {
    await mongoose.connection.close({}, () => {
        console.log("connection closed");
    });
};

(async () => {
    await connectMongoose();
    await populateCSCIProfessorData();
    await disconnectMongoose();
})();