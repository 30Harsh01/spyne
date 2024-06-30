const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({
    commentedBy: { // foreign key
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserData',
        required: true // Ensure that every note is associated with a user
    },
    comment: {
        type: String,
        required: true,
        minlength: 1 // minimum length must be 5
    },
    commentedOn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserData',
        required: true // Ensure that every note is associated with a user
    },
    createdOn: {
        type: Date,
        default: Date.now // Default to the current date if not provided
    }
});

const Comment = mongoose.model("Comment", CommentsSchema);
module.exports = Comment;
