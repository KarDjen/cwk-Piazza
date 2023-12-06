const mongoose = require('mongoose');

// Create the Schema. 'Post Identifier' is already created by MongoDB
const postSchema = new mongoose.Schema({
    title: {
        type: String, // The title of a post.
        required: true
    },
    topics: {
        type: [String], // The topic of a post from one of the following four categories: Politics, Health, Sport or Tech. Each post could belong to one or more topics.
        enum: ['Politics', 'Health', 'Sport', 'Tech']
    },
    timestamp: {
        type: Date, // A timestamp of the post-registration in the Piazza API.
        default: Date.now
    },
    body: {
        type: String, // The message body of a post.
        required: true
    },
    expirationTime: {
        type: Date, // The post-expiration time. After the end of this time, the message will remain on the Piazza wall, but it will not accept any further actions, e.g. (likes, dislikes, or comments).
        required: true
    },
    status: {
        type: String,
        enum: ['Live', 'Expired'], // The status of a post could be “Live” or “Expired”.
        default: 'Live'
    },
    postOwner: {
        type: mongoose.Schema.Types.ObjectId, // Information about the post owner (e.g., a name).
        required: true
    },
    likes: {
        type: Number, // The number of likes
        default: 0
    },
    dislikes: {
        type: Number, // The number of dislikes
        default: 0
    },
    comments: [{
        username: String, // a list of comments with some other information needed to keep track
        text: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('Post', postSchema);
