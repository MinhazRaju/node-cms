import PostSchema from '../models/PostSchema'
import CommentSchema from '../models/CommentSchema'

//Comment layout
exports.Layout = (req, res, next) => {
    req.app.locals.layout = 'admin'
    next()
}

//Fetch all Comment

exports.FetchComment = (req, res) => {
    CommentSchema.find({}).populate('user').then(readData => {
        res.render('admin/comment', {
            fetchingComment: readData
        })
    })
}

//Delete comment and update post comments field


exports.DeleteCommentAdmin = (req, res, next) => {


    CommentSchema.findOneAndDelete({
        _id: req.params.id
    }).then(() => {

        PostSchema.findOneAndUpdate({
            comments: req.params.id
        }, {
            $pull: {
                comments: req.params.id
            }
        }).then(() => {

            res.redirect('/admin/comment')

        })

    })



}

//Approve Comment

exports.ApproveComment = (req, res) => {

    CommentSchema.findByIdAndUpdate(req.body.id, {
        $set: {
            approveComment: req.body.approve
        }
    }).then(result => {
        res.send(result)
    })
}


//Create Comment  and push comment id in the post commets field array 


exports.CreateComment = (req, res) => {

    PostSchema.findOne({
        _id: req.body.id
    }).then(Post => {

        const Comment = new CommentSchema;

        Comment.comment = req.body.cbody,
            Comment.user = req.user.id,
            Comment.slugs = req.body.slugs

        Post.comments.push(Comment)
        Post.save().then(savePost => {
            Comment.save().then(saveComment => {
                res.redirect('/singlePosts/' + savePost.slugs)
            })
        })
    })

}

//Delete Current User Comment using ajax

exports.DeleteCommentFont = (req, res) => {

    if (req.user.id === req.params.id) {
        CommentSchema.findOneAndDelete({
            user: req.params.id
        }).then(success => {
            res.send(success)

        })
    }
}