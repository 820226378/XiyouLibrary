window.onload=function(){
	/*添加cookie*/
	var cookie ={
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
	var ui_info ={
		get_news:function(Data){
			document.getElementById('title').innerHTML = Data['Detail'].Title;
			var s = "src=\"/news";
			var str = Data['Detail'].Passage.replace(s,"src=\"http://lib.xupt.edu.cn/news");
			while(str.indexOf(s)!= -1){
				var str = str.replace(s,"src=\"http://lib.xupt.edu.cn/news");
			}
			document.getElementById('passage').innerHTML = str;
			document.getElementById('company').innerHTML ="发布单位："+ Data['Detail'].Publisher;
			document.getElementById('date').innerHTML ="发布日期："+ Data['Detail'].Date;
		},
		get_announce:function(Data){
			document.getElementById('title').innerHTML = Data['Detail'].Title;
			var s = "src=\"/news";
			var str = Data['Detail'].Passage.replace(s,"src=\"http://lib.xupt.edu.cn/news");
			while(str.indexOf(s)!= -1){
				var str = str.replace(s,"src=\"http://lib.xupt.edu.cn/news");
			}
			document.getElementById('passage').innerHTML = str;
			document.getElementById('company').innerHTML ="发布单位："+ Data['Detail'].Publisher;
			document.getElementById('date').innerHTML ="发布日期："+ Data['Detail'].Date;
		}
	};
	var get_info = {
		get_news:function(id){
			var strs = "https://api.xiyoumobile.com/xiyoulibv2/news/getDetail/news/html/"+id;
			var urls = "http://jiayudong.cn/PHP/news.php?callback=?&sesession="+strs;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    async: true,  
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	ui_info.get_news(Datas);
			    }
			});
		},
		get_announce:function(id){
			var strs = "https://api.xiyoumobile.com/xiyoulibv2/news/getDetail/announce/html/"+id;
			var urls = "http://jiayudong.cn/PHP/news.php?callback=?&sesession="+strs;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    async: true,  
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	ui_info.get_announce(Datas);
			    }
			});
		}
	};
	(function(){
		var id = cookie.get_cookie('news');
		var type = cookie.get_cookie('type');
		if(type == "%u65B0%u95FB"){
			document.getElementById('head_title').innerHTML = "新闻详情";
			get_info.get_news(id);
		}
		else{
			document.getElementById('head_title').innerHTML = "公告详情";
			get_info.get_announce(id);
		}
		document.getElementById('returns').addEventListener("click",function(){
			window.history.back(-1); 
		});
	})();
}