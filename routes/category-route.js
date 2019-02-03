import express from 'express'
import CategoryController from '../controller/category.controller'

const router = express.Router();

//Layout Route

router.all('/*', CategoryController.Layout)

//Create Category Route         

router.post('/create', CategoryController.Create)

//Fetch Category Route

router.get('/', CategoryController.FetchCategory)

// Edit Route

router.get('/edit/:id', CategoryController.EditRoute)

//Udate Route And Edit

router.post('/edit/:id', CategoryController.UpdateCategory)

// Delete Route

router.get('/delete/:id', CategoryController.DeleteCategory)



module.exports = router