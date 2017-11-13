const http=require('http'),
      express=require('express'),
      bodyParser = require('body-parser'), 
      cookieParser=require('cookie-parser'),
      app=express()

app.set('views',__dirname+'/views')
//设置使用的模板引擎是什么
app.set('view engine','ejs')
//设置post的提交方式
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended:true } ));
app.use(cookieParser('adfasdfadsf'))//密钥

app.use('/admin',require('./router/admin/index'))
app.use('/user',require('./router/user/index'))

app.get('/',(req,res)=>{
  res.render('index')
})
app.use('/',express.static(__dirname+'/public'));
http.createServer(app).listen(235)