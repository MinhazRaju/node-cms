import express from 'express'
import path from 'path'
import hbs from 'express-handlebars'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import session from 'express-session'
import flash from 'connect-flash'
import methodOverride from 'method-override'
import upload from 'express-fileupload'
import passport from 'passport'
import http from 'http'
import socket from 'socket.io'
import PostSchema from './models/PostSchema'

const app = express();
const server  = http.createServer(app)

var io  = socket(server)

io.on('connection', function(){
    console.log('Connected to the server')

})

 


mongoose.Promise = global.Promise;







import db from './helpers/db.helper'
import { getDate  , tirmId  , select ,  tirmText , paginate , i ,gravatar ,access, button} from './helpers/custom.helper'








app.use(express.static(path.join(__dirname , 'public')))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(session({

    secret:"AnySecretkey",
    resave:true,
    saveUninitialized:true


}))
app.use(flash())
app.use(methodOverride('_method'))
app.use(upload())
app.use(passport.initialize())
app.use(passport.session())



mongoose.connect( db.dbURL , {useNewUrlParser:true , useCreateIndex: true})
mongoose.connection.on('open' ,db.mongooseUp ).on('error' , db.mongooseDown)







app.engine('handlebars' , hbs({defaultLayout:'font',  helpers:{button:button,access:access, Date:getDate ,  tirmId:tirmId  , select:select , tirmText:tirmText, paginate: paginate ,i:i, gravatar:gravatar}}))
app.set('view engine' , 'handlebars')


app.use((req , res , next)=>{

    res.locals.user = req.user || null
   
    res.locals.success = req.flash('success_msg')  
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error');
    next()

})



app.post('/likeCounterShow/:id' , (req , res)=>{
    
    PostSchema.find({_id:req.params.id}).then(previousData=>{
        io.emit('previousData' , previousData)
        res.sendStatus(200);

    }).catch(err=>{
        
        res.sendStatus(200)
    })

})







const registerRouter = (route , path) => app.use(route , path)



import font from './routes/font-route'
import admin from './routes/admin-route'
import category from './routes/category-route'
import comment from './routes/comment-route'

registerRouter('/'  , font)
registerRouter('/admin'  , admin)
registerRouter('/admin/category' , category)
registerRouter('/admin/comment' , comment)




app.use((req ,res ,next)=>{
    res.status(404).sendFile(path.join(__dirname , 'views' , '404.html'))
})



server.listen(db.port, db.serverUp)