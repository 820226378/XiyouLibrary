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
	var ui_rent ={
		info_rent:function(Data){
			if(Data['Detail'] == "NO_RECORD"){
				document.getElementById('loaders').style.display ="none";
				document.getElementById('book_info').style.display = "block";
				return;
			}
			var i=j=0;
			var trs = document.getElementById("book_info");
			while(trs.hasChildNodes()){
				trs.removeChild(trs.firstChild);
			}
			for(var n=0;n<Data['Detail'].length;n++){
				var div1 = document.createElement("div");
				div1.className = "info_book";
				var div2 = document.createElement("div");
				div2.className ="body_book";
				var img1 = document.createElement("img");
				img1.src = "img/book.png";
				var p1 = document.createElement("p");
				p1.className = "book_name";
				var p2 = document.createElement("p");
				var p3 = document.createElement("p");
				p1.setAttribute('data-barcode',Data['Detail'][n].Barcode);
				p1.addEventListener("click",function(e){
					cookie.add_cookie('barcode',e.target.getAttribute('data-barcode'));
					window.location.href = "detail.html";
				});
				var span1 = document.createElement("span");
				span1.className = "book_date";
				p1.innerHTML = "《"+Data['Detail'][n].Title+"》";
				p2.innerHTML = "到期时间：";
				span1.innerHTML = Data['Detail'][n].Date;
				if(Data['Detail'][n].State=="本馆借出"){
					p3.innerHTML = "续借图书";
					p3.setAttribute("data-lib",Data['Detail'][n].Library_id);
					p3.setAttribute("data-depar",Data['Detail'][n].Department_id);
					p3.setAttribute('data-barcode',Data['Detail'][n].Barcode);
					p3.addEventListener("click",function(e){
						var session = cookie.get_cookie('session');
						get_rent.renew_book(session,e.target.getAttribute('data-barcode'),e.target.getAttribute('data-depar'),e.target.getAttribute('data-lib'));
					});
					p3.id = "book_btn";
				}
				else if(Data['Detail'][n].State=="本馆续借"){
					p3.innerHTML = "本馆续借";
					p3.id = "book_renew";
					i++;
				}
				else{
					p3.innerHTML = "已超期";
					span1.className = "books_date";
					p3.id = "book_overdue";
					j++;
				}
				p2.appendChild(span1);
				div2.appendChild(img1);
				div2.appendChild(p1);
				div2.appendChild(p2);
				div2.appendChild(p3);
				div1.appendChild(div2);
				trs.appendChild(div1);
			}
			document.getElementById('span_1').innerHTML = Data['Detail'].length;
			document.getElementById('span_2').innerHTML =15- Data['Detail'].length;
			document.getElementById('span_3').innerHTML = i;
			document.getElementById('span_4').innerHTML = j;
			document.getElementById('loaders').style.display ="none";
			document.getElementById('book_info').style.display = "block";
		},
		info_favorite:function(Data){
			if(Data['Detail'] != "NO_RECORD"){
				var trs = document.getElementById('book_coll');
				while(trs.hasChildNodes()){
					trs.removeChild(trs.firstChild);
				}
				for(var i=0;i<Data['Detail'].length;i++){
					var div1 = document.createElement("div");
					div1.className ="info_book";
					var div2 = document.createElement("div");
					div2.className ="body_book";
					var div3 = document.createElement("p");
					div3.className ="book_btn2";
					div3.innerHTML ="取消收藏";
					div3.setAttribute('data-id',Data['Detail'][i].ID);
					div3.addEventListener("click",function(e){
						var strs = "https://api.xiyoumobile.com/xiyoulibv2/user/delFav?session="+cookie.get_cookie('session')+"&id="+e.target.getAttribute('data-id')+"&username="+cookie.get_cookie('name');
						var urls = "http://jiayudong.cn/PHP/delete.php?session="+strs;
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
						    	if(Datas['Detail'] == "DELETED_SUCCEED"){
						    		alert("删除成功");
						    		window.history.go(0);
						    	}
						    	else if(Datas['Detail'] == "DELETED_FAILED"){
						    		alert("删除失败");
						    	}
						    	else if(Datas['Detail'] == "USER_NOT_LOGIN"){
						    		alert("请重新登录");
						    	}
						    }
						});
					});
					var imgs = document.createElement("img");
					imgs.id = "img_1";
					if(Data['Detail'][i].Images)
						imgs.src = Data['Detail'][i].Images.large;
					else
						imgs.src = "img/book.png";
					var p1 = document.createElement("p");
					p1.className = "book_name";
					p1.setAttribute('data-id',Data['Detail'][i].Barcode);
					p1.addEventListener("click",function(e){
						cookie.add_cookie('barcode',e.target.getAttribute('data-id'));
						window.location.href = "detail.html";
					});
					var p2 = document.createElement("p");
					var p3 = document.createElement("p");
					var span1 = document.createElement("span");
					span1.className="book_date";
					p1.innerHTML ="《"+ Data['Detail'][i].Title+"》";
					p2.innerHTML = "图书索引号：";
					span1.innerHTML = Data['Detail'][i].Sort;
					p3.innerHTML = "作者："+Data['Detail'][i].Author;
					p2.appendChild(span1);
					div2.appendChild(imgs);
					div2.appendChild(p1);
					div2.appendChild(p2);
					div2.appendChild(p3);
					div2.appendChild(div3);
					div1.appendChild(div2);
					trs.appendChild(div1);
				}
			}
		},
		info_history:function(Data){
			if(Data['Detail'] != "NO_RECORD"){
				var trs = document.getElementById('history_sum');
				while(trs.hasChildNodes()){
					trs.removeChild(trs.firstChild);
				}
				for(var i=0;i<Data['Detail'].length;i++){
					var div1 = document.createElement("div");
					div1.className ="info_book";
					var div2 = document.createElement("div");
					div2.className ="body_book";
					var p1 = document.createElement("p");
					p1.className = "book_name";
					var p2 = document.createElement("p");
					var p3 = document.createElement("p");
					var span1 = document.createElement("span");
					span1.className="book_date";
					p1.innerHTML ="《"+ Data['Detail'][i].Title+"》";
					p1.setAttribute('data-id',Data['Detail'][i].Barcode);
					p1.addEventListener("click",function(e){
						cookie.add_cookie('barcode',e.target.getAttribute('data-id'));
						window.location.href = "detail.html";
					});
					p2.innerHTML = "操作时间：";
					span1.innerHTML = Data['Detail'][i].Date;
					p3.innerHTML = "操作类型："+Data['Detail'][i].Type;
					p2.appendChild(span1);
					div2.appendChild(p1);
					div2.appendChild(p2);
					div2.appendChild(p3);
					div1.appendChild(div2);
					trs.appendChild(div1);
				}
			}
		}
	};
	var get_rent = {
		info_rent:function(session){
			var strs = "https://api.xiyoumobile.com/xiyoulibv2/user/rent?session="+session;
			var urls = "http://jiayudong.cn/PHP/rent.php?session="+strs;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    jsonp:'callback',
			    async: false,  
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	if(Datas['Detail']=="SESSION_INVALID"){
			    		alert("您的登陆过期，请重新登录");
			    		window.location.href = "index.html";
			    		return;
			    	}
			    	ui_rent.info_rent(Datas);
			    }
			});
		},
		info_favorite:function(session){
			var strs = "https://api.xiyoumobile.com/xiyoulibv2/user/favoriteWithImg?session="+session;
			var urls = "http://jiayudong.cn/PHP/rent.php?session="+strs;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    jsonp:'callback',
			    async: false,  
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	if(Datas['Detail']=="SESSION_INVALID"){
			    		alert("您的登陆过期，请重新登录");
			    		window.location.href = "index.html";
			    		return;
			    	}
			    	ui_rent.info_favorite(Datas);
			    }
			});
		},
		info_history:function(session){
			var strs = "https://api.xiyoumobile.com/xiyoulibv2/user/history?session="+session;
			var urls = "http://jiayudong.cn/PHP/rent.php?callback=?&session="+strs;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    async: false,  
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	ui_rent.info_history(Datas);
			    }
			})
		},
		renew_book:function(session,barcode,department_id,library_id){
			
			var strs = "https://api.xiyoumobile.com/xiyoulibv2/user/renew?session="+session+"&barcode="+barcode+"&department_id="+department_id+"&library_id="+library_id;
			var urls = "http://jiayudong.cn/PHP/renew.php?callback=?&session="+strs;
			$.ajax({  
			    type: 'GET',  //这里用GET  
			    url: urls,  
			    data: {},
			    dataType: 'jsonp',  //类型   
			    async: true,  
			    success: function(result) {
			    	var Datas = JSON.parse(result);
			    	console.log(Datas);
			    	if(Datas['Detail']=='RENEW_FAILED'){
			    		alert("续借失败");
			    	}
			    	else if(Datas['Result']== true){
			    		alert("续借成功");
			    		document.getElementById("book_btn").innerHTML="本馆续借";
			    		document.getElementById("book_btn").id="book_renew";
			    	}
			    }
			});
		}
	};
	(function(){
		var session = cookie.get_cookie('session');
		get_rent.info_rent(session);
		get_rent.info_favorite(session);
		get_rent.info_history(session);
		document.getElementById('foot').addEventListener("click",function(e){
			if(e.target.nodeName == "SPAN"){
				var borrow = document.getElementById('borrow');
				var collection = document.getElementById('collection');
				var history = document.getElementById('history');
				var body_ui = document.getElementById('body_ui');
				var collection_book = document.getElementById('collection_book');
				var history_book = document.getElementById('history_book');
				if(e.target.innerHTML == "已借图书"){
					if(borrow.style.background == "#3388cc")
						return;
					borrow.style.background= "#3388cc";
					borrow.style.color = "#fff";
					collection.style.background = "#f6f6f6";
					collection.style.color = "#333";
					history.style.background = "#f6f6f6";
					history.style.color = "#333";
					body_ui.style.display = "block";
					collection_book.style.display = "none";
					history_book.style.display ="none";
				}
				else if(e.target.innerHTML == "我的收藏"){
					if(collection.style.background == "#3388cc")
						return;
					borrow.style.background= "#f6f6f6";
					borrow.style.color = "#333";
					collection.style.background = "#3388cc";
					collection.style.color = "#fff";
					history.style.background = "#f6f6f6";
					history.style.color = "#333";
					body_ui.style.display = "none";
					collection_book.style.display = "block";
					history_book.style.display ="none";
				}
				else{
					if(history.style.background == "#3388cc")
						return;
					borrow.style.background= "#f6f6f6";
					borrow.style.color = "#333";
					collection.style.background = "#f6f6f6";
					collection.style.color = "#333";
					history.style.background = "#3388cc";
					history.style.color = "#fff";
					body_ui.style.display = "none";
					collection_book.style.display = "none";
					history_book.style.display ="block";
				}
			}
		});
		document.getElementById('search_ui').addEventListener("click",function(){
			window.location.href = "search.html";
		});
		document.getElementById('my_info').addEventListener("click",function(){
			window.location.href = "myinfo.html";
		});
	})();
}