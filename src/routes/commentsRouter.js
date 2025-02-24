const router = require("express").Router();
const postsController = require("../controllers/postsController");
const requireUser = require("../middlewares/requireUser");

// create comment for the specific post 
router.post('/', requireUser, postsController.createComment);

// Get comments for a specific post
router.post('/getComment', requireUser, postsController.getPostComments);

// Delete a specific comment
router.delete('/:commentId', requireUser, postsController.deleteComment,);

// Update a specific comment
router.put('/:commentId', requireUser, postsController.updateComment,);

module.exports = router;