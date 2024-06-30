const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
    user: { // foreign key
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserData',
        required: true // Ensure that every note is associated with a user
    },
    description: {
        type: String,
        required: true,
        minlength: 5 // minimum length must be 5
    },
    hashtags: {
        type: [String], // Define as an array of strings
        default: ["General"] // Default value is ["General"] if not provided
    },
    img:{
        type:String,
    },
    createdOn: {
        type: Date,
        default: Date.now // Default to the current date if not provided
    }
});

const Discussion = mongoose.model("Discussion", DiscussionSchema);
module.exports = Discussion;
