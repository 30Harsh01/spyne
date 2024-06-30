const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    likedOnDiscussion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion',
        required: false // Optional: Only required if you want it to be mandatory
    },
    likedOnComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: false // Optional: Only required if you want it to be mandatory
    },
    likedBy: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        required: true // Ensure that every like is associated with a user
    },
    likeCount: {
        type: Number,
        default: 0 // Default to 0 if not provided
    },
    createdOn: {
        type: Date,
        default: Date.now // Default to the current date if not provided
    }
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;
