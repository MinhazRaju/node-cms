import express from 'express'
import CommentController from '../controller/comment.controller'

const router = express.Router()

//Layout setup 

router.all('/*', CommentController.Layout)

//Create Commnet

router.post('/create', CommentController.CreateComment)

// Fetch all Comment

router.get('/', CommentController.FetchComment)

// Delete Single Comment And update post Comments field

router.get('/delete/:id', CommentController.DeleteCommentAdmin)

//Comment Approve usiing ajax

router.post('/approve', CommentController.ApproveComment)

//Delete Only Active user comment using ajax

router.get('/personal/:id', CommentController.DeleteCommentFont)



module.exports = router