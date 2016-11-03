window.onload=function(){
	/*添加cookie*/
	var cookie ={
		add_cookie : function (names,values){
			var path = '/';
			var name = escape(names);
			var value = escape(values);
			var expire = new Date();
			expire.setTime(expire.getTime()+30*3600000*24);
			//path=/，表示cookie能在整个网站下使用，path=/temp，表示cookie只能在temp目录下使用
			path = path ==""?"":";path="+path;
			var expires = (typeof days) == "string"?"":";expire="+expire.toUTCString();
			document.cookie = name +"="+value+expires+path;
		},
		get_cookie : function(name){
			var name = escape(name);
			var allcookie = document.cookie;
			name += "=";
			var pos = allcookie.indexOf(name);
			if(pos != -1){
				var start = pos + name.length;
				var end = allcookie.indexOf(";",start);
				if(end== -1)
					end = allcookie.length;
				var value = allcookie.substring(start,end);
				return value;
			}
			else{
				return "";
			}
		},
	};
	var modify_post={
		info_modify:function(session,username,password,newpassword,repassword){
			var strs = "https://api.xiyoumobile.com/xiyoulibv2/user/modifyPassword?session="+session+"&username="+username+"&password="+password+"&newpassword="+newpassword+"&repassword="+repassword;
			var urls = "http://jiayudong.cn/PHP/modify.php?sessions="+strs;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    jsonp:'callback',
			    async: true,  
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	if(Datas['Detail']=="SESSION_INVALID"){
			    		alert("您的登陆过期，请重新登录");
			    		window.location.href = "index.html";
			    		return;
			    	}
			    	if(Datas['Detail']=="MODIFY_SUCCEED"){
			    		alert("修改成功，请重新登录");
			    		window.location.href = "index.html";
			    	}
			    	else if(Datas['Detail']=="INVALID_PASSWORD"){
			    		alert("密码输入有误，请重新输入");
			    	}
			    	else if(Datas['Detail']=="UDIFFERENT_PASSWORD"){
			    		alert("新密码两次输入不一致");
			    	}
			    	else
			    		alert("修改失败");
			    }
			});
		}
	};
	(function(){
		document.getElementById('username').value = cookie.get_cookie('name');
		document.getElementById('confirm_btn').addEventListener("click",function(){
			var session = cookie.get_cookie('session');
			var username = document.getElementById('username').value;
			var password = document.getElementById('password').value;
			var newpassword = document.getElementById('newpassword').value;
			var repassword = document.getElementById('repassword').value;
			modify_post.info_modify(session,username,password,newpassword,repassword);
		});
		document.getElementById('info_cancellation').addEventListener("click",function(){
			window.location.href = "index.html";
		});
		document.getElementById('returns').addEventListener("click",function(){
			window.history.back(-1);
		});
	})();
}