var ta = require('time-ago');


const mapPostOutput = (post, userId) => {
    return {
        _id: post._id,
        caption: post.caption,
        image: post.image,
        owner: {
            _id: post.owner._id,
            name: post.owner.name,
            avatar: post.owner.avatar
        },
        likesCount: post.likes.length,
        // commentsCount: post.comments.length,
        // comments: post.comments.map(comment => ({
        //     _id: comment._id,
        //     text: comment.text,
        //     author: {
        //         _id: comment.author._id,
        //         name: comment.author.name,
        //         avatar: comment.author.avatar
        //     },
        //     timeAgo: ta.ago(comment.createdAt)
        // })),
        isLiked: post.likes.includes(userId),
        timeAgo: ta.ago(post.createdAt)
    }
}


module.exports = {
    mapPostOutput
}