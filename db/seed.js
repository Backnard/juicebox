// inside db/seed.js

// grab our client with destructuring from the export in index.js
const { 
    client,
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    createPost,
    updatePost,
    getAllPosts,
    getPostsByUser
} = require('./index');

async function createTables() {
    try {
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255),
            active BOOLEAN DEFAULT true
        );
        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );
        `);
    } catch (error) {
        throw error;
    }
}

async function createInitialUsers() {
    try {
        console.log("starting to create users...");

        const albert = await createUser({username: 'albert', password: 'bertie99', name: 'Al Bert', location: 'Sidney, Australia'});
        const sandra = await createUser({username: 'sandra', password: '2sandy4me', name: 'Just Sandra', location: "Ain't tellin'"});
        const glamgal = await createUser({username: 'glamgal', password: 'soglam', name: 'Joshua', location: 'Upper East Side'});
        const presto = await createUser({username: 'Presto', password: 'prestoisthebesto', name: 'PDog', location: 'Slo Town, Bro'});
        
        console.log('Finished creating users!');
    } catch (error) {
        console.error('Error creating users!');
        throw error;
    }
}

async function createInitialPosts() {
    try {
      const [albert, sandra, glamgal, presto] = await getAllUsers();
  
      await createPost({
        authorId: albert.id,
        title: "First Post",
        content: "This is my first post. I hope I love writing blogs as much as I love writing them."
      });
  
      // a couple more
      await createPost({
        authorId: sandra.id,
        title: "I'm Sandra",
        content: "My name is Sandra and I'm 10 and I like toys and I like the park and I like the oshin"
      });

      await createPost({
        authorId: glamgal.id,
        title: "Hey Al, lookin' good",
        content: "I made $5000 last month by working for Google part time from home... [link deleted by admin]"
      });

      await createPost({
        authorId: albert.id,
        title: "Second Post",
        content: "This is my second post. Turns out I hate writing blogs even though I love writing them"
      });

      await createPost({
        authorId: presto.id,
        title: "PRESTO",
        content: "Presto is the Besto!!!"
      });
    } catch (error) {
      throw error;
    }
  }

async function dropTables () {
    try {
        await client.query(`
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
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
        await createInitialPosts();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function testDB() {
    try {
      console.log("Starting to test database...");
  
      console.log("Calling getAllUsers");
      const users = await getAllUsers();
      console.log("Result:", users);
  
      console.log("Calling updateUser on users[0]");
      const updateUserResult = await updateUser(users[0].id, {
        name: "Newname Sogood",
        location: "Lesterville, KY"
      });
      console.log("Result:", updateUserResult);
  
      console.log("Calling getAllPosts");
      const posts = await getAllPosts();
      console.log("Result:", posts);
  
      console.log("Calling updatePost on posts[0]");
      const updatePostResult = await updatePost(posts[0].id, {
        title: "New Title",
        content: "Updated Content"
      });
      console.log("Result:", updatePostResult);
  
      console.log("Calling getUserById with 1");
      const albert = await getUserById(1);
      console.log("Result:", albert);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.log("Error during testDB");
      throw error;
    }
  }

rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());