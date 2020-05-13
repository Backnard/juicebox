// inside db/seed.js

// grab our client with destructuring from the export in index.js
const { 
    client,
    getAllUsers,
    createUser
} = require('./index');

async function testDB() {
  try {
    // connect the client to the database, finally

    // queries are promises, so we can await them
    const users = await getAllUsers();
    // for now, logging is a fine way to see what's up
    console.log(users);
  } catch (error) {
    console.error(error);
  }
}

async function createInitialUsers() {
    try {
        console.log("starting to create users...");

        const albert = await createUser({username: 'albert', password: 'bertie99'});
        const sandra = await createUser({username: 'sandra', password: '2sandy4me'});
        const glamgal = await createUser({username: 'glamgal', password: 'soglam'});
        const presto = await createUser({username: 'Presto', password: 'prestoisbesto'});
        

        console.log(brian);

        console.log('Finished creating users!');
    } catch (error) {
        console.error('Error creating users!');
        throw error;
    }
}

async function dropTables () {
    try {
        await client.query(`
        DROP TABLE IF EXISTS users;
        `)
    } catch (error) {
        throw error;
    }
}

async function createTables() {
    try {
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
        );
        `)
    } catch (error) {
        throw error;
    }
}

async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {
        console.error(error);
    }
}

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());