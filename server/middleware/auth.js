const { User } = require('../models/User');
// 유저 모델을 가지고 옴
let auth = (req,res,next) => {
    // 인증 처리를 하는곳
    // 클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;
    //토큰 복호화 후 유저 찾기
    User.findByToken(token,(err,user)=>{
        if(err) return err;
        if(!user) return res.json({ isAuth:false, error: true})
        req.token = token;
        req.user = user;
        next();
    })
  
    // 유저여부  있는 인증
}
module.exports = {auth}