import _ from 'lodash'
import bcrypt from 'bcryptjs'
import passport from 'passport'
import localStrategy from 'passport-local'
import UserSchema from '../models/UserSchema'
import PostSchema from '../models/PostSchema'
import CommentSchema from '../models/CommentSchema'
import CategorySchema from '../models/CategorySchema'
import path from 'path'
import {
    read
} from 'fs';


const Local = localStrategy.Strategy


exports.Layout = (req, res, next) => {
    req.app.locals.layout = 'font'
    next()
}

exports.Login = (req, res) => {
    res.render('font/login')
}


exports.Register = (req, res) => {
    res.render('font/register')
}




exports.FontPage = (req, res, next) => {

    const perPage = 5;
    const page = req.query.page || 1;


    PostSchema.find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .populate('user')
        .then(readData => {
            PostSchema.countDocuments().then(postCount => {
               
               CategorySchema.find({}).then(readCatData=>{             
               
                res.render('font', {
                    fetchingPosts: readData,
                    fetchingCategory:readCatData,
                    current: parseInt(page),
                    pages: Math.ceil(postCount / perPage)
                })

            })

            })
        })





}



exports.RegistrationCreate = (req, res, next) => {
    const body = _.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'secretCode'])


    let secretCode;
    switch (body.secretCode) {
        case 'okajaka':
            secretCode = true
            break;

        default:
            secretCode = false
            break;
    }


    const User = new UserSchema;
    User.firstName = body.firstName,
        User.lastName = body.lastName,
        User.email = body.email,
        User.power = secretCode
    bcrypt.genSalt(10, (err, salt) => {

        bcrypt.hash(body.password, salt, (err, hash) => {

            User.password = hash
            User.save().then(() => {

                req.flash('success_msg', ` Hey  ${User.firstName}  your registration successful`)
                res.redirect('/login')

            })
        })
    })
}



exports.PassportConfig = () => {

    passport.use(new Local({
        usernameField: 'email'
    }, (email, password, done) => {

        UserSchema.findOne({
            email: email
        }).then(user => {

            if (!user) return done(null, false, {
                message: "Oppps! Incorrect email"
            })

            bcrypt.compare(password, user.password, (err, match) => {

                if (err) throw err

                if (match) {
                    return done(null, user)
                } else {
                    return done(null, false, {
                        message: "Opps! Incorrect password"
                    })
                }



            })


        })

    }))

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserSchema.findById(id, function (err, user) {
            done(err, user);
        });
    });
}



exports.PassportLogin = (req, res, next) => {
    passport.authenticate('local', {

        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true

    })(req, res, next);

}



exports.PassportLogout = (req, res) => {
    req.logOut();
    res.redirect('/login');
}




exports.SinglePost = (req, res, next) => {


    let id;
    if (req.user == null) {
        id = '';
    } else {
        id = req.user.id
    }

    PostSchema.findOne({
        slugs: req.params.slugs
    }).populate({
        path: 'comments',
        populate: {
            path: 'user',
            model: 'users'
        }
    }).populate('user').populate('likers').then(readData => {

        let views = readData.views

        const postId = readData._id
        const likes = readData.likesCount
        const likerArray = readData.likers

        let likeUserArray = [];


        for (let i = 0; i < likerArray.length; i++) {

            const ar = likerArray[i].id

            likeUserArray.push(ar)

        }


        const Booleans = likeUserArray.includes(id)

        PostSchema.findOneAndUpdate({
            slugs: req.params.slugs
        }, {
            $set: {

                views: views + 1
            }
        }).then(() => {

            res.render('font/single', {
                fetchingPosts: readData,
                id: id,
                postId: postId,
                likes: likes,
                like: Booleans,

            })

        })




    })
}




exports.Search = (req, res, next) => {

    if (req.query.search) {

        const regExp = new RegExp(escapeRegex(req.query.search, 'gi'))

        PostSchema.find({
            title: regExp
        }).then(readData => {

            if (readData.length < 1) {

                res.status(200).sendFile(path.join(__dirname, '../views', 'queryfail.html'))
            } else {

                res.render('font/search', {
                    fetchingPosts: readData
                })
            }



        })
    }



}



exports.LikeQerySetting = (req, res) => {


    const count = req.params.v.toString() == 'Like' ? 1 : -1;


    PostSchema.findOneAndUpdate({
        _id: req.params.id
    }, {
        $inc: {
            likesCount: count
        }
    }).then(previousData => {
        res.sendStatus(200)
        


        if (count === 1) {
            PostSchema.findOneAndUpdate({
                _id: req.params.id
            }, {
                $push: {
                    likers: req.user._id
                }
            }, {
                upsert: true
            }).then(() => {
                res.sendStatus(200)              
            }).catch(err=>{
               console.log('like increment')
            })



        } else if (count === -1) {

            PostSchema.findOneAndUpdate({
                _id: req.params.id
            }, {
                $pull: {
                    likers: req.user._id
                }
            }).then(() => {
                res.sendStatus(200)
                
              
            }).catch(err=>{
              console.log('like decremtnt')
            })

        }
    }).catch(err => {
        console.log('')
       
    })



}




function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
