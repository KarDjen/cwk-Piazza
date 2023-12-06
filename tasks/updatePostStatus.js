// IMPORT THE POST MODEL
const Post = require('../models/Post');


// FUNCTION TO UPDATE THE STATUS OF POSTS
const updatePostStatus = () => {
    // Setting an interval to run the code, and we decided every 60 seconds
    setInterval(async () => {
        try {
            const now = new Date();
            // Set status to 'Expired' if expirationTime is less than the current time and status is 'Lived'
            await Post.updateMany({
                expirationTime: {$lt: now},
                status: 'Live'
            }, {
                status: 'Expired'
            });
        } catch (err) {
            console.error('Error updating post statuses:',err);
        }
    }, 60000); // runs every 60 seconds
};


module.exports = updatePostStatus;
