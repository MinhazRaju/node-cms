import mongoose from 'mongoose'

const Schema = mongoose.Schema;


const CategorySchema = Schema({

    cattitle: {
        type: String
    }


})


module.exports = mongoose.model('categories', CategorySchema)