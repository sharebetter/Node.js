const express=require('express'),
      router=express.Router(),
      Content = require('../../../models/Content'),
      Category = require('../../../models/Category')

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
  Content.find().count().then(function(num){
//      console.log(num);
    totalPage = Math.ceil(num/limit);
    page = Math.min(totalPage,page);
    page = Math.max(page,1);
    skip = (page - 1)*limit;
    
    Content.find().skip(skip).sort({_id:-1}).populate(['category','user']).limit(limit).then(function(result){
//    console.log(result);
      res.render('admin/content/content_index',{
          userInfo:req.userInfo,
          contents:result,
          count:totalPage,
          page:page
      })
    })
      
  })
})

//添加内容
router.get('/add',(req,res)=>{
  Category.find().then(function(result){
    res.render('admin/content/content_add',{
        userInfo:req.userInfo,
        cates:result
    })
  }) 
})
//删除内容
router.get('/delete',function(req, res, next){
  var id = req.query._id;
//console.log(id)

  Content.remove({
      _id:id
  }).then(function(data){
    if(data){
      res.json({'data':1})
    }else{
      res.json({'data':0})
    }
      
  });
});
//修改内容
router.get('/edit',function(req,res, next){
  var id = req.query.id || '';
  Content.findOne({
    _id:id
  }).then(function(contentInfo){    
    if(!contentInfo){
      res.render('admin/error',{
        userInfo:req.userInfo,
        error:'该文章不存在'
      })
      return Promise.reject();
    }else{
      Category.find().then(function(cates){
        res.render('admin/content/content_edit',{
          userInfo:req.userInfo,
          contents:contentInfo,
          cates:cates
        })   
      })
    }
  })
})
//内容修改
router.post('/edit',function(req, res, next){
  let id = req.body.content_id
  let title=req.body.title;
  let description=req.body.description;
  let contents = req.body.content;
  let category = req.body.category;
  let userId = req.userInfo._id.toString();

  if(title === ''){
    res.render('admin/error',{
      userInfo:req.userInfo,
      error:'标题不能为空'
    })
    return;
  }

  if(contents === ''){
    res.render('admin/error',{
      userInfo:req.userInfo,
      error:'内容不能为空'
    })
    return;
  }
  Content.findOne({
    _id:id
  }).then(function(content){
//  console.log(content)
    if(!content){
      res.render('admin/error',{
        userInfo:req.userInfo,
        error:'该文章不存在',
        url:'/admin/content'
      })
      return Promise.reject();
    }else{   

      if(content.title === title && content.description === description && content.category.toString() === category && content.content.toString() === contents){
        res.render('admin/success',{
          userInfo:req.userInfo,
          message:'内容编辑成功',
          title:'内容管理', 
          url:'/admin/content'
        })
      }else {
        console.log(222)
        return Content.update({
          _id:id
        },{
          $set:{
            content:contents,
            category:category,
            description:description,
            title:title
          }
        });
      }
    }
  }).then(function(rs){
    if(rs){
      res.render('admin/success',{
        userInfo:req.userInfo,
        message:'内容编辑成功',
        title:'内容管理', 
        url:'/admin/content'
      })
    }
  })
})
//内容添加
router.post('/add',(req,res)=>{  
  let title=req.body.title;
  let description=req.body.description;
  let content = req.body.content;
  let category = req.body.category;
  let userId = req.userInfo._id.toString();
  if(title === ''){
    res.render('admin/error',{
      userInfo:req.userInfo,
      title:'内容管理',
      error:'标题不能为空'
    })
    return;
  }

  if(content === ''){
    res.render('admin/error',{
      userInfo:req.userInfo,
      title:'内容管理',
      error:'内容不能为空'
    })
    return;
  }
  new Content({
    category:category,
    title:title,
    description:description,
    content:content,
    user:userId
  }).save().then(function(contentSave){
    if(contentSave){
      res.render('admin/success',{
        userInfo:req.userInfo,
        message:'内容保存成功',
        title:'内容管理',        
        url:'/admin/content'
      })
    }else{
      res.render('admin/error',{
        userInfo:req.userInfo,
        title:'内容管理',
        message:'内容保存失败'
      })
    }
  })

})
//删除类
router.get('/delete',function(req, res, next){
  var id = req.query._id || '';
  if(!id){
    res.render('admin/error',{
      userInfo:req.userInfo,
      error:'id不存在'
    })
    return;
  }
  Content.findOne({
    _id:id
  }).then(function(content){
    if(!content){
      res.render('admin/error',{
        userInfo:req.userInfo,
        error:'内容不存在'
      })
      return Promise.reject();
    }else{
      return Content.remove({
        _id:id
      })
    }
  }).then(function(rs){
   if(rs){
      res.json({'data':1})
    }else{
      res.json({'data':0})
    }
  })

});

module.exports=router;