// dependencies
const dotenv = require('dotenv').config()
const app = require('./app');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');


(async () => {
    // mongodb authenticaition
    const URI = (process.env.NODE_ENV == "test_env") ? process.env.DB_TEST : process.env.DB_DEV
    
    // mongo connection
    await mongoose.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true}, () => {
        db = mongoose.connection;
        console.log(`Connected to MongoDB`)
        
        // server reply
        app.listen(port, () => {
            console.log(`listening on ${port}`);
        });
    });
})();
