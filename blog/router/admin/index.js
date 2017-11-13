const express=require('express'),
      router=express(),
      User = require('../../models/User')

router.use(function(req, res , next){
  //每次调用api下面的这个都被初始化，code为0
  if(!req.userInfo.isadmin){
    res.send('对不起，您不是管理员！');
    return;
  }
  next();
})

router.use('/user',require('./user/index'));
router.use('/category',require('./category/index'))
router.use('/content',require('./content/index'));
router.get('/',(req,res)=>{
      res.render('admin/index',{
        userInfo:req.userInfo
      })
})
router.get('/error',(req,res)=>{
      res.render('admin/error')
})
router.get('/success',(req,res)=>{
      res.render('admin/success')
})
//router.get('/user',(req,res)=>{
//var page;
//var limit = 4;
//var totalPage = 0;
//var skip;
//if(!isNaN(req.query.page)){
//  page = Number(req.query.page);
//}else{
//  page = 1;
//}
//User.find().count().then(function(num){
////      console.log(num);
//  totalPage = Math.ceil(num/limit);
//  page = Math.min(totalPage,page);
//  page = Math.max(page,1);
//  skip = (page - 1)*limit;
//  
//  User.find().skip(skip).limit(limit).then(function(result){
////    console.log(result);
//    res.render('admin/user',{
//        userInfo:req.userInfo,
//        users:result,
//        count:totalPage,
//        page:page
//    })
//  })
//    
//})
      
//})

module.exports=router;