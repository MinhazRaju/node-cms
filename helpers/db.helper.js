const db = {

    //Server config

    port: process.env.PORT || 1000,

    serverUp: function () {
        console.log(`server up : localhost:${db.port}`)
    },



    // Mongoose config

    dbURL: 'mongodb://localhost:27017/CMS',

    mongooseUp: function () {
        console.log("Mongoose ORM conncted")
    },

    mongooseDown: function (err) {
        console.log("DB connection error ~ Error log: " + err)
    },












}


module.exports = db