const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser');
const Like = require('../src/models/likeSchema');
const Discussion = require('../src/models/DiscussionSchema');
const Comment = require('../src/models/CommentsSchema');


router.post('/likeoncomment/:id', fetchUser, async (req, res) => {
    try {
        console.log("Entering try block");
        
        const { id: likedOnComment } = req.params;
        const userId = req.user._id;
        
        const checkComment = await Comment.findById(likedOnComment);
        if (!checkComment) {
            return res.status(400).json({ error: "No such comment exists" });
        }
        // console.log("Comment found");

        let like = await Like.findOne({ likedOnComment });
        // console.log("Like status checked");

        if (like) {
            if (like.likedBy.includes(userId)) {
                console.log("Already liked");
                return res.status(200).json({ message: "Already liked" });
            }
            like.likedBy.push(userId);
            like.likeCount += 1;
            console.log("Like updated");
        } else {
            like = new Like({
                likedOnComment,
                likedBy: [userId],
                likeCount: 1
            });
            await like.save();
            console.log("New like created");
        }

        res.status(200).json({ message: "Liked" });
        console.log("Response sent");

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




// Unlike a comment
router.post('/unlikeoncomment/:id', fetchUser, async (req, res) => {
    try {
        const { id: likedOnComment } = req.params;
        const userId = req.user._id;
        const checkComment = await Comment.findById(likedOnComment);
        if (!checkComment) {
            return res.status(400).json({ error: "No such comment exists" });
        }
        
        let like = await Like.findOne({ likedOnComment });

        if (like && like.likedBy.includes(userId)) {
            like.likedBy = like.likedBy.filter(id => id.toString() !== userId.toString());
            like.likeCount -= 1;
            await like.save();
            return res.status(200).json({ message: "Unliked" });
        } else {
            return res.status(400).json({ message: "Not liked yet" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Like a discussion
router.post('/likeondiscussion/:id', fetchUser, async (req, res) => {
    try {
        const { id: likedOnDiscussion } = req.params;
        const userId = req.user._id;
        const checkDiscussion = await Discussion.findById(likedOnDiscussion);
        if (!checkDiscussion) {
            return res.status(400).json({ error: "No such discussion exists" });
        }
        
        let like = await Like.findOne({ likedOnDiscussion });

        if (like) {
            if (like.likedBy.includes(userId)) {
                return res.status(200).json({ message: "Already liked" });
            }
            like.likedBy.push(userId);
            like.likeCount += 1;
        } else {
            like = new Like({
                likedOnDiscussion,
                likedBy: [userId],
                likeCount: 1
            });
        }

        await like.save();
        res.status(200).json({ message: "Liked" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Unlike a discussion
router.post('/unlikeondiscussion/:id', fetchUser, async (req, res) => {
    try {
        const { id: likedOnDiscussion } = req.params;
        const userId = req.user._id;
        const checkDiscussion = await Discussion.findById(likedOnDiscussion);
        if (!checkDiscussion) {
            return res.status(400).json({ error: "No such discussion exists" });
        }
        
        let like = await Like.findOne({ likedOnDiscussion });

        if (like && like.likedBy.includes(userId)) {
            like.likedBy = like.likedBy.filter(id => id.toString() !== userId.toString());
            like.likeCount -= 1;
            await like.save();
            return res.status(200).json({ message: "Unliked" });
        } else {
            return res.status(400).json({ message: "Not liked yet" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
