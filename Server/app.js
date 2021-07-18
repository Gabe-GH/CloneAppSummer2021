// Dependencies
const express = require("express");
const app = express();

// Route Imports
const professorsAPI = require('../Routes/API/professors');
const testAPI = require('../Routes/API/test_prof');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes to access
app.use('/professors', professorsAPI);
app.use('/test', testAPI);

// Root
app.get('/', (req,res) => {
    res.status(204).json("Connected to server");
});



module.exports = app;