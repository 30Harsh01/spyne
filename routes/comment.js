const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Discussion = require('../src/models/DiscussionSchema');
const Comment = require('../src/models/CommentsSchema');
const { body, validationResult } = require('express-validator');

// Add a comment
router.post('/comment/:id', [
    body('comment', 'Length of comment must be at least 5 characters').isLength({ min: 1 }),
], fetchUser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { comment } = req.body;
        const { id: commentedOn } = req.params;
        const commentedBy = req.user._id;
        const createComment = await Comment.create({ 
            commentedOn,
            comment,
            commentedBy
        });
        res.status(200).json({ comment: createComment });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





// Edit a comment
router.put('/editcomment/:id', [
    body('comment', 'Length of comment must be at least 5 characters').optional().isLength({ min: 1 }), 
], fetchUser, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { comment } = req.body;
    const newComment = {};
    if (comment) newComment.comment = comment;

    try {
        let existingComment = await Comment.findById(req.params.id); 
        if (!existingComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (existingComment.commentedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Not allowed" });
        }

        existingComment = await Comment.findByIdAndUpdate(req.params.id, { $set: newComment }, { new: true }); // Updated method
        res.json(existingComment);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

// Delete a comment
router.delete('/comment/:id', fetchUser, async (req, res) => { 
    try {
        const { id: commentId } = req.params;

        const checkComment = await Comment.findById(commentId); 
        if (!checkComment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (checkComment.commentedBy.toString() !== req.user._id.toString()) { 
            return res.status(401).json({ error: "Not authorized" });
        }

        await Comment.findByIdAndDelete(commentId); 
        res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
