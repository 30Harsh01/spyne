const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Discussion = require('../src/models/DiscussionSchema');
const { body, validationResult } = require('express-validator');

// Fetch all discussions
router.get('/fetchalldiscussions', fetchUser, async (req, res) => {
    try {
        const discussions = await Discussion.find({ user: req.user._id });
        res.json(discussions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Adding discussions
router.post('/creatediscussion', [
    fetchUser,
    body('description', 'Description must be at least 3 characters long').isLength({ min: 3 }),
    body('hashtags', 'Hashtag must be at least 3 characters long').optional()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { description, hashtags,img } = req.body;
        const discussion = new Discussion({ description, hashtags, user: req.user._id,img });
        const savedDiscussion = await discussion.save();
        res.json(savedDiscussion);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update discussion
router.put('/updatediscussion/:id', [
    fetchUser,
    body('description', 'Description must be at least 3 characters long').optional().isLength({ min: 3 }),
    body('hashtags', 'Hashtag must be at least 3 characters long').optional().isLength({ min: 3 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { description, hashtags,img } = req.body;
    const newDiscussion = {};
    if (description) newDiscussion.description = description;
    if (hashtags) newDiscussion.hashtags = hashtags;
    if(img) newDiscussion.img = img;

    try {
        let discussion = await Discussion.findById(req.params.id);
        if (!discussion) {
            return res.status(404).json({ error: "Discussion not found" });
        }

        if (discussion.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Not allowed" });
        }

        discussion = await Discussion.findByIdAndUpdate(req.params.id, { $set: newDiscussion }, { new: true });
        res.json(discussion);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete discussion
router.delete('/deletediscussion/:id', fetchUser, async (req, res) => {
    try {
        let discussion = await Discussion.findById(req.params.id);
        if (!discussion) {
            return res.status(404).json({ error: "Discussion not found" });
        }

        if (discussion.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "Not allowed" });
        }

        await Discussion.findByIdAndDelete(req.params.id);
        res.json({ success: "Discussion has been deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Get discussions by hashtags
router.post('/fetchdiscussionsbytag', fetchUser, async (req, res) => {
    try {
        const { tag } = req.body;
        if (!tag) {
            return res.status(400).json({ error: "Tag is required" });
        }

        const discussions = await Discussion.find({ hashtags: tag });
        if (discussions.length === 0) {
            return res.status(404).json({ error: "No discussions found with this tag" });
        }
        res.json(discussions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;