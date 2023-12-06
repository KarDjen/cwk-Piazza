// DB MODEL FOR USERS
// REUSE CODES PROVIDED IN LAB 4
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:{
        type: String,
        require: true,
        min: 3,
        max: 256
    },
    email:{
        type: String,
        require: true,
        min: 6,
        max: 256,
    },
    password:{
        type: String,
        require: true,
        min: 6,
        max: 1024,
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

//  We link the database to this model
module.exports = mongoose.model('users', userSchema)
