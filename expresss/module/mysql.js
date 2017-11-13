const mysql=require("mysql");

module.exports=function(sql,zhi,callback){
  let config=mysql.createConnection({
  //数据库的地址
  host:"localhost",
  //数据库用户名
  user:"root",
  password:"",
  //配置的数据库
  database:"test"
})
  //开始连接
  config.connect()
  //进行数据库的操作   1.第一个参数是数据库的代码   2.第二个参数是一个回调
  //回调函数里面第一个参数 1.错误err 2.是返回回来的数据
  // 插入的格式  1.数据库代码  2.动态的值  3回调
  config.query(sql,zhi,(err,data)=>{
    callback(err,data)
  })
  //结束链接
  config.end()
}

