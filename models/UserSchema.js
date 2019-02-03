import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const UserSchema = new Schema({

    firstName: {
        type: String
    },

    lastName: {
        type: String
    },

    email: {
        type: String
    },
    password: {
        type: String
    },
    power: {
        type: Boolean,
        default: false
    }


})




module.exports = mongoose.model('users', UserSchema)