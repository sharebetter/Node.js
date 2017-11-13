const express=require('express'),
      User = require('../../models/User'),
      router=express.Router()
      
var responseData;
router.use(function(req, res , next){
  //每次调用api下面的这个都被初始化，code为0
  responseData = {
    code:0,
    message:''
  };
  next();
})

router.get('/',(req,res)=>{
      res.render('main/index',{userInfo:req.userInfo});
})

router.post('/logout',(req,res)=>{
     req.cookies.set('userInfo',null);
     responseData.message = '退出';
     res.json(responseData);
     return;
})

router.post('/regist',(req,res)=>{
//    console.log(req.body);
      var username = req.body.user;
      var password = req.body.pass;
      var repassword = req.body.repass;
    
      //用户名是否为空；
      if(username === ''){
        responseData.code =1;
        responseData.message = '用户名不能为空';
        res.json(responseData);
        return;
      }
    
      //密码不能为空
      if(password === ''){
        responseData.code = 2;
        responseData.message = '密码不能为空';
        res.json(responseData);
        return;
      }
    
      //两次密码要一样
      if(password !== repassword){
        responseData.code = 3;
        responseData.message = '两次密码不一样';
        res.json(responseData);
        return;
      }
      User.findOne({
        username:username
      }).then(function(userinfo){
        if(userinfo){
          //表示有数
          responseData.code = 4;
          responseData.message = '用户名已经存在';
          res.json(responseData);
          return;
        }else{
          //表示没有数据
          var user = new User({
            username:username,
            password:password
          });
          return user.save();
        }
      }).then((newUserinfo)=>{
        if(newUserinfo){
          req.cookies.set('userInfo',JSON.stringify({
             _id:newUserinfo._id,
             username:newUserinfo.username,
             isadmin:Boolean(newUserinfo.isAdmin)
          }));

          responseData.message = '注册成功';
          res.json(responseData);
        }
      })
})

router.post('/login',(req, res, next)=>{
  var username = req.body.user;
  var password = req.body.pass;
  if(!username) {
    responseData.code = 1;
    responseData.message = '用户名不能为空';
    res.json(responseData);
    return;
  }

  if(!password) {
    responseData.code = 2;
    responseData.message ='密码不能为空';
    res.json(responseData);
    return;
  }

  User.findOne({
    username:username,
    password:password
  }).then(function(userinfo) {

    if(!userinfo){
      responseData.code = 3;
      responseData.message = '用户不存在或密码错误';
      res.json(responseData);
      return;
    }
    
//  设置时间（res.cookie）
//  res.cookie('userInfo',JSON.stringify({
//    _id:userinfo._id,
//    username:userinfo.username
//  }),{maxAge:1000*60*60*24});
//或（req.cookies.set()）
    req.cookies.set('userInfo',JSON.stringify({
      _id:userinfo._id,
      username:userinfo.username,
      isadmin:Boolean(userinfo.isAdmin)
    }));    
    responseData.message = '登陆成功';
    
    res.json(responseData);
  })
})

module.exports=router;