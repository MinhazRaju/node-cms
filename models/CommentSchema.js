import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const CommentSchema = new Schema({

    comment: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    slugs: {
        type: String

    },
    approveComment: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    likeCount: {
        type: Number,
        default: 0
    },
    dislikeCount: {
        type: Number,
        default: 0
    }






})


module.exports = mongoose.model('comments', CommentSchema)