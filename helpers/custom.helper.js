import moment from 'moment'
import gravatar from 'gravatar'
import PostSchema from '../models/PostSchema'
import axios from 'axios'


import {
    isString
} from 'util';
const path = require('path');






module.exports = {
    uploadDir: path.join(__dirname, '../public/images/'),

    tirmText: function (value) {
        return value.substr(0, 200)

    },
    tirmId: function (val) {
        return val.toString().slice(-4)
    },
    getDate: function (createdAt, format) {
        return moment(createdAt).format(format)
    },
    select: function (selected, options) {
        return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$&selected="selected"');
    },

    

    i: function (options) {



        let output = '';

        if (options.hash.alluser === options.data.root.id) {
            output += `<button class="ajaxd btn btn-danger" value=${options.hash.alluser} commentId=${options.hash.commentId} ><i class="trash alternate outline icon"></i></button>`;
        } else {
            return '';
        }


        return output;

    },

    gravatar: function (email) {

        return gravatar.url(email, {
            s: 50
        })

    },


    button:function(options){
        console.log(options)

    },




































    userAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'You need To login')
        res.redirect('/login');
    },




    //Pagination

    paginate: function (options) {
        let output = '';
        if (options.hash.current === 1) {
            output += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
        } else {
            output += `<li class="page-item"><a href="?page=1" class="page-link">First</a></li>`;
        }

        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);

        if (i !== 1) {
            output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
        }

        for (; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++) {
            if (i === options.hash.current) {
                output += `<li class="page-item active"><a class="page-link">${i}</a></li>`;

            } else {
                output += `<li class="page-item "><a href="?page=${i}" class="page-link">${i}</a></li>`;
            }


            if (i === Number(options.hash.current) + 4 && i < options.hash.pages) {
                output += `<li class="page-item disabled"><a class="page-link">...</a></li>`;
            }
        }

        if (options.hash.current === options.hash.pages) {

            output += `<li class="page-item disabled"><a class="page-link">Last</a></li>`;
        } else {


            output += `<li class="page-item "><a href="?page=${options.hash.pages}" class="page-link">Last</a></li>`;


        }


        return output;



    }








}