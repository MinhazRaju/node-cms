import mongoose, { SchemaTypes } from 'mongoose'
import URLslugs from 'mongoose-url-slugs'

const Schema = mongoose.Schema;

const PostSchema = new Schema({

    title: {
        type: String,

    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    slugs: {
        type: String
    },
    status: {
        type: String
    },
    allowPost: {
        type: Boolean
    },
    allowComments: {
        type: Boolean
    },
    file: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()

    },
    body: {
        type: String
    },
    views:{
        type:Number,
        default:0
    },
    likesCount:{
        type:Number,
        default:0
    },
    comments: [{

        type: Schema.Types.ObjectId,
        ref: 'comments'
    }],
    likers:[{
        type:Schema.Types.ObjectId,
        ref:'users'
    }]




});

PostSchema.plugin(URLslugs('title', {
    field: 'slugs'
}))
module.exports = mongoose.model('Posts', PostSchema);