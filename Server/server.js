const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const Comment = require('../Mongo/Comments');

const URI = require('../Mongo/config').URI;

const professorsAPI = require('../Routes/API/professors');

app.use(bodyParser.json());

app.use('/professors', professorsAPI);

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log(`MongoDB Connected...`);
        return app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
});
