const express=require('express'),
      User = require('../../models/User'),
      Category = require('../../models/Category'),
      Content = require('../../models/Content'),
      router=express.Router(),
      fs = require('fs'),
      marked = require('marked')

let data={};
let responseData={};
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
//console.log(cate_id+'123')
  let where = {};
  if(cate_id){
    where.category = cate_id;
  }
  
  Content.find(where).count().then((num)=>{
//      console.log(num);
    totalPage = Math.ceil(num/limit);
    page = Math.min(totalPage,page);
    page = Math.max(page,1);
    skip = (page - 1)*limit;
    User.findOne({_id:req.userInfo._id}).then((rs)=>{
      global.avatar=rs.avatar;
    })
    Content.find(where).skip(skip).populate(['category','user']).limit(limit).sort({_id:-1}).then((content)=>{
//    console.log(content);
//    console.log(global.avatar);
      res.render('main/index',{
          userInfo:req.userInfo,
          avatar:global.avatar,
          cates:data.cates,
          cateId:cate_id,
          contents:content,
          totalPage:totalPage,
          page:page
      })
    })      
  })
})

router.get('/comment',(req,res)=>{
  let content_id=req.query.content;
  let cate_id=req.query.cateId || '';
  User.findOne({_id:req.userInfo._id}).then((rs)=>{
      global.avatar=rs.avatar;
  })
  Content.findOne({_id:content_id}).populate(['category','user']).sort({_id:-1}).then((content)=>{
    content.views++;
    content.save();
    //console.log(req.userInfo)
    //评论反序输出
    content.comment.reverse();
//  console.log(content.content);
    res.render('main/comment',{
      userInfo:req.userInfo,
      avatar:global.avatar,
      cateId:cate_id,
      cates:data.cates,
      content:content
    });
  })
})
router.post('/addComment',(req,res)=>{
  let userComment=req.body.comment;
  let contentId=req.body.contentId;
  //console.log(userComment,contentId)
  let commentData={
    username:req.userInfo.username,
    userId:req.userInfo._id,
    postDate:new Date(),
    userComment:userComment
  }
  Content.findOne({_id:contentId}).then((content)=>{
    content.comment.push(commentData);
    return content.save();    
  }).then((contentSave)=>{
//   console.log(contentSave)
    contentSave.comment.reverse();
    responseData.comment=contentSave.comment
    if(contentSave){      
   //console.log('6')
      res.json({
        'status':1,
        responseData
      });
    }else{
     res.json({'status':0});
    }
  })
})

router.post('/getComment',(req, res, next)=>{
  let id = req.body.contentId || '';
  Content.findOne({
    _id:id
  }).then((contentInfo)=>{
//  console.log(contentInfo)
    responseData.comment = contentInfo.comment.reverse();
    res.json({
      'status':1,
      responseData
    });
  })
})

module.exports = router;