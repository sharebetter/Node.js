const express = require('express');
const router = express.Router();
const Goods = require('../models/goods');
const User = require('../models/user');
//连接MongoDB数据库

let userId = '';
router.use((req,res,next)=>{
	if(req.cookies.userId){
		userId = req.cookies.userId;    		
	}
	next();
})
/* GET home page. */
router.get('/index', (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let pageSize =parseInt(req.query.pageSize) || 8;
  let sort = parseInt(req.query.sort) || 1;
  let priceLevel = {};

if(req.query.priceLevel){
	let priceRander = JSON.parse(req.query.priceLevel)
		priceLevel = {
			'salePrice': {
				'$gte': priceRander.startPrice,
				'$lte': priceRander.endPrice
			}
		}
}
//req.query.sort或req.param('sort')两种写法
//console.log(page,pageSize,sort,priceLevel)
  let skip = (page - 1)*pageSize;
  Goods.find(priceLevel).skip(skip).sort({'salePrice':sort}).limit(pageSize).then((doc)=> {
  	if(doc){
//		console.log(doc)
  		res.json({
  			status:'0',
  			mes:'',
  			result:{
  				count:doc.length,
  				list:doc
  			}
  		})
  	}else{
  		res.json({
  			status:'1',
  			mes:'失败'		
  		})
  	}
  })
});
router.post('/addCart', (req, res)=>{
   let productId = req.body.productId;
   let flag = false;
   User.findOne({'userId':userId}).then((userInfo)=>{
   	 if(userInfo){
   	 	  userInfo.cartList.forEach((item)=>{
   	 	  	if(item.productId == productId){
   	 	  		item.productNum++;
   	 	  		flag = true; 
   	 	  	}
   	 	  })
   	 	  if(flag){
   	 	  	userInfo.save().then((cartInfoSave)=>{		   	 	  	
				 if(cartInfoSave){
				 	 res.json({
				   	 	 	 status:'0'
				   	   })
				 }else{
				 	res.json({
				   	 	 	 status:'1'
				   	 	})   	 	  			 	    	 	  			 
				 }
	 	  		 return;   	 	  			 
	   	 	  })   	 
   	 	  }else{
	   	 	  	Goods.findOne({'productId':productId}).then((productInfo)=>{
	   	 	  	if(productInfo){
	   	 	  		let addGoodInfo = {
	   	 	  			 productId: productInfo.productId,
	   	 	  			 productName: productInfo.productName,
	   	 	  			 salePrice: productInfo.salePrice,
	   	 	  			 productImage: productInfo.productImage,
	   	 	  			 productNum: '1',
	   	 	  			 checked: '1'
	   	 	  		}
//	   	 	  		console.log('gg')
	   	 	  		userInfo.cartList.push(addGoodInfo)
	   	 	  		userInfo.save().then((cartInfoSave)=>{
	   	 	  			 if(cartInfoSave){
	   	 	  			 	 res.json({
						   	 	 	 status:'0'
						   	   })
	   	 	  			 }else{
	   	 	  			 	res.json({
						   	 	 	 status:'1'
						   	 	})
	   	 	  			 }
	   	 	  		})
	   	 	  	}else{
	   	 	  		res.json({
				   	 	 	 status:'1'
				   	 	})
	   	 	  	}
	   	 	  })
   	 	  }   	 	  
   	 }else{
   	 	 res.json({
   	 	 	  status:'1'
   	 	 })
   	 }
   })
   
});
module.exports = router;
