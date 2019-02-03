import _ from 'lodash'
import PostSchema from '../models/PostSchema'
import faker from 'faker';
import fs from 'fs'
import {
    uploadDir
} from '../helpers/custom.helper'
import CategorySchema from '../models/CategorySchema'
import CommentSchema from '../models/CommentSchema'



//Layout Functuon


exports.Layout = (req, res, next) => {
    req.app.locals.layout = 'admin'
    next()
}



//Chart view Function 

exports.AdminIndex = (req, res) => {
    const promise = [
        PostSchema.countDocuments().exec(),
        CategorySchema.countDocuments().exec(),
        CommentSchema.countDocuments().exec()
    ]

    Promise.all(promise).then(([PostCount, CommentCount, CategoryCount]) => {

        res.render('admin', {
            PostCount,
            CategoryCount,
            CommentCount
        })
    })

}


//Show category in post create from

exports.Category = (req, res, next) => {
    CategorySchema.find({}).then(readData => {
        res.render('admin/posts/create', {
            fetchingCategory: readData
        })
    })
}


//Create Post function


exports.Create = (req, res, next) => {

    const body = _.pick(req.body, ['title', 'category', 'status', 'allowComments', 'body'])
    const Post = new PostSchema;

    const file = req.files.filedata;
    file.mv('./public/images/' + file.name)

    let allowComments;
    switch (body.allowComments) {
        case 'on':
            allowComments = true
            break;
        default:
            allowComments = false
            break;
    }





    Post.user = req.user.id,
        Post.category = body.category,
        Post.title = body.title,
        Post.status = body.status,
        Post.allowComments = allowComments,
        Post.allowPost = false,
        Post.file = file.name,
        Post.body = body.body


    Post.save().then(() => {
        req.flash('success_msg', 'Posts Saved')

        if (req.user.power === true) {
            res.redirect('/admin/posts')
        } else {
            res.redirect('/admin/myposts')
        }


    })


}




//Dummy post create funcuton


exports.Dummy = (req, res, next) => {
    const range = req.body.amount
    for (let index = 1; index <= range; index++) {

        const Post = new PostSchema
        Post.title = faker.name.title()
        Post.status = 'public'
        Post.allowComments = faker.random.boolean()
        Post.file = faker.image.image()
        Post.body = faker.lorem.sentence()

        Post.save().then(() => {
            res.redirect('/admin/posts')
            res.setHeader('x', 'done')
        }).catch(err=>{
           
        })
    }
}



//Render all post include category and user also


exports.FetchPosts_Category_User = (req, res, next) => {

    const Power = req.user.power
    const Id = req.user._id


    PostSchema.find({}).populate('category').populate('user').then(readData => res.render('admin/posts', {
        fetchingPosts: readData,
        userPower: Power,
        userId: Id



    }))
}



exports.CurrentUserPosts = (req, res, next) => {


    PostSchema.find({
        user: req.user._id
    }).populate('category').populate('user').then(readData => {

        // console.log(readData)
        res.render('admin/posts/activeuserpost', {
            CurrentPost: readData
        })


    })



}


//Edit post Routing and pass all current post data in form 


exports.EditPosts = (req, res, next) => {

    PostSchema.findOne({
        _id: req.params.id
    }).then(readData => {
        CategorySchema.find({}).then(redData => {
            res.render('admin/posts/edit', {
                fetchingPosts: readData,
                fetchingCategory: redData
            });
        })
    })
}


//Update current post


exports.UpdatePosts = (req, res, next) => {

    const body = _.pick(req.body, ['title', 'category', 'status', 'allowComments', 'body'])
    const file = req.files.filedata;
    file.mv('./public/images/' + file.name)

    let allowComments;
    switch (body.allowComments) {
        case 'on':
            allowComments = true
            break;
        default:
            allowComments = false
            break;
    }

    PostSchema.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {

            title: body.title,
            category: body.category,
            status: body.status,
            allowComments: allowComments,
            file: file.name,
            body: body.body

        }
    }).then(() => {
        res.redirect('/admin/posts')
    })
}


//Delete Many function

exports.DeleteMany = (req, res, next) => {
    PostSchema.deleteMany({
        _id: req.body.checkbox
    }).then(success => {
        res.redirect('/admin/posts')
    })
}



//Delete individual


exports.IndividualDelete = (req, res, next) => {

    PostSchema.findOne({
        _id: req.params.id
    }).populate('comments').then(posts => {
        fs.unlink(uploadDir + posts.file, (err) => {
            console.log(err)
        })

        if (!posts.comments.length < 1) {
            posts.comments.forEach(comment => {
                comment.remove()
            })
        }

        PostSchema.findOneAndDelete({
            _id: req.params.id
        }).then(() => res.redirect('/admin/posts'))
    })
}


//Approve post using ajax

exports.ApprovePosts = (req, res, next) => {
    PostSchema.findByIdAndUpdate(req.body.id, {
        $set: {
            allowPost: req.body.approve
        }
    }).then(result => {
        res.send(result)
    })
}