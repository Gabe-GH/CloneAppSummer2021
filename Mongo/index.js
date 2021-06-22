const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const Comments = require('./Comments');

const { URI } = require("./config.js");

console.log(URI);

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true} );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    // we're connected!

    Comments.find((err, comments) => {
        if (err) return console.error(err);
        console.log(comments);
    });

});

/*

async function main() {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();

        await listDatabases(client);
    } catch(e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases: ");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}

*/