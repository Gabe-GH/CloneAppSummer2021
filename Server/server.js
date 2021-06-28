// dependencies
const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

//mongo authenticaition
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@utrgvrmp.zsqqp.mongodb.net/${process.env.DB_DEVDB}?retryWrites=true&w=majority`;

// mongo connection
mongoose.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log(`Connected to ${URI_dev}`)
});

// server
app.listen(port, () => {
    console.log(`listening on ${port}`);
});