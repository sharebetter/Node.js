$(function(){
  $('#regist').find('a').click(function(){   
//    console.log(2333)
      $('#login').show();
      $('#regist').hide();
  })
  $('#login').find('a').click(function(){
      $('#regist').show();
      $('#login').hide();
  })
  $('#regist').find('[name="submit"]').click(function(){
      $.ajax({
        type:"post",
        url:"/user/regist",
        dataType:'json',
        data:{
          user:$('#regist').find('[name="username"]').val(),
          pass:$('#regist').find('[name="password"]').val(), 
          repass:$('#regist').find('[name="repassword"]').val()             
        },
        success:function(data){
          $('#regist').find('.register-message').html(data.message);
          if(!data.code){
            setTimeout(function(){
              window.location.reload()
            },1000)
          }
        }
      });
  })
  
  $('#login').find('[name="submit"]').click(function(){
      $.ajax({
        type:"post",
        url:"/user/login",
        dataType:'json',
        data:{
          user:$('#login').find('[name="username"]').val(),
          pass:$('#login').find('[name="password"]').val()    
        },
        success:function(data){
          $('#login').find('.login-message').html(data.message);
          if(!data.code){
            setTimeout(function(){
              window.location.reload()
            },1000)
          } 
        }
      });
  })
  $('#user-info').find('.logout').click(function(){
      $.ajax({
        type:"post",
        url:"/user/logout",
        dataType:'json',
        data:{
        },
        success:function(data){        
           window.location.reload()
        }
      });
  })
  
//分类删除
  $('.categoryDelt').click(function(){
    var deleBool = window.confirm('确定删除吗？');
    if(deleBool){
      var id=$(this).find('input').val();
      var index=$(this).index('.categoryDelt')+1;
      $.ajax({
          type:"get",
          url:"/admin/category/delete",
          dataType:'json',
          data:{
            _id:id
          },
          success:function(data){        
//           console.log(data.data);
             if(data.data==1){
               $('tr').eq(index).hide();            
             }else if(data.data==2){
               alert('该类名下存在文章，无法直接删除')
             }else if(data.data==3){
               alert('该类名不存在')
             }else{
               window.location.href="/admin/error"
             }
          }
      });
    }    
  })
//管理员内容删除
  $('.contentDelt').click(function(){
    var deleBool = window.confirm('确定删除吗？');
    if(deleBool){
      var id=$(this).find('input').val();
      var index=$(this).index('.contentDelt')+1;
      $.ajax({
          type:"get",
          url:"/admin/content/delete",
          dataType:'json',
          data:{
            _id:id
          },
          success:function(data){        
//           console.log(data.data);
             if(data.data==1){
               $('tr').eq(index).hide();            
             }else{
               window.location.href="/admin/error"
             }
          }
      });
    }    
  })
    //界面  序号
    var len = $('table tr').length;
    for(var i = 1;i<len;i++){
        $('table tr:eq('+i+') td:first').text(i);
    }
    
    //界面跳转
    if($('.panel-footer .jump').attr('href')){  
      var time=3;
      var url=$('.panel-footer .jump').attr('href');
      setTimeout(function(){        
        window.location.href=url
        
      },3000)
      var a=setInterval(function(){
          if(time>1){
            time--;            
            $('.panel-footer .jump').html(time+'秒后跳转');            
          }else{
            clearInterval(a);
          }
      },1000)
    }  
    
    $('.blog-item').hide();
    $('.content-page').hide();
    
    $('.blog-item').slideToggle(500);
    $('.content-page').slideToggle(500);
})
