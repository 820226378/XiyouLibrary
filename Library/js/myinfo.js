window.onload = function(){
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
	var ui_get = {
		info_get:function(Data){
			document.getElementById('major').innerHTML = Data['Detail'].Department;
			if(Data['Detail'].ID.indexOf('S') == -1)
				document.getElementById('username').innerHTML = Data['Detail'].ID;
			else
				document.getElementById('username').innerHTML = Data['Detail'].ID.split("S")[1];
			document.getElementById('name').innerHTML = Data['Detail'].Name;
			document.getElementById('number').innerHTML = Data['Detail'].Debt+"元";
			document.getElementById('info').style.display = "block";
			document.getElementById('loaders').style.display = "none";
		}
	};
	var get_my = {
		get_infos:function(sessions){
			var strs = "https://api.xiyoumobile.com/xiyoulibv2/user/info?session="+sessions;
			var urls = "http://jiayudong.cn/PHP/rent.php?session="+strs;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    jsonp:'callback',
			    async: true,  
			    success: function(result) {
			    	console.log(result);
			    	var Datas = JSON.parse(result);
			    	if(Datas['Detail']=="SESSION_INVALID"){
			    		alert("您的登陆过期，请重新登录");
			    		window.location.href = "index.html";
			    		return;
			    	}
			    	ui_get.info_get(Datas);
			    }
			});
		}
	};
	(function(){
		var session = cookie.get_cookie('session');
		get_my.get_infos(session);
		document.getElementById('info_modify').addEventListener("click",function(){
			window.location.href = "modify.html";
		});
		document.getElementById('returns').addEventListener("click",function(){
			window.history.back(-1); 
		});
		document.getElementById('cancellation').addEventListener("click",function(){
			cookie.add_cookie('session',"");
			window.location.href = "index.html";
		});
	})();
}