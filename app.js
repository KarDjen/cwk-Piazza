// IMPORT MODULES
const express = require('express'); // Importing Express framework to create server and handle routes
const app = express(); // Initialize a new Express application instance

const mongoose = require('mongoose'); // Importing Mongoose for MongoDB interactions

const accessSecret = require('./secretManager'); // Import Google Secret Manager module


// IMPORT ROUTE HANDLERS
const authRoute = require('./routes/auth'); // Routes for user-related functionalities
const postRoute = require('./routes/posts'); // Routes for post-related functionalities
const interactionRoute  = require('./routes/interactions'); // Routes for interactions (like, dislikes, or comment)


// IMPORT TASK to update the status of posts.
const updatePostStatus = require('./tasks/updatePostStatus');


// MIDDLEWARE to parse incoming JSON payloads in request bodies
app.use(express.json());


// CONNECTION TO MONGODB USING MONGOOSE AND GOOGLE SECRET MANAGER
async function startServer() {
    try{
        // Fetch DB connection string from Secret Manager
        const dbprojectId = 'aqueous-radio-401119';
        const dbsecretId = 'cwt_Piazza';
        const dbConnector = await accessSecret(dbsecretId, dbprojectId);

        await mongoose.connect(dbConnector,{ useNewUrlParser: true, useUnifiedTopology: true });
        console.log('DB is now connected!');

        const tokenProjectId = 'aqueous-radio-401119';
        const tokenSecretId = 'cwt_Piazza_ST'; // Updated for Token Secret
        const tokenSecret = await accessSecret(tokenSecretId, tokenProjectId);
        process.env.TOKEN_SECRET = tokenSecret;

        updatePostStatus();

    } catch(err) {
        console.error('Error connecting to DB:', err);
    }

}

startServer();


// API ROUTE CONFIGURATIONS
app.use('/api/users', authRoute); // routes for user authentication and management
app.use('/api/posts', postRoute); // routes for post operations
app.use('/api/interactions', interactionRoute.router); // routes for post interactions


// A simple root route for basic API testing.
app.get('/', (req, res) => {
    res.send('Welcome to Piazza API !!');
});


// STARTING THE SERVER ON :3000
app.listen(3000, () =>{
    console.log('Server is up and running...')
})

module.exports = app;
