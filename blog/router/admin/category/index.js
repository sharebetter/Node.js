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
  Category.find().count().then(function(num){
//      console.log(num);
    totalPage = Math.ceil(num/limit);
    page = Math.min(totalPage,page);
    page = Math.max(page,1);
    skip = (page - 1)*limit;
    
    Category.find().skip(skip).limit(limit).sort({_id:-1}).then(function(result){
//    console.log(result);
      res.render('admin/category/category_index',{
          userInfo:req.userInfo,
          cates:result,
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
  Category.find().count().then(function(num){
//      console.log(num);
    totalPage = Math.ceil(num/limit);
    page = Math.min(totalPage,page);
    page = Math.max(page,1);
    skip = (page - 1)*limit;
    
   Category.find().skip(skip).limit(limit).sort({_id:-1}).then(function(result){
//    console.log(result);
      res.render('admin/category/category_index',{
          userInfo:req.userInfo,
          cates:result,
          count:totalPage,
          page:page
      })
    })
      
  })
})

router.get('/add',(req,res)=>{
  res.render('admin/category/category_add.html',{
          userInfo:req.userInfo          
  })
})
//修改分类
router.get('/edit',function(req,res, next){
  var id = req.query.id || '';
  Category.findOne({
    _id:id
  }).then(function(cate){
    
    if(!cate){
      res.render('admin/error',{
        userInfo:req.userInfo,
        error:'类名不存在'
      })
      return Promise.reject();
    }else{
      res.render('admin/category/category_edit',{
        userInfo:req.userInfo,
        cate:cate
      });
    }
  })
})
router.post('/edit',function(req, res, next){
  
  var name = req.body.catename;
  var id = req.query.id;

  Category.findOne({
    _id:id
  }).then(function(cate){
    if(!cate){
      res.render('admin/error',{
        userInfo:req.userInfo,
        error:'该类不存在',
        url:'/admin/category'
      })
      return Promise.reject();
    }else{
      if(name === ''){
        res.render('admin/error',{
          userInfo:req.userInfo,
          error:'类名不能为空',
          url:'/admin/category'
        })
        return Promise.reject();
      }else{
        if(name === cate.name){
          res.render('admin/success',{
            userInfo:req.userInfo,
            message:'类名更改成功',
            url:'/admin/category'
          })
          return Promise.reject();
        }else{
          return Category.findOne({
            _id:{$ne:id},
            name:name
          });
        }
      }
    }
  }).then(function(hadCate){
    if(hadCate){
      res.render('admin/error',{
        userInfo:req.userInfo,
        error:'该类名已经存在',
        url:'/admin/category'
      })
      return Promise.reject();
    }else{
      return Category.update({
        _id:id
      },{
        name:name
      })
    }
  }).then(function(){
    res.render('admin/success',{
      userInfo:req.userInfo,
      message:'类名编辑成功',
      url:'/admin/category'
    })
  })
})
//分类添加
router.post('/add',(req,res)=>{  
  let name = req.body.catename;
  if(name === ''){
    res.render('admin/error',{
      userInfo:req.userInfo,
      error:'类名不能为空'
    })
    return;
  }
  Category.findOne({
      name:name
    }).then(function(cateInfo){
//    console.log(cateInfo)
      if(cateInfo){
        res.render('admin/error',{
          userInfo:req.userInfo,
          error:'类名已经存在'
        });
        return Promise.reject();
      }else{
        return new Category({
          name:name
        }).save();
      }
    }).then(function(cateInfo){
      if(cateInfo){
        res.render('admin/success',{
          cateInfo:cateInfo,
          userInfo:req.userInfo,
          message:'添加类名成功',
          url:'/admin/category/'
        })
      }
    })
})
//删除类
router.get('/delete',function(req, res, next){
  var id = req.query._id;
//console.log(id)
//Category.findOne({_id:id}).then(function(rs){
//  if(rs){
//   
//  }
//})
   Content.find({category:id}).then(function(content){     
      if(content.length>0){
         res.json({'data':2})    /*类名下存在文章*/
      }else{
          Category.findOne({_id:id}).then(function(rs){
            if(rs){
               Category.remove({
                _id:id
              }).then(function(data){
                if(data){
                  res.json({'data':1}) /*成功*/
                }else{
                  res.json({'data':0})      /*失败*/
                }   
              })
            }else{
              res.json({'data':3})
            }
          })                  
      }          
    })
})
module.exports=router;