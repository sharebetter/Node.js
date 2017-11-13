const express=require('express'),
      router=express.Router(),
      sql=require('../../module/mysql')
      
router.get('/',(req,res)=>{
  if(req.cookies['login']){
    console.log(req.cookies['login'])
    res.locals.result="<h1>"+req.cookies['login'].name+"</h1>";
       sql('select * from `user`',[],(err,data)=>{
          res.locals.user=data;
//        console.log(data);
         res.render('admin/index');
    })
  }else{
      res.render('admin/login');
  }
})
router.get('/login',(req,res)=>{
      res.render('admin/login');
})
router.get('/logout',(req,res)=>{
      res.clearCookie('login');
      res.redirect('login');
})
router.post('/index',(req,res)=>{
//console.log(req.body);
  sql('select * from `admin` where username=? and password=?',[req.body.user,req.body.pass],(err,data)=>{
     if(data.length==0){       
       res.send("失败");
     }else{
       res.locals.result="<h1>"+req.body.user+"</h1>";
       sql('select * from `user`',[],(err,data)=>{
          res.locals.user=data;
          res.cookie('login', {name:req.body.user} ,{maxAge:1000*60*60*24} )
          console.log(req.cookies['login'])
//        console.log(data);
         res.render('admin/index');
       })
     }
  })
})
router.post('/delete',(req,res)=>{
  console.log(req.body);
  sql('delete from `user` where id=?',[req.body.id],(err,data)=>{
     res.json({
            result:'成功'
      })
  })
})
module.exports=router;