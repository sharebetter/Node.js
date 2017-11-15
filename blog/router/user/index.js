const express=require('express'),
      User = require('../../models/User'),
      formidable = require('formidable'),
      sd = require("silly-datetime"),
      fs = require('fs'),
      AVATAR_UPLOAD_FOLDER = 'public/avatar/',/*设置头像保存目录*/
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
//    console.log(233)
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
          global.avatar=userinfo.avatar;
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
    global.avatar=userinfo.avatar;
    responseData.message = '登陆成功';
    
    res.json(responseData);
  })
})
//头像修改
router.post('/uploadImg',(req,res)=>{
//console.log(233)
   var form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = AVATAR_UPLOAD_FOLDER;    //设置上传目录
    form.keepExtensions = true;  //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function (err, fields, files) {

        if (err) {
            return res.json({
                "code": 500,
                "message": "内部服务器错误"
            })
        }

        // 限制文件大小 单位默认字节 这里限制大小为2m
        if (files.fulAvatar.size > form.maxFieldsSize) {
            fs.unlink(files.fulAvatar.path)
            return res.json({
                "code": 401,
                "message": "图片应小于2M"
            })
        }

        var extName = '';  //后缀名
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }

        if (extName.length == 0) {
            return res.json({
                "code": 404,
                "message": "只支持png和jpg格式图片"
            })
        }

        //使用第三方模块silly-datetime
        var t = sd.format(new Date(), 'YYYYMMDDHHmmss');
        //生成随机数
        var ran = parseInt(Math.random() * 8999 + 10000);

        // 生成新图片名称
        var avatarName = t + '_' + ran + '.' + extName;
        // 新图片路径
        var newPath = form.uploadDir + avatarName;

        // 更改名字和路径
        fs.rename(files.fulAvatar.path, newPath, function (err) {
            if (err) {
                return res.json({
                    "code": 401,
                    "message": "图片上传失败"
                })
            }
            
            User.update({
              _id:req.userInfo._id
            },{
              $set:{
                avatar:AVATAR_UPLOAD_FOLDER + avatarName
              }
            }).then(function(avatarSave){
              global.avatar=avatarSave.avatar;
//            console.log(global.avatar)
              if(avatarSave){               
                return res.json({
                    "code": 200,
                    "message": "上传成功",
                    result: AVATAR_UPLOAD_FOLDER + avatarName
                })
              }else{
                return res.json({
                    "code": 401,
                    "message": "数据库保存失败"
                })
              }
            })
                       
        })
    }); 

})
module.exports=router;