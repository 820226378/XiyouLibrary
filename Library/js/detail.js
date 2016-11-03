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
	var get_ui ={
		info_detail:function(Data){
			if(Data['Detail']['DoubanInfo']){
				var img = document.getElementById("img_1");
				img.src = Data['Detail']['DoubanInfo']['Images'].large;
				if(Data['Detail']['DoubanInfo'].Pages){
					document.getElementById('forms').innerHTML="页数："+Data['Detail']['DoubanInfo'].Pages;
				}
				document.getElementById('price').innerHTML="价格："+Data['Detail']['DoubanInfo'].Price;
				document.getElementById('pubdata').innerHTML="出版日期："+Data['Detail']['DoubanInfo'].PubDate;
				if(Data['Detail']['DoubanInfo'].Binding)
					document.getElementById('binding').innerHTML="装订："+Data['Detail']['DoubanInfo'].Binding;
			}
			document.getElementById('name_bok').innerHTML="《"+Data['Detail'].Title+"》";
			document.getElementById('sort').innerHTML = "图书馆索引号："+Data['Detail'].Sort;
			document.getElementById('author').innerHTML = "作者："+Data['Detail'].Author;
			document.getElementById('pub').innerHTML = "出版社："+Data['Detail'].Pub;
			document.getElementById('isbn').innerHTML="标准号："+Data['Detail'].ISBN;

		},
		book_circulation:function(Data){
			var i = 0;
			document.getElementById('sum_num').innerHTML =  Data['Detail']['CirculationInfo'].length;
			for(var j = 0;j<Data['Detail']['CirculationInfo'].length;j++){
				var strs = document.getElementById('info_st');
				var div1 = document.createElement('div');
				var p1 = document.createElement('p');
				var p2 = document.createElement('p');
				var p3 = document.createElement('p');
				div1.className = "info_state";
				p1.innerHTML ="条码："+ Data['Detail']['CirculationInfo'][j].Barcode;
				p2.innerHTML ="状态："+ Data['Detail']['CirculationInfo'][j].Status;
				p3.innerHTML ="书库："+ Data['Detail']['CirculationInfo'][j].Department;
				div1.appendChild(p1);
				div1.appendChild(p2);
				div1.appendChild(p3);
				if(Data['Detail']['CirculationInfo'][j].Status == "在架可借"){
					i++;
					div1.style.color = "green";
					strs.appendChild(div1);
				}
				else{				
					var p4 = document.createElement('p');
					div1.style.color = "#E5A85E";
					p4.innerHTML ="应还图书："+ Data['Detail']['CirculationInfo'][j].Date;
					div1.appendChild(p4);
					strs.appendChild(div1);
				}
			}
			document.getElementById('one_num').innerHTML = i;
		},
		get_introduction:function(Data){
			if(Data['Detail'].Summary){
				document.getElementById('content_info').innerHTML ="本书简介："+Data['Detail'].Summary;
			}
		},
		get_relevant:function(Data){
			if(Data['Detail']['ReferBooks']){
				var trs = document.getElementById('body_relevant');
				while(trs.hasChildNodes()){
					trs.removeChild(trs.firstChild);
				}
				for(var i =0;i<Data['Detail']['ReferBooks'].length;i++){
					var divs = document.createElement("div");
					var div = document.createElement("div");
					divs.className = "blue_body";
					div.className = "white_body";
					var p = document.createElement("p");
					var p1 = document.createElement("p");
					var p2 = document.createElement("p");
					p.className="relevant_name";
					p.innerHTML = "《"+Data['Detail']['ReferBooks'][i].Title+"》";
					p1.innerHTML = Data['Detail']['ReferBooks'][i].Author;
					p2.innerHTML = Data['Detail']['ReferBooks'][i].ID;
					p.setAttribute('data-id',Data['Detail']['ReferBooks'][i].ID);
					p.addEventListener("click",function(e){
						cookie.add_cookie('id',e.target.getAttribute('data-id'));
						window.location.reload();
					});
					div.appendChild(p);
					div.appendChild(p1);
					div.appendChild(p2);
					divs.appendChild(div);
					trs.appendChild(divs);
				}
			}
		}

	};
	var detail_info ={
		book_detail:function(id){
			var strs =  "https://api.xiyoumobile.com/xiyoulibv2/book/detail/id/"+id;
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
			    	console.log(Datas);
			    	cookie.add_cookie('book',Datas['Detail'].ID);
			    	document.getElementById("loaders").style.display="none";
			    	document.getElementById('book_body').style.display="block";
			    	get_ui.book_circulation(Datas);
			    	get_ui.info_detail(Datas);
			    	get_ui.get_introduction(Datas);
			    	get_ui.get_relevant(Datas);
			    }
			});
		},
		book_barcode:function(barcode){
			var strs =  "https://api.xiyoumobile.com/xiyoulibv2/book/detail/barcode/"+barcode;
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
			    	console.log(Datas);
			    	cookie.add_cookie('book',Datas['Detail'].ID);
			    	get_ui.book_circulation(Datas);
			    	get_ui.info_detail(Datas);
			    	get_ui.get_introduction(Datas);
			    	get_ui.get_relevant(Datas);
			    	document.getElementById('loaders').style.display="none";
			    	document.getElementById('book_body').style.display="block";
			    }
			})
		},
		book_collection:function(session,bookid){
			var strs =  "https://api.xiyoumobile.com/xiyoulibv2/user/addFav?session="+session+"&id="+bookid;
			var urls = "http://jiayudong.cn/PHP/addcallction.php?session="+strs;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    async: true,  
			    jsonp:'callback',
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	if(Datas['Detail'] == "ADDED_SUCCEED"){
			    		alert("收藏成功");
			    	}
			    	else if(Datas['Detail'] == "ALREADY_IN_FAVORITE"){
			    		alert("您已经收藏过了");
			    	}
			    	else if(Datas['Detail'] == "USER_NOT_LOGIN"){
			    		alert("请您登录");
			    		window.location.href = "index.html";
			    	}
			    	else if(Datas['Detail'] == "ADDED_FAILED"){
			    		alert("收藏失败");
			    	}
			    	else
			    		alert("系统错误");
			    }
			})
		}
	};
	(function(){
		var id = cookie.get_cookie('id');
		var barcode = cookie.get_cookie('barcode');
		cookie.add_cookie("id","");
		cookie.add_cookie("barcode","");
		if(id){
			detail_info.book_detail(id);
		}
		else if(barcode){
			detail_info.book_barcode(barcode);
		}
		document.getElementById('one_book').addEventListener("click",function(){
			document.getElementById('one_book').style.background = "#fff";
			document.getElementById('circulation').style.background = "#f0f0f0";
			document.getElementById('books').style.display = "block";
			document.getElementById('book_num').style.display = "none";

		});
		document.getElementById('circulation').addEventListener("click",function(){
			document.getElementById('circulation').style.background = "#fff";
			document.getElementById('one_book').style.background = "#f0f0f0";
			document.getElementById('book_num').style.display = "block";
			document.getElementById('books').style.display = "none";
		});
		document.getElementById('foots_detail').addEventListener("click",function(e){
			if(e.target.nodeName == "SPAN"){
				if(e.target.innerHTML == "基本资料"){
					document.getElementById("book_body").style.display ="block";
					document.getElementById("one_info").style.color = "#fff";
					document.getElementById("one_info").style.background = "#3388cc";
					document.getElementById("abstract").style.display ="none";
					document.getElementById("two_info").style.color = "#333";
					document.getElementById("three_info").style.color = "#333";
					document.getElementById("relevant").style.display ="none";
					document.getElementById("two_info").style.background = "#f6f6f6";
					document.getElementById("three_info").style.background = "#f6f6f6";
				}
				else if(e.target.innerHTML == "摘要"){
					document.getElementById("book_body").style.display ="none";
					document.getElementById("two_info").style.color = "#fff";
					document.getElementById("abstract").style.display ="block";
					document.getElementById("one_info").style.color = "#333";
					document.getElementById("three_info").style.color = "#333";
					document.getElementById("relevant").style.display ="none";
					document.getElementById("one_info").style.background = "#f6f6f6";
					document.getElementById("two_info").style.background = "#3388cc";
					document.getElementById("three_info").style.background = "#f6f6f6";
				}
				else{
					document.getElementById("book_body").style.display ="none";
					document.getElementById("three_info").style.color = "#fff";
					document.getElementById("abstract").style.display ="none";
					document.getElementById("one_info").style.color = "#333";
					document.getElementById("two_info").style.color = "#333";
					document.getElementById("relevant").style.display ="block";
					document.getElementById("one_info").style.background = "#f6f6f6";
					document.getElementById("two_info").style.background = "#f6f6f6";
					document.getElementById("three_info").style.background = "#3388cc";
				}
			}
		});
		document.getElementById('returns').addEventListener("click",function(){
			window.history.back(-1); 
		});
		document.getElementById('collection').addEventListener("click",function(){
			var ids = cookie.get_cookie('book');
			var session = cookie.get_cookie('session');
			if(session){
				detail_info.book_collection(session,ids);
			}
			else{
				alert("请您先登录");
				window.location.href="index.html";
			}
		});
	})();
}