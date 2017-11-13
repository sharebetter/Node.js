const express=require('express'),
      //初始化
      bodyParser = require('body-parser'), 
      swig = require('swig'),
      mongoose = require('mongoose'),
      cookies = require('cookies'),
      app=express();

app.engine('html', swig.renderFile);
app.set('views',__dirname+'/views')
//设置使用的模板引擎是什么
app.set('view engine','html')

swig.setDefaults({
cache:false
});

app.use((req,res,next)=>{
req.cookies = new cookies(req, res);
req.userInfo = {};
if(req.cookies.get('userInfo')){
    try{
      req.userInfo = JSON.parse(req.cookies.get('userInfo'));
      next();
    }catch(e){
      next();
    }
}else{
    next();
}
})
app.use(bodyParser.urlencoded( { extended:true } ));

//app.get('/',(req,res)=>{
////console.log(req.userInfo)
//    res.render('main/index',{userInfo:req.userInfo})
//})
app.use('/',require('./router/main/index'))
app.use('/admin',require('./router/admin/index'))
app.use('/user',require('./router/user/index'))

app.use("/public",express.static(__dirname+'/public'))

mongoose.connect('mongodb://localhost:27017/blog', (err)=> {
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功'); 
        app.listen(235)
    }
})
