import express from 'express'
import PostController from '../controller/admin.controller'
import { userAuthenticated} from '../helpers/custom.helper'

const router = express.Router()

//Layout Route
router.all('/*', PostController.Layout)

//Index page

router.get('/', userAuthenticated, PostController.AdminIndex)

//Show category table data in post create from

router.get('/posts/create', userAuthenticated, PostController.Category)

//Create Post Route

router.post('/posts/create', userAuthenticated, PostController.Create)

//Dummy Post Create Route  

router.post('/posts/dummy', userAuthenticated, PostController.Dummy)

//Read Post Route With Realation Category table Throw By populate function

router.get('/posts', userAuthenticated, PostController.FetchPosts_Category_User)

// Current user Posts

router.get('/myposts', userAuthenticated, PostController.CurrentUserPosts)

//Edit Route

router.get('/posts/edit/:id', userAuthenticated, PostController.EditPosts)

//Update Post

router.post('/posts/update/:id', userAuthenticated, PostController.UpdatePosts)

//Delete Multiple Route

router.post('/posts/deleteMany', userAuthenticated, PostController.DeleteMany)

//Single DeletRoute

router.get('/posts/delete/:id', userAuthenticated, PostController.IndividualDelete)

//ApprovePosts (Using Ajax)

router.post('/posts/approve', userAuthenticated, PostController.ApprovePosts)






module.exports = router