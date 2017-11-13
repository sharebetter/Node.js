const express=require('express'),
      router=express.Router(),
      sql=require('../../module/mysql')
      
router.get('/',(req,res)=>{
  res.render('user/login');
})
router.post('/login',(req,res)=>{
  sql('select * from `user` where username=? and password=?',[req.body.user,req.body.pass],(err,data)=>{
    if(data.length==0){
      res.send('用户名或密码错误');
    }else{
      res.json('c')
    }
  })
})
router.get('/index',(req,res)=>{
  res.render('user/index');
})
module.exports=router;