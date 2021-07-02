// dependencies
const dotenv = require('dotenv').config()
const app = require('./app');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');

//mongo authenticaition
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@utrgvrmp.zsqqp.mongodb.net/${process.env.DB_TESTDB}?retryWrites=true&w=majority`;

(async () => {
    // mongo connection
    await mongoose.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true}, () => {
        db = mongoose.connection;
        console.log(`Connected to MongoDB`)
        
        // server
        app.listen(port, () => {
            console.log(`listening on ${port}`);
        });
    });
})();
