const express = require('express') // express 모듈 가져오기
const app = express()
const port = 5000
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://db_admin:ahdrhelqlqlalfqjsgh@tube-v5mjb.mongodb.net/test?retryWrites=true&w=majority',{
    useNewUrlParser: true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>console.log('MongoDB Connected...'))// 몽고 디비 연결 완료
  .catch(err => console.log(err))// 몽고 디비 연결 에러시 catch 하기

app.get('/', (req, res) => res.send('Hello World!'))
//루트 디렉토리에 출력
app.listen(port, () => console.log(`Example app listening on port ${port}!`))