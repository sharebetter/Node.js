const express = require('express');
const router = express();
const User = require('../models/user');
require('./../util/util')

let userId = '';
router.use((req,res,next)=>{
	if(req.cookies.userId){
		userId = req.cookies.userId;    		
	}
	next();
})
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', function(req, res) {
  let userName = req.body.userName;
  let userPwd = req.body.userPwd;
  User.findOne({'userName':userName}).then((userInfo) => {
  	if(userInfo){
  		res.cookie("userId",userInfo.userId,{
          path:'/',
          maxAge:1000*60*60
      });
      res.cookie("userName",userInfo.userName,{
        path:'/',
        maxAge:1000*60*60
      });
      res.json({
      	result:userInfo,
      	status:0,
      	msg:''
      })
      return;
  	}else{
  		res.json({
      	result:'',
      	status:1,
      	msg:'用户名或密码错误'
      })
      return;
  	}
  })
});
router.get('/logOut',(req,res) =>{
	res.cookie("userId",'',{
      path:'/',
      maxAge:-1
  });
  res.cookie("userName",'',{
      path:'/',
      maxAge:-1
  });
  res.json({
  	status:0,
  	msg:'',
  	result:''
  })
})
router.get('/checkLogin',(req,res) => {
	if(req.cookies.userId){
		res.json({
			status:0,
			result:{
				userName: req.cookies.userName
			},
			msg: ''
		})
	}
})
router.get('/cart',(req,res) => {
	// console.log(212)
	User.findOne({'userId':req.cookies.userId}).then(cartInfo => {
		if(cartInfo){
  // console.log(cartInfo.cartList)
			res.json({
				status: 0,
				msg: '',
				result: cartInfo.cartList
			})
		}
	})
})
//********添加子文档
router.post('/cartEdit',(req,res) => {
	let productId = req.body.productId;
	let productNum = req.body.productNum;
	let checked = req.body.checked
	User.update({'userId':userId,"cartList.productId":productId},{
		"cartList.$.productNum":productNum,
    "cartList.$.checked":checked
	}).then(cartInfo => {
		if(cartInfo){
//			console.log(cartInfo.cartList)
			res.json({
				status: 0,
				msg: 'success',
				result: ''
			})
		}else{
			res.json({
				status: 1,
				msg: 'fail',
				result: ''
			})
		}
	})
})
//*******删除子文档
router.post('/cartDelt',(req,res) => {
	let productId = req.body.productId;
	User.update({
	    userId:userId
	  },{
	    $pull:{
	      'cartList':{   //cartList为子文档数组
	        'productId':productId   //删除该数组下productId为。。。的数据
	      }
	    }
	  }).then((cartUpdate)=>{
	    if(cartUpdate){
	      res.json({
	        status: '0',
	        msg: 'success',
	        result:''
	      });
	    }else{
	      res.json({
	        status:'1',
	        msg:'',
	        result:''
	      });
	    }
  })
})
router.post('/checkAll',(req,res)=>{
	let checkAll = req.body.checkAll;
	//console.log(checkAll)
	User.findOne({'userId':userId}).then((userInfo)=>{
		if(userInfo){
			userInfo.cartList.forEach((item)=>{
//				console.log(item.checked)
				item.checked = checkAll;
			})
			userInfo.save().then((checkAllSave)=>{
				if(checkAllSave){
					res.json({
		        status: '0',
		        msg: 'success',
		        result:''
		      });
				}else{
		      res.json({
		        status:'1',
		        msg:'',
		        result:''
		      });
		    }
			})
		}
	})	
})
router.get('/address', (req,res) => {
	//console.log(233)
  User.findOne({'userId':userId}).then((userInfo)=>{
  	if(userInfo){
      res.json({
      	status: 0,
      	msg: '',
      	result: userInfo.addressList
      })
  	}else{
      res.json({
      	status: 1,
      	msg: '用户地址获取错误',
      	result: ''
      })
    }
  })
})
router.post('/delAddress', (req,res) => {
	let addressId = req.body.addressId
	User.update({
	    userId:userId
	  },{
	    $pull:{
	      'addressList':{   //addressList为子文档数组
	        'addressId': addressId   //删除该数组下addressId为。。。的数据
	      }
	    }
	}).then((addressDel) => {
	  if(addressDel){
	  	res.json({
	      	status: 0,
	      	msg: '地址删除成功',
	      	result: ''
	      })
	  }else{
	  	res.json({
	      	status: 1,
	      	msg: '地址删除失败',
	      	result: ''
	    })
	  }
	})
	
})
router.post('/setAddressDefault',(req,res) => {
   // console.log(222)
   let addressId = req.body.addressId
   User.findOne({'userId':userId}).then((userInfo)=>{
   	if(userInfo){
   		userInfo.addressList.forEach((item)=>{
   			if(item.addressId==addressId){
   				item.isDefault = true
   				// console.log(addressId)
   			}else{
   				item.isDefault = false
   			}
   		})
   		userInfo.save().then((setAddressDefault)=>{
   			if(setAddressDefault){
   				res.json({
			      	status: 0,
			      	msg: '默认地址设置成功',
			      	result: ''
			    })
   			}else{
			  	res.json({
			      	status: 1,
			      	msg: '默认地址设置失败',
			      	result: ''
			    })
			}
   		})
   	}
   })
})
router.get('/orderConfirm', (req,res) =>{
	User.findOne({'userId': userId}).then((orderInfo) => {
		if(orderInfo){	
			res.json({
			      	status: 0,
			      	msg: '订单信息获取成功',
			      	result: orderInfo.cartList
			    })
   			}else{
			  	res.json({
			      	status: 1,
			      	msg: '订单信息获取失败',
			      	result: ''
			    })
			}
	})
})
router.post("/payMent", (req,res) => {
    addressId = req.body.addressId,
    totalMoney = req.body.totalMoney;
    User.findOne({'userId': userId}).then(orderInfo => {
	  	 if(orderInfo){
	  	 	let address = '', goodsList = [];
	       //获取当前用户的地址信息
	       orderInfo.addressList.forEach((item)=>{
	          if(addressId==item.addressId){
	            address = item;
	          }
	       })
	       //获取用户购物车的购买商品
	       orderInfo.cartList.filter((item)=>{
	         if(item.checked=='1'){
	           goodsList.push(item);
	         }
	       });
	       let platform = '622';
	       let r1 = Math.floor(Math.random()*10);
	       let r2 = Math.floor(Math.random()*10);
	       let sysDate = new Date().Format('yyyyMMddhhmmss');
	       let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
	       let orderId = platform+r1+sysDate+r2;
	       let order = {
	          orderId: orderId,
	          orderTotal: totalMoney,
	          addressInfo: address,
	          goodsList: goodsList,
	          orderStatus: '1',
	          createDate: createDate
	       };
	       orderInfo.orderList.push(order);
	       orderInfo.save().then((orderSave) => {
	       	  if(orderSave){
	       	  	res.json({
	              status: 0,
	              msg: '订单信息保存成功',
	              result: {
	                orderId:order.orderId,
	                orderTotal:order.orderTotal
	              }
	            });
	       	  }else{
	       	  	res.json({
	              status: 10002,
	              msg: '订单信息保存失败',
	              result: ''
	            });
	       	  }
	       })
	  	 }else{
	  	 	res.json({
	              status: 0,
	              msg: '用户信息获取失败',
	              result: ''
	        });
	  	 }
    })
})
router.get('/orderDetail', (req,res) => {
	let orderId = req.query.orderId;
	User.findOne({'userId': userId}).then(orderInfo => {
		if(orderInfo){
			let orderList = orderInfo.orderList, totalMoney = 0;
			if(orderList.length>0){
			   orderList.forEach((item) => {
				  if(item.orderId == orderId){
	                totalMoney = item.orderTotal;
	              }
			   })
			}
			if(totalMoney>0){
              res.json({
                status:'0',
                msg:'订单信息获取成功',
                result:{
                  orderId: orderId,
                  totalMoney: totalMoney
                }
              })
            }else{
              res.json({
               status: '120002',
               msg: '无此订单',
               result: ''
             });
            }
		}else{
           res.json({
             status:'120001',
             msg:'当前用户未创建订单',
             result:''
           });
         }
	})
})
// vuex需要的购物车数量数据
router.get('/getCartCount', (req,res) => {
	User.findOne({'userId': userId}).then((userInfo) => {
	   if(userInfo){
		   let cartList = userInfo.cartList;
	       let cartCount = 0
		   cartList.forEach((item) => {		   	  
		   	   cartCount+=parseInt(item.productNum);
		    })
		   	res.json({
	            status: '0',
	            msg: '购物车数量获取成功',
	            result: cartCount
	        });
	   }else{
	   	 res.json({
	        status: '1',
	        msg: '购物车数量获取失败',
	        result: ''
	     });
	   }
	})
})
module.exports = router;
