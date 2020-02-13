const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type : String,
        maxlenght : 50
    },
    email:{
        type : String,
        trim: true,
        unique :1
    },
    password:{
        type : String,
        minlenght : 5
    },
    lastname:{
        type : String,
        maxlenght : 50
    },
    role:{
        type : Number,
        default : 0
    },
    image: String,
    token: String,
    tokenExp : Number
})

const User = mongoose.model('User', userSchema)

module.exports = { User }
