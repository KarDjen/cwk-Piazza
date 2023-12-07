// IMPORT DEPENDENCIES AND INITIALIZING ROUTER
const express = require('express');
const router = express.Router();

const Interaction = require('../models/Interaction'); // Adjust the path as necessary
const Post = require('../models/Post'); // Adjust the path as necessary
const User = require('../models/User');
const verifyToken = require('../verifyToken'); // Ensure this middleware is correctly implemented

const fs = require('fs');
const path = require('path');


// PROHIBITED KEYWORDS FUNCTION
// Use "unofficial" facebook list of bad words: https://www.freewebheaders.com/bad-words-list-and-page-moderation-words-list-for-facebook/
const prohibitedKeywords = function() {
    const filePath = path.join(__dirname, 'prohibitedKeywords.txt');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent.split('\n').map(line => line.trim()).filter(line => line !== ''); // Split the content by new line to get an array of keywords
}


// IMPLEMENT ACTION 4: Registered users perform basic operations, including “like”, “dislike”, or “comment” a message posted for a topic.
// ENDPOINT TO LIKE OR DISLIKE
router.post('/react',verifyToken, async (req, res) => {

    const type = req.body.interactionType
    const postId = req.body.post
    const usernameFromToken = req.user.username// type can be 'like' or 'dislike'

    try {

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({message: 'Nope, that post is not around.'});
        }


        // Check if the user is the author of the post: a post owner cannot like or dislike their messages.
        const user = await User.findOne({username: usernameFromToken});
        if (post.postOwner.equals(user._id)) {
            return res.status(403).send({message: 'Seriously...who likes its own post?! We cannot let that happen..trust Takeshi-san!'});
        }


        // Check if the post is not expired: After the end of the expiration time,
        // the message will not accept any further user interactions (likes, dislikes, or comments).
        if (post.status === 'Expired') {
            return res.status(403).send({message:'Post has expired. Too late.' });
        }


        // Check if the user has already liked or disliked this post. User cannot like or dislike several times.
        const existingInteraction = await Interaction.findOne({
            username: usernameFromToken,
            post: postId,
            interactionType: {$in: ['like','dislike'] }
        });

        if (existingInteraction) {
            return res.status(403).send({message: 'You have already interacted my luv!'});
        }


        // Create and save a new interaction
        const newInteraction = new Interaction({
            username: usernameFromToken,
            interactionType: type,
            post: postId,
        });

        await newInteraction.save();

        // Update the post's likes and dislikes count based on the interaction type
        if (type === 'like') {
            post.likes++;
        } else if (type === 'dislike') {
            post.dislikes++;
        }

        // Save the updated post
        await post.save();

        res.status(201).send({message: "Well done, you've just reacted...now go back to work!"});

        }catch (err){
            res.status(500).send({message: err.message});
        }
});


// IMPLEMENT ACTION 4: Registered users perform basic operations, including “like”, “dislike”, or “comment” a message posted for a topic.
// ENDPOINT TO COMMENT
router.post('/comment', verifyToken, async (req, res) => {

    const postId = req.body.post;
    const comment = req.body.interactionValue;
    const userNameFromToken = req.user.username // Ensure this line is inside the route

    try {

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({message: 'Post not found. By the way, remember to buy milk for your momma?!'});
        }


        // Check if user has provided a comment
        if (!comment || comment.trim() === '') {
            return res.status(400).send({message: 'A comment is required. Please. Por favor?!'});
        }


        // Check if the post is not expired
        if (post.status === 'Expired') {
            return res.status(403).send({message: 'Post has expired. Too late.'});
        }

        const loadProhibitedKeywords = prohibitedKeywords();


        // Check for prohibited keywords in the comment
        const isCommentInappropriate = loadProhibitedKeywords.some(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            return regex.test(comment);
        });

        if (isCommentInappropriate) {
            return res.status(400).send({message : "Your comment is not cool. You are breaching our internal policies. Let's go back to something respectful and meaningful, what about that?!"});
        }


        // Create and save a new comment
        const newComment = new Interaction({
            username: userNameFromToken,
            interactionType: 'comment',
            interactionValue: comment,
            post: postId,
        });

        await newComment.save();

        res.status(201).send({message: "Pasted. Pohsted. Wait..posted. Here you go!"})


        // Add the new comment to the post's comments array
        post.comments.push({
            username: userNameFromToken,
            text: comment,
            timestamp: new Date()
        });

        await post.save();


    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

module.exports.router = router;
module.exports.prohibitedKeywords = prohibitedKeywords;

