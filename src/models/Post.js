const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    image: {
        publicId: String,
        url: String
    },
    caption: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'  // Assuming 'comment' is another model
        }
    ]
}, {
    timestamps: true
})

module.exports = mongoose.model('post', postSchema);