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
		}
	};
	(function(){
		var userNameValue = cookie.get_cookie("name");  
	    document.getElementById("username").value = userNameValue;  
	    var userPassValue = cookie.get_cookie("pass");  
	    document.getElementById("password").value = userPassValue;  
		document.getElementById('cirle').style.background='#fff';
		document.getElementById('username').focus(); // 设置焦点
		var remember = document.getElementById('remember'); // 获取记住密码对象
		remember.addEventListener("click",function(){     // 绑定事件
			backgrounds();
		});
		var login = document.getElementById('land');
		login.addEventListener("click",function(){
			logo();
		});
		document.getElementById('search').addEventListener("click",function(){
			window.location.href = "search.html";
		});
	})();
	/* 记住密码按钮 */
	var backgrounds = function(){
		if(document.getElementById('cirle').style.background == 'rgb(255, 255, 255)'){
			document.getElementById('cirle').style.background='#3388CC';
		}
		else
			document.getElementById('cirle').style.background='#fff';
	};
	/*登录验证*/
	function logo(){
		var reg = /^[0-9a-zA-Z]{1,20}/;
		var username = document.getElementById("username");
		var password = document.getElementById("password");
		if(reg.test(username.value))
		{
			var urls = 'http://jiayudong.cn/PHP/jsonp.php?name='+username.value+'&pass='+password.value+'&callback=?';
			var Data;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls, 
			    data: {}, 
			    dataType: 'jsonp',  //类型  
			    async: true,  
			    success: function(result) {
			    	Data=JSON.parse(result);
			    	if(Data["Result"])
			    	{
			    		if(document.getElementById('cirle').style.background == 'rgb(255, 255, 255)'){
			    			cookie.add_cookie("name",username.value);
			    			cookie.add_cookie("pass",password.value);
			    			cookie.add_cookie("session",Data["Detail"])
			    		}
			    		window.location.href="main.html";
			    	}
			    	else
			    		alert("输入有误");

			    },
			    error: function(){
			    	alert('输入有误');
			    }
			})
		}
		else{
			alert("输入有误请重新输入");
			username.value="";
			password.value = "";
		}
	
	}
	

}