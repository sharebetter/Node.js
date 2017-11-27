# Node.js
node express框架的案例

## 项目说明
### express项目：
> node express,mysql,包含用户登录注册等表单提交功能，ajax交互，session,cookie用户信息保存。

### blog项目：
> 1.  node express,mongodb,mongose,ajax交互，前后端分离的博客项目
2.  session保存用户信息，管理员发表文章和添加分类.  
3.  文章的内容markdown显示，支持代码高亮  
4.  用户评论和查看文章，用户修改头像

### vue+express项目：
> 主要技术栈: 
　vue-cli 2.0全家桶 + node express框架 + mongodb数据库 + vuex + axios

#### 项目说明：
> 1. node express,mongodb,mongose,axios交互，前后端分离的商城项目
前端vue：vue文件夹　　后端express:express文件夹。
2. session保存用户信息，用户可以购物车添加和删除，收货地址选择等。
3. 分别通过axios.get()和axios.post()进行用户信息获取和提交,与后台express配合，进行数据交互，通过proxyTable代理,解决不同端口的跨域问题。
4.  vuex解决多个页面组件调用状态的更改,进行信息的同步更改，省去父子组件之间频繁的数值传递。
