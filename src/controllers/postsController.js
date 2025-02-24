const Comment = require('../models/comment')
const Post = require("../models/Post");
const User = require("../models/User");
const { success, error } = require("../utils/responseWrapper");
const { mapPostOutput } = require('../utils/Utils')
const { uploadImageToCloudinary } = require('../config/fileUploadConfig')


const createPostController = async (req, res) => {
    try {
        let imageUrl = '';
        if (req.file) {
            try {
                // Upload image to Cloudinary then get the url as the response
                const cloudImg = await uploadImageToCloudinary(req.file.buffer);
                console.log('cloudImg', cloudImg)
                imageUrl = cloudImg;
            } catch (uploadError) {
                return res.status(500).json({
                    success: false,
                    message: 'Error uploading image to Cloudinary',
                    error: uploadError.message || uploadError,
                });
            }
        }
        const { caption } = req.body;
        const postImg = imageUrl;
        if (!caption || !postImg) {
            return res.status(400).json({
                success: false,
                message: 'Caption and postImg are required'
            });
        }
        const owner = req._id;
        const user = await User.findById(owner).populate('posts');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const post = await Post.create({
            owner,
            caption,
            image: {
                url: imageUrl
            },
        });
        user.posts.push(post._id);
        await user.save();

        return res.status(200).json({
            status: 'ok',
            statusCode: 200,
            result: { post },
        });
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message || 'Something went wrong',
        });
    }
};

const likeAndUnlikePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId).populate('owner');
        if (!post) {
            return res.send(error(404, "Post not found"));
        }

        if (post.likes.includes(curUserId)) {
            const index = post.likes.indexOf(curUserId);
            post.likes.splice(index, 1);
        } else {
            post.likes.push(curUserId);
        }
        await post.save();
        return res.send(success(200, { post: mapPostOutput(post, req._id) }));

    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const updatePostController = async (req, res) => {
    try {
        const { postId, caption } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.send(error(404, "Post not found"));
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(error(403, "Only owners can update their posts"));
        }

        if (caption) {
            post.caption = caption;
        }

        await post.save();
        return res.send(success(200, { post }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const curUserId = req._id;

        const post = await Post.findById(postId);
        const curUser = await User.findById(curUserId);
        if (!post) {
            return res.send(error(404, "Post not found"));
        }

        if (post.owner.toString() !== curUserId) {
            return res.send(error(403, "Only owners can delete their posts"));
        }
        const index = curUser.posts.indexOf(postId);
        curUser.posts.splice(index, 1);
        await curUser.save();
        await post.remove();

        return res.send(success(200, "post deleted successfully"));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

// Create a new comment
const createComment = async (req, res) => {
    const { text, postId } = req.body;
    const userId = req._id;
    if (!text) {
        return res.send(error(403, "No text founds"));
    }

    const post = await Post.findById(postId);
    if (!post) {
        return res.send(error(403, "No text founds"));
    }

    const comment = await Comment.create({
        text,
        author: userId,
        post: postId
    });
    await post.comments.push(comment._id);
    await post.save();
    let result = await comment.populate('author', 'name avatar');

    return res.send(success(200, { result }));
};

const getPostComments = async (req, res) => {
    try {
        // c
        console.log('hitting or not');
        const { postId } = req.body;

        const comments = await Comment.find({ post: postId })
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 });

        return res.send(success(200, { comments }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

// Delete a comment
const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.send(success(401, 'No comment found'));
    }

    // Check if user is the comment author
    if (comment.author.toString() !== userId.toString()) {
        return res.send(success(401, 'You are not authorized to delete this comment'));
    }

    // Remove comment from post's comments array
    await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: commentId }
    });

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return res.send(success(200, 'comment delete successfully'));
};

// Update a comment
const updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!text) {
        return res.send(error(403, "No text founds"));
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.send(error(403, "No comment founds"));
    }
    if (comment.author.toString() !== userId.toString()) {
        return res.send(error(403, "you are not authorized"));
    }
    comment.text = text;
    await comment.save();
    let updatedComment = await comment.populate('author', 'name avatar');
    return res.send(success(200, { updatedComment }));
};
module.exports = {
    createPostController,
    likeAndUnlikePost,
    updatePostController,
    deletePost,
    createComment,
    getPostComments,
    updateComment,
    deleteComment
};