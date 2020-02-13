const express = require('express') // express 모듈 가져오기
const app = express()
const port = 5000
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { User } = require('./models/User')
const config = require('./config/key')

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//application.json
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>console.log('MongoDB Connected...'))// 몽고 디비 연결 완료
  .catch(err => console.log(err))// 몽고 디비 연결 에러시 catch 하기

app.get('/', (req, res) => res.send('Hello World!'))
//루트 디렉토리에 출력
app.post('/register',(req, res) =>{
    //회원 가입에 필요한 정보들을 client 에서 가져오면
    // 그것을 디비에 넣음
    const user = new User(req.body)
    user.save((err,doc)=>{
        if(err) return res.json({success: false,err})
        return res.status(200).json({
            success:true
        })
    })
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))