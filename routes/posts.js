// IMPORT DEPENDENCIES AND INITIALIZING ROUTER
const express = require('express');
const router = express.Router();

const Post = require('../models/Post'); // Ensure this path is correct
const verifyToken = require('../verifyToken'); // Ensure this middleware is correctly implemented

// Implement ACTION 2: Authorised users post a message for a particular topic in the Piazza API.
// ENDPOINT TO CREATE A NEW POST
router.post('/', verifyToken, async (req, res) => {
    try {
        const expirationDuration = req.body.expirationTime; // This is a number in minutes
        const expirationTime = new Date(Date.now() + expirationDuration * 60000); // Convert to Date

        // Validation for expiration time being between 5 and 60 minutes
        if (isNaN(expirationDuration) || expirationDuration <5 || expirationDuration>60) {
        return res.status(400).send({message: 'Expiration time must be between 5 and 60 minutes'});
        }

        // Create a new post instance with data from the request body
        const newPost = new Post({
            title: req.body.title,
            topics: req.body.topics,
            body: req.body.body,
            expirationTime: expirationTime,
            postOwner: req.body.postOwner,
            status: 'Live'
        });

        // Save the new post to the database
        const savedPost = await newPost.save();
        res.status(201).send(savedPost); // Send the saved post with status code 201 (Created)

    } catch (err) {
        res.status(500).send({ message: err.message, errors: err.errors });
    }
});

// Implement ACTION 3: Registered users browse messages per topic using the Piazza API.
// Implement Action 5: Authorised users could browse for the most active post per topic with the highest likes and dislikes.
// Implement Action 6: Authorised users could browse the history data of expired posts per topic.
// ENDPOINT TO GET POSTS
router.get('/', verifyToken, async (req, res) => {
    try {
        const { topics, author, status, sortByInterest } = req.query;

        // Build a query object
        let query = {};
        if (topics) query.topics = topics;
        if (author) query.postOwner = author;
        if (status) query.status = status;

        let postsQuery = Post.find(query);

        // Sort by interest if requested
        if (sortByInterest === 'true') {
            postsQuery = postsQuery.sort({ likes: -1, dislikes: -1 });
        }

        const posts = await postsQuery.exec();

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
