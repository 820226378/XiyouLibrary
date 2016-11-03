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
		var search = document.getElementById('btn_search');
		search.addEventListener("click",function(){
			book_name.get_info(document.getElementById("ipt_name").value);
			search.style.borderColor = "#3388cc";
			setTimeout(function(){
				search.style.borderColor = "#ddd";
			},200);
		});
		document.getElementById("ui_top").addEventListener("click",function(){
			ui_result.get_top();
			document.getElementById("ui_top").style.color= "red";
			setTimeout(function(){
				document.getElementById("ui_top").style.color = "#3388cc";
			},200);
		});
		document.getElementById("ui_down").addEventListener("click",function(){
			ui_result.get_down();
			document.getElementById("ui_down").style.color = "red";
			setTimeout(function(){
				document.getElementById("ui_down").style.color = "#3388cc";
			},200);
		});
		document.getElementById("foot_body").addEventListener("click",function(e){
			if(e.target && e.target.className == "foot_clear")
				ui_result.get_clear();
			else if(e.target && e.target.className == "foot_top")
				ui_result.get_top();
			else if(e.target && e.target.className == "foot_down")
				ui_result.get_down();
			else
				return;
			e.target.style.color = "red";
			setTimeout(function(){
				e.target.style.color = "#3388cc";
			},200);

		});
		document.getElementById("ui_last").addEventListener("click",function(){
			ui_result.get_last();
			document.getElementById("ui_last").style.color = "red";
			setTimeout(function(){
				document.getElementById("ui_last").style.color = "#3388cc";
			},200);
		});
		document.getElementById("ui_next").addEventListener("click",function(){
			ui_result.get_next();
			document.getElementById("ui_next").style.color = "red";
			setTimeout(function(){
				document.getElementById("ui_next").style.color = "#3388cc";
			},200);
		});
		document.getElementById("news").addEventListener("click",function(){
			click_add.add_news();
		});
		document.getElementById("announce").addEventListener("click",function(){
			click_add.add_announce();
		});
		document.getElementById("rank_click").addEventListener("click",function(e){
			if(e.target){
				var id = "add_"+e.target.dataset.id;
				var id_1 = "ran_"+e.target.dataset.id;
				if(document.getElementById(id_1)){
					if(document.getElementById(id_1).style.display == "block"){
						document.getElementById(id).innerHTML ="+";
						document.getElementById(id_1).style.display = "none";
						document.getElementById(id).style.fontSize = "1.7em";
						document.getElementById(id).style.top = "-0.04em";
						return;
					}
					else{
						document.getElementById(id).innerHTML ="一";
						document.getElementById(id_1).style.display = "block";
						document.getElementById(id).style.fontSize = "1em";
						document.getElementById(id).style.top = "0.1em";
					}
				}
			}
		});
		document.getElementById('returns').addEventListener('click',function(){
			window.history.back(-1); 
		});
		document.getElementById('head_navigation').addEventListener('click',function(e){
			var childs = document.getElementById('head_navigation');
			for(var i=1;i<6;i=i+2){
				childs.childNodes[i].style.background="#F6F6F6";
				childs.childNodes[i].childNodes[0].style.color = "#333";
			}
			if(e.target.nodeName == "SPAN"){
				e.target.parentNode.style.background="#3388cc";
				e.target.style.color = "#fff";
			}
			else{
				e.target.style.background="#3388cc";
				e.target.childNodes[0].style.color = "#fff";
			}
			if(e.target.childNodes[0].innerHTML == "图书搜索" || e.target.innerHTML == "图书搜索"){
				document.getElementById('search_book').style.display = "block";
			}
			else
				document.getElementById('search_book').style.display = "none";
			if(e.target.childNodes[0].innerHTML == "新闻公告" || e.target.innerHTML == "新闻公告"){
				document.getElementById('body_new').style.display = "block";
			}
			else
				document.getElementById('body_new').style.display = "none";
			if(e.target.childNodes[0].innerHTML == "关于我们" || e.target.innerHTML == "关于我们"){
				document.getElementById('about').style.display = "block";
			}
			else
				document.getElementById('about').style.display = "none";
		});
	})();
	//获取搜索书籍信息
	var borrow;
	var retrieval;
	var Collection;
	var see;
	var num_new=1;
	var num_announce=1;
	var name="";
	var Data_ui;
	var click_add ={
		add_news:function(){
			num_new++;
			book_name.get_new(num_new);
		},
		add_announce:function(){
			num_announce++;
			book_name.get_announce(num_announce);
		}
	};
	var book_name = {
		get_info:function(str){
			name=str;
			var strs =  "https://api.xiyoumobile.com/xiyoulibv2/book/search?keyword=";
			var urls = "http://jiayudong.cn/PHP/search.php?callback=?&input="+str+"&sesession="+strs+"&num="+1;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    async: true,  
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	if(Datas['Detail'] == "NO_RECORD"){
			    		alert("无书籍信息");
			    		return;
			    	}
			    	Data_ui = Datas;
			    	ui_result.get_ui(Datas);
			    }
			})
		},
		info_new:function(i){
			var strs =  "https://api.xiyoumobile.com/xiyoulibv2/book/search?keyword=";
			var urls = "http://jiayudong.cn/PHP/search.php?input="+name+"&sesession="+strs+"&num="+i;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    async: true,  
			    jsonp:'callback',
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	Data_ui=Datas;
			    	if(Datas['Detail'] == "NO_RECORD")
			    	{
			    		alert("无书籍信息");
			    		return;
			    	}
			    	ui_result.get_ui(Datas);
			    }
			})
		},
		rank_book:function(type){
			var strs =  "https://api.xiyoumobile.com/xiyoulibv2/book/rank?";
			var urls = "http://jiayudong.cn/PHP/rank.php?sesession="+strs+"&type="+type;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    async: false,  
			    jsonp:'callback',
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	ui_result.get_rank(Datas,type);
			    	document.getElementById('loaders').style.display = "none";
			    }
			})
		},
		get_new:function(i){
			var strs =  "https://api.xiyoumobile.com/xiyoulibv2/news/getList/news/"+i;
			var urls = "http://jiayudong.cn/PHP/news.php?sesession="+strs;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    async: true,  
			    jsonp:'callback',
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	if(Datas['Detail'].pages < i){
			    		alert("已无更多消息");
			    		return;
			    	}
			    	ui_result.get_news(Datas);
			    }
			})
		},
		get_announce:function(i){
			var strs =  "https://api.xiyoumobile.com/xiyoulibv2/news/getList/announce/"+i;
			var urls = "http://jiayudong.cn/PHP/news.php?sesession="+strs;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    async: true,  
			    jsonp:'callback',
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	if(Datas['Detail'].pages < i){
			    		alert("已无更多消息");
			    		return;
			    	}
			    	ui_result.get_announce(Datas);
			    }
			})
		},
	};

	var get_id = {
		get_left:function(){
			return document.getElementById('head_left');
		}
	};
	var ui_result = {
		get_ui:function(Data){
			var str = "第"+Data['Detail'].CurrentPage+"页/共"+Data['Detail'].Pages+"页";
			get_id.get_left().innerHTML = str;
			var trs = document.getElementById("ui_book");
			while(trs.hasChildNodes()){
				trs.removeChild(trs.firstChild);
			}
			for(var i=0;i<Data['Detail']['BookData'].length;i++){
				var divs = document.createElement("div");
				var div = document.createElement("div");
				divs.className = "info_book";
				div.className = "body_book";
				var p = document.createElement("p");
				p.id="name_book";
				p.innerHTML = "《"+Data['Detail']['BookData'][i].Title+"》";
				p.setAttribute('data-id',Data['Detail']['BookData'][i].ID);
				p.addEventListener("click",function(e){
					get_name.get_detailed(e.target.getAttribute('data-id'));
				});
				div.appendChild(p);
				divs.appendChild(div);
				trs.appendChild(divs);
			}
			trs.style.display = "block";
			document.getElementById('rank_clicks').style.display="none";
			document.getElementById('search_null').style.display="none";
			document.getElementById('head_right').style.display = "block";
			document.getElementById('foot_body').style.display = "block";
			get_id.get_left().style.display="block";
			var scrollT=parseInt(document.body.scrollTop)||parseInt(document.documentElement.scrollTop)||parseInt(window.pageYOffset);  
			document.body.scrollTop = 0;
		},
		get_top:function(){
			if(Data_ui['Detail'].CurrentPage>1){
				var i = Data_ui['Detail'].CurrentPage-1;
				book_name.info_new(i);
			}
			else
				return;
		},
		get_down:function(){
			if(Data_ui['Detail'].CurrentPage<Data_ui['Detail'].Pages){
				var i = Data_ui['Detail'].CurrentPage+1;
				book_name.info_new(i);
			}
			else
				return;
		},
		get_last:function(){
			book_name.info_new(1);
		},
		get_next:function(){
			book_name.info_new(Data_ui['Detail'].Pages);
		},
		get_clear:function(){
			document.getElementById('head_right').style.display = "none";
			document.getElementById('foot_body').style.display = "none";
			get_id.get_left().style.display="none";
			document.getElementById('ui_book').style.display="none";
			document.getElementById('search_null').style.display="block";
			document.getElementById('rank_clicks').style.display="block";
			var scrollT=parseInt(document.body.scrollTop)||parseInt(document.documentElement.scrollTop)||parseInt(window.pageYOffset);  
			document.body.scrollTop = 0;
		},
		get_rank:function(Data,type){
			var ids = "ran_"+type;
			var trs = document.getElementById(ids);
			for(var i=0;i<Data['Detail'].length;i++){
				var divs = document.createElement("div");
				var div = document.createElement("div");
				divs.className = "info_book";
				div.className = "body_book";
				var p = document.createElement("p");
				p.innerHTML = "《"+Data['Detail'][i].Title+"》";
				p.setAttribute('data-id',Data['Detail'][i].ID);
				p.addEventListener("click",function(e){
					if(e.target.getAttribute('data-id')!="undefined")
						get_name.get_detailed(e.target.getAttribute('data-id'));
					else
						alert("无此书信息");
				});
				div.appendChild(p);
				divs.appendChild(div);
				trs.appendChild(divs);
			}
		},
		get_news:function(Data){
			var trs = document.getElementById('add_new');
			for(var i=0;i<Data['Detail']['Data'].length;i++){
				var li = document.createElement("li");
				var p = document.createElement("p");
				var div = document.createElement("div");
				div.className = "clire";
				p.innerHTML =Data['Detail']['Data'][i].Title;
				p.setAttribute('data-id',Data['Detail']['Data'][i].ID);
				p.setAttribute('data-type',Data['Detail'].Type);
				p.addEventListener("click",function(e){
					get_name.get_news(e.target.getAttribute('data-id'),e.target.getAttribute('data-type'));
				});
				li.appendChild(div);
				li.appendChild(p);
				trs.appendChild(li);
			}
		},
		get_announce:function(Data){
			var trs = document.getElementById('add_announce');
			for(var i=0;i<Data['Detail']['Data'].length;i++){
				var li = document.createElement("li");
				var p = document.createElement("p");
				var div = document.createElement("div");
				div.className = "clire";
				p.innerHTML =Data['Detail']['Data'][i].Title;
				p.setAttribute('data-id',Data['Detail']['Data'][i].ID);
				p.setAttribute('data-type',Data['Detail'].Type);
				p.addEventListener("click",function(e){
					get_name.get_news(e.target.getAttribute('data-id'),e.target.getAttribute('data-type'));
				});
				li.appendChild(div);
				li.appendChild(p);
				trs.appendChild(li);
			}
		}
	};
	var get_name ={
		get_detailed :function(id){
			cookie.add_cookie('id',id);
			window.location.href = "detail.html";
		},
		get_news:function(id,type){
			cookie.add_cookie('news',id);
			cookie.add_cookie('type',type);
			window.location.href="newdetails.html";
		}
	};
	//获取排行信息
	(function(){
		book_name.rank_book(1); 
		book_name.rank_book(2);
		book_name.rank_book(3);
		book_name.rank_book(5);	
		book_name.get_new(1);
		book_name.get_announce(1);
	})();
}