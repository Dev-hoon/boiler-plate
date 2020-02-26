const express = require('express') // express 모듈 가져오기
const app = express()
const port = 5000
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require('./models/Usger');
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

//application.json
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>console.log('MongoDB Connected...'))// 몽고 디비 연결 완료
  .catch(err => console.log(err))// 몽고 디비 연결 에러시 catch 하기

app.get('/', (req, res) => res.send('Hello World!'))
//루트 디렉토리에 출력
app.post('/api/users/register',(req, res) =>{
    //회원 가입에 필요한 정보들을 client 에서 가져오면
    // 그것을 디비에 넣음-
    const user = new User(req.body)
    user.save((err,userInfo)=>{
        if(err) return res.json({success: false,err})
        return res.status(200).json({
            success:true
        })
    })
})
app.post('/api/users/login',(req,res)=>{
    // 요청된 이메일을 데이터 베이스에서 찾아오기
    User.findOne({email: req.body.email},(err,user)=>{
        
        console.log('user',user)
        if(!user){
            return res.json({
                loginSuccess : false,
                message : "입력된 이메일에 해당하는 유저가 없습니다."
            })
        }
    
        // 요청된 이메일이 데이터베이스에 있다면 비밀번호와 매칭하기
        user.comparePassword(req.body.password, (err,isMatch)=>{
            if(!isMatch)
            return res.json({ loginSuccess:false, message :"비밀번호가 틀렸습니다."})
            
            // 비밀번호가지 맞다면 토큰 생성
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                // 토큰 저장 필요 쿠키? 세션? 로컬스토리지
                    res.cookie('x_auth',user.token)
                    .status(200)
                    .json({loginSuccess:true, userId:user._id})

            })
        })
    })
})


// role 1 admin , role 0 customer
app.get('/api/users/auth',auth,(req,res)=>{
    // authentication true 
    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role === 0? false:true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.lastname,
        role : req.user.role,
        image : req.user.image
    })

})

app.get('/api/users/logout',auth,(req,res)=>{
    User.findOneAndUpdate({_id:req.user._id},{token:""}, (err,user) => {
        if (err) return res.json({success:false,err});
        return res.status(200).send({
            success:true
        })
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))