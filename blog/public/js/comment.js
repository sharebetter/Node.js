$(function(){
    var currentPage=1;
    var commentData;
    var totalPage;
    var minPage=1;
    var limit=3;
      //添加用户评论
      $('.comment .submit.btn.btn-primary').click(function(){
        var content = $('.input-group').find('[name="content"]').val()
        if(content===''){
          $('.comment .message').html('评论内容不能为空！').stop().hide(); 
          $('.comment .message').stop().show(1000)
          setTimeout(function(){
             $('.comment .message').stop().toggle(1000);
          },2000)
          return false;
        }
        $('.comment .message').html('');
        $('.comment .message').stop().show();
        var content_id = $('#contentId').val()
  //    console.log(content,content_id)
        $.ajax({
          type:"post",
          dataType:"json",
          url:"/addComment",
          data:{
            comment:content,
            contentId:content_id
          },
          success:function(data){
            if(data.status===1){
//            console.log('成功');
              commentData=data.responseData;          
              commentAdd()
              $('.comment .message').html('评论成功！').stop().hide();
              $('.comment .message').stop().show(1000)
              setTimeout(function(){
                $('.comment .message').stop().toggle(1000);
              },2000)
            }else{
              console.log('失败')
            }
          }
        })
      })
      //获取用户评论
      $.ajax({
          type:"post",
          dataType:"json",
          url:"/getComment",
          data:{         
            contentId:$('#contentId').val()
          },
          success:function(data){
            if(data.status===1){
  //          console.log('成功')
              commentData=data.responseData;
  //          console.log(data.responseData);              
              commentAdd();                   
            }else{
              console.log('失败')
            }
          }
      })
      //评论显示
      function commentAdd(){
        //markdown编辑器
        var mark=$('.item-desc').html();
        $('.item-desc').html(marked(mark));
        
        var html='';
        var comments=commentData.comment;  
        if(comments.length==0){
          minPage=0;
          currentPage=0;
        }
        var lis=page(comments.length,limit);        
        for(var i=lis.start;i<lis.end;i++){
          html+=
         `<li>
            <div class="clearfix">
                <a  href="javascript:" class="pull-left">${comments[i].username}</a><br/>
               <span>评论：</span><span class="coms">${comments[i].userComment}</span>
                <span class="pull-right">`+dateTime(comments[i].postDate)+`</span>
            </div>
          </li>`
        }      
        $('.comment .comment-list').html(html);
        if(currentPage<=1){
          $('.content-page li').eq(0).html('<a href="javascript:;">没有上一页</a>')
        }else{
          $('.content-page li').eq(0).html('<a href="javascript:;">上一页</a>')
        }
        if(currentPage>=totalPage){
          $('.content-page li').eq(1).html('<a href="javascript:;">没有下一页</a>')
        }else{
          $('.content-page li').eq(1).html(`<a href="javascript:;">下一页</a>`)
        }
        $('.cur-page').html(`<span>${currentPage}</span>/<span>${totalPage}</span>`)
        getFloorOrder();        
      }
    //日期 时间
    function dateTime(time){
      var date = new Date(time);
      var str ='';
      str = date.getFullYear()+'-' + dateCal((date.getMonth()+1)) + '月'+ dateCal(date.getDate()) +'日'+ ' ' + dateCal(date.getHours())+':'+dateCal(date.getMinutes())+':'+dateCal(date.getSeconds());
      return str;
      
      function dateCal(num){
       return num>10? num:'0'+num;
      }
    }
    //楼层序号
    getFloorOrder();
    function getFloorOrder(){
      var oLi = $('.comment-list li').length;
      for(var i = 0;i<oLi;i++){
        var html = $('.comment-list li').eq(i).html()
        $('.comment-list li').eq(i).html('#'+(i+1)+'楼 '+html);
      }
    }
    //点击上下页
    $('.content-page li').eq(0).click(function(){
      currentPage--;
      currentPage=Math.max(currentPage,minPage);      
      commentAdd()
    })
    $('.content-page li').eq(1).click(function(){
      currentPage++;
      currentPage=Math.min(currentPage,totalPage);      
      commentAdd()
    })
    //数据的始末,每页显示数量
    function page(commentLength){       
        totalPage = Math.ceil(commentLength/limit);
        var start = Math.max((currentPage-1) * limit,0);
        var end = Math.min(currentPage * limit,commentLength);
        pageData={
          start:start,
          end:end
        }
        return pageData;    
    }
    
    
})