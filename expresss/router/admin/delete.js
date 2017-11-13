const express=require('express'),
      router=express.Router(),
      sql=require('../../module/mysql')
      
router.get('/',(req,res)=>{
  res.render('admin/index');
})
router.post('/login',(req,res)=>{
  console.log(req.body);
  sql('select * from `admin` where username=? and password=?',[req.body.user,req.body.pass],(err,data)=>{
     if(data.length==0){       
       res.send("失败");
     }else{
       res.locals.result="<h1>"+req.body.user+"</h1>";
       sql('select * from `user`',[],(err,data)=>{
          res.locals.user=data;
          console.log(data);
         res.render('admin/login');
       })
     }
  })
})
module.exports=router;