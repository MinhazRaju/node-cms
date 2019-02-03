import express from 'express'
import FontController from '../controller/font.controller'
import PostSchema from '../models/PostSchema'
import CategorySchema from '../models/CategorySchema'


const router = express.Router()




//Layout setup 

router.all('/*', FontController.Layout)

//Custom Helper function
const navRouter = (path, route) => router.get(path, (req, res) => res.render(route))


// Navigation Route

navRouter('/register', 'font/register')

//Login Route 

router.get('/login', FontController.Login)

//Register Route

router.get('/register', FontController.Register)


//FontPage Router

router.get('/', FontController.FontPage)


//Register Create funciton

router.post('/register/create', FontController.RegistrationCreate)


FontController.PassportConfig()

//Passport login  function

router.post('/login', FontController.PassportLogin);

//Passport logout function
router.get('/logout', FontController.PassportLogout)

//Single post route
router.get('/singlePosts/:slugs', FontController.SinglePost)

//Search Query in font

router.get('/search', FontController.Search)

//Likes Filed setup route

router.post('/like/:v/:id', FontController.LikeQerySetting)







router.get('/category/:id', (req, res) => {


    PostSchema.find({
        category: req.params.id
    }).then(readData => {

        CategorySchema.find({}).then(readCatData => {

            res.render('font/categoryBase', {
                fetchingPosts: readData,
                fetchingCategory:readCatData
            })




        })


    })



})


module.exports = router