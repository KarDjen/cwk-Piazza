// DB MODEL FOR INTERACTIONS
const mongoose = require('mongoose');

const UserinteractionSchema = new mongoose.Schema({
    username: {
        type: String, // Information about the user interacting with the post of a topic (e.g., a name).
    },
    interactionType: {
        type: String,
        enum: ['like', 'dislike', 'comment'], // The interaction value (including a like, a dislike, or a comment made).
        required: true
    },
    interactionValue: {
        type: String // For comments
    },
    interactionTime: {
        type: Date, // The time left for a post to expire.
        default: Date.now
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Post model
        required: true
    },
});

module.exports = mongoose.model('User Interaction', UserinteractionSchema);