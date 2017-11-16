const express=require('express'),
      router=express.Router(),
      User = require('../../../models/User')

router.get('/',(req,res)=>{
  let page;
  let limit = 4;
  let totalPage = 0;
  let skip;
  if(!isNaN(req.query.page)){
    page = Number(req.query.page);
  }else{
    page = 1;
  }
  User.find().count().then((num)=>{
//      console.log(num);
    totalPage = Math.ceil(num/limit);
    page = Math.min(totalPage,page);
    page = Math.max(page,1);
    skip = (page - 1)*limit;
    
    User.find().skip(skip).limit(limit).sort({_id:-1}).then((result)=>{
//    console.log(result);
      res.render('admin/user/index',{
          userInfo:req.userInfo,
          users:result,
          count:totalPage,
          page:page
      })
    })
      
  })
})
router.get('/index',(req,res)=>{
  let page;
  let limit = 4;
  let totalPage = 0;
  let skip;
  if(!isNaN(req.query.page)){
    page = Number(req.query.page);
  }else{
    page = 1;
  }
  User.find().count().then((num)=>{
//      console.log(num);
    totalPage = Math.ceil(num/limit);
    page = Math.min(totalPage,page);
    page = Math.max(page,1);
    skip = (page - 1)*limit;
    
    User.find().skip(skip).limit(limit).then((result)=>{
//    console.log(result);
      res.render('admin/user/index',{
          userInfo:req.userInfo,
          users:result,
          count:totalPage,
          page:page
      })
    })
      
  })
})
module.exports=router;