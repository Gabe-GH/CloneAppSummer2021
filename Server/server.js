const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const Comment = require('../Mongo/Comments');

const URI_dev = require('../Mongo/config').dev;
const URI_test = require('../Mongo/config').test

const professorsAPI = require('../Routes/API/professors');
const testAPI = require('../Routes/API/test_prof');

app.use(bodyParser.json());
app.use('/professors', professorsAPI);
app.use('/test', testAPI);

// !!SWITCH TO DEV DB AFTER DONE TESTING
// --current uri connected to test db
(async () => {
    await mongoose.connect(URI_test, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log(`MongoDB Connected...`);
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
        app.emit("ready");
    });
})();

module.exports = app;