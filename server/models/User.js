const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10 // 암호화 자리 숫자
const jwt = require('jsonwebtoken')

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
// save 전 동작 임
userSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        // 비밀번호가 수정 될때만 암호화 됨
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err)
                user.password = hash
                next()
            });
        });
    }else{
        next()
    }
    next()
})

userSchema.method.comparePassword = function(plainPassword, cb){
    //plainPassWord is input 
    bcrypt.compare(plainPassword, this.password,function(err,isMatch){
        if(err) return cb(err),
        cb(null,isMatch)
    })

}
userSchema.methods.generateToken= function(cb){
    //json webtoken을 이용해서 token 만들기
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'secretToken')
    //user._id + 'secretToken' = token
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
