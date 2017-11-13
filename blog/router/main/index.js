const express=require('express'),
      User = require('../../models/User'),
      Category = require('../../models/Category'),
      Content = require('../../models/Content'),
      router=express.Router()

let data={};
router.use((req,res,next)=>{
    Category.find().then((cate)=>{
       data.cates=cate;
       next();  
    })     
})
router.get('/',(req,res)=>{
  let page;
  let limit = 3;
  let totalPage = 0;
  let skip;
  if(!isNaN(req.query.page)){
    page = Number(req.query.page);
  }else{
    page = 1;
  }
  let cate_id=req.query.cateId || '';
  let where = {};
  if(cate_id){
    where.category = cate_id;
  }
  
  Content.find().count().then(function(num){
//      console.log(num);
    totalPage = Math.ceil(num/limit);
    page = Math.min(totalPage,page);
    page = Math.max(page,1);
    skip = (page - 1)*limit;
    
    Content.find(where).skip(skip).populate(['category','user']).limit(limit).sort({_id:-1}).then((content)=>{
//    console.log(content);
      res.render('main/index',{
          userInfo:req.userInfo,
          cates:data.cates,
          cateId:cate_id,
          contents:content,
          totalPage:totalPage,
          page:page
      })
    })      
  })
})

router.get('/view',(req,res)=>{
  let content_id=req.query.content;
  let cate_id=req.query.cateId || '';
  Content.findOne({_id:content_id}).populate(['category','user']).sort({_id:-1}).then((content)=>{
    content.views++;
    content.save();
    console.log(req.userInfo)
    res.render('main/content',{
      userInfo:req.userInfo,
      cateId:cate_id,
      cates:data.cates,
      content:content
    });
  })
})

module.exports = router;