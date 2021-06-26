const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const Comment = require('../Mongo/Comments');

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@utrgvrmp.zsqqp.mongodb.net/${process.env.DB_TESTDB}?retryWrites=true&w=majority`;

const professorsAPI = require('../Routes/API/professors');
const testAPI = require('../Routes/API/test_prof');

app.use(bodyParser.json());
app.use('/professors', professorsAPI);
app.use('/test', testAPI);

app.get('/', (req, res) => {
    res.status(202);
    res.json("Connected to server");
});


(async () => {
    await mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log(`MongoDB Connected...`);
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
        app.emit("ready");
    });
})();



module.exports = app;