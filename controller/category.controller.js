import CategorySchema from '../models/CategorySchema'
import _ from 'lodash'


//Layout setup funcion

exports.Layout = (req, res, next) => {
    req.app.locals.layout = 'admin'
    next()
}



//Create category function

exports.Create = (req, res, next) => {

    const body = _.pick(req.body, ['cattitle'])
    const Category = new CategorySchema;

    Category.cattitle = body.cattitle
    Category.save().then(() => {
        res.redirect('/admin/category')
    })

}

//Fetch Category Data

exports.FetchCategory = (req, res) => {
    CategorySchema.find({}).then(readData => {
        res.render('admin/category', {
            fetchingCategory: readData
        })
    })
}


//Edit category function


exports.EditRoute = (req, res) => {


    CategorySchema.findOne({
        _id: req.params.id
    }).then(readData => {
        res.render('admin/category', {
            fetchingEdit: readData
        })
    })
}

//Update category 


exports.UpdateCategory = (req, res) => {
    CategorySchema.findOneAndUpdate({
        _id: req.params.id
    }, {
        $set: {
            cattitle: req.body.cattitle
        }
    }).then(() => {
        res.redirect('/admin/category')
    })
}

//Delete category 

exports.DeleteCategory = (req, res) => {
    CategorySchema.findOneAndDelete({
        _id: req.params.id
    }).then(() => {
        res.redirect('/admin/category')
    })
}