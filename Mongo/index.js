const {MongoClient} = require('mongodb');
const { uri } = require("./config.js");

//const uri = 'mongodb+srv://classed:r945XJMmtne9BzL7@utrgvrmp.zsqqp.mongodb.net/sample_mflix?retryWrites=true&w=majority'

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