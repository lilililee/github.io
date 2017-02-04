//为window.onload添加事件的函数，可实现共享onload事件,写成函数便于以后扩展
function addOnloadEvent(func){
	var old_onload = window.onload;
	if(window.onload == null){    //window.onload未绑定事件时为Object,返回值为了null
		window.onload = func;     //只需赋值函数名
	}else{
		window.onload = function(){
			old_onload();
			func();
		}
	}
}

//在已有元素后插入一个元素
function insertAfter(new_element,target_element){
	var parent = target_element.parentNode;
	if(parent.lastChild == target_element){
		parent.appendChild(new_element);
	}else{
		parent.insertBefore(new_element,target_element.nextSibling);
	}
}

//移动一个节点
function MoveElement(id,final_x,final_y,interval){     //元素id，位置x，位置y，总共耗时
	//浏览器检测
	if(!document.getElementById) return false;
	
	//获取元素位置
	var node = document.getElementById(id);

	//获取初始位置，如果没有设置left和top，默认为0
	if(!node) return false;
	if(!node.style.left){
		node.style.left = 0;
	}
	if(!node.style.top){
		node.style.top = 0;
	}
	var pos_x = parseFloat(node.style.left);
	var pos_y = parseFloat(node.style.top);
	
	if(pos_x==final_x && pos_y==final_y){
		return true;
	}

	//每次移动距离
	var distance_x = (final_x - pos_x)/50;   
	var distance_y = (final_y - pos_y)/50;
	
	//连续调用该函数时清除上次为执行完的事件	
	if(node.interval_key){
		clearInterval(node.interval_key);   //如果前面存在为执行完的移动元素事件，先清空
		node.interval_key = null;
	}
	var move_count = 0;
	node.interval_key = setInterval(moveElementOnce,interval/50);

	//移动一次节点，总共50次来实现动画
	function moveElementOnce(){
		if(move_count >= 50){        //最后一次移动到最终位置，解决小数的差异
			node.style.left = final_x+'px';
			node.style.top = final_y+'px';
			clearInterval(node.interval_key);
			node.interval_key = null;
			return true;
		}
		move_count++;
		pos_x += distance_x;
		pos_y += distance_y;
		node.style.left = pos_x+'px';
		node.style.top = pos_y+'px';
	}

}

//跨浏览器添加事件
function addEvent(obj,type,fn){
	if(obj.addEventListener){
		obj.addEventListener(type,fn,false);
	}else if(obj.attachEvent){
		obj.attachEvent('on'+type,fn);
	}else{
		obj['on'+type] = fn;
	}
}

//跨浏览器移除事件
function removeEvent(obj,type,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(type,fn,false);
	}else if(obj.detachEvent){
		obj.detachEvent('on'+type,fn);
	}else{
		obj['on'+type] = null;
	}
}

//跨浏览器获取目标对象
function getTarget(event){
	var e = event || window.event;
	if(e.target){
		return e.target;
	}else if(e.srcElement){
		return e.srcElement;
	}else{
		alert('worry');
	}
}

//跨浏览器获取事件
function getEvent(event){
	return event || window.event;
}

//跨浏览器阻止默认行为
function stopDefault(event){
	var e = event || window.event;
	if(e.preventDefault){
		e.preventDefault();
	}else{
		e.returnValue = false;
	}
}

//阻止冒泡
function stopBubbling(event){
	var e = event || window.event;
	window.event? e.cancelBubble = true : e.stopPropagation();
}

//跨浏览器获取键码
	//在keypress事件中，字母a在IE中为65（字符码），在Firefox中为97键码
	//尽量不使用该事件获取值，不同浏览器有误差
function getCharCode(event){
		var e = event || window.event;
		if(typeof e.charCode == 'number' && e.charCode > 0){
			return e.charCode;
		}else{
			return e.keyCode;
		}
	}

//2.封装创建cookie
	function setCookie(user,value,out_time,path,domain,secure){
		var cookie = encodeURIComponent(user)+'='+encodeURIComponent(value);
		if(out_time){
			cookie += ';expires='+getDate(out_time);
		}
		if(path){
			console.log(path);
			cookie += ';path='+path;
		}
		if(domain){
			console.log(domain);
			cookie += ';domain='+domain;
		}
		if(secure){
			cookie += ';secure';
		}	
		document.cookie = cookie;	//设置cookie
		//console.log(document.cookie);
		//console.log(cookie);
		//根据超时天数获取时间
		function getDate(out_time){
			if(typeof out_time == 'number' && out_time>0){
				var date = new Date();
				date.setDate(date.getDate()+out_time);
				return date;
			}else{
				throw new error('超时时间输入不合法');
			}
		}
	}

//根据cookie user获取value
function getCookieByUesr(user){
	var all_cookie = document.cookie;
	encode_user = encodeURIComponent(user);
	start = all_cookie.indexOf(encode_user+'=');
	if(start < 0){
		alert('cookie中不存在该user');
		return;
	}
	end = all_cookie.indexOf(';',start);
	//能执行到这表明找到了user，最后一个user后没有;，所以末尾长度就是字符串总长度
	if(end <0){
		end = all_cookie.length;
	}
	//console.log(start);
	console.log(encodeURIComponent(user));
	//console.log(end);
	//console.log(all_cookie.substring(start,end));
	//return decodeURIComponent(all_cookie.substring(start+user.length+1,end));
	return decodeURIComponent(all_cookie.substring(start+encode_user.length+1,end));
	//return all_cookie.substring(start+encode_user.length+1,end);

}

//跨浏览器创建XMLDom
	function createXMLDom(xmlStr){
		var xmlDom = null;
		
		//alert(typeof window.DOMParser);
		if(typeof window.DOMParser != 'undefined'){//先用W3C方法
		//if(window.DOMParser){
			xmlDom = (new DOMParser()).parseFromString(xmlStr,'text/xml');
			var errors = xmlDom.getElementsByTagName('parsererror');
			if(errors.length > 0){
				throw new Error('XML解析错误：'+errors[0].firstChild.nodeValue);
			}
		}else if(typeof window.ActiveXObject){//再用IE方法
			var version = [
				'MSXML2.DOMDocument.6.0',
				'MSXML2.DOMDocument.3.0',
				'MSXML2.DOMDocument'
			];

			for(var i=0;i<version.length;i++){
				try{
					var xmlDom = new ActiveXObject(version[i]);
					xmlDom.loadXML(xmlStr);
					//alert(11);
					if(xmlDom.parserError != 0){
						throw new Error('XML解析错误：' + xmlDom.parserError.reason);
					}
					break;	//创建成功后就退出循环
				}catch(e){
					//如果错误，调过此次创建，尝试向下兼容的ActiveX版本
				}
			}
		}else{
			throw new Error('您的浏览器不支持 XML DOM!');
		}

		return xmlDom;
	}

//跨浏览器序列化XML
	function serializeXML(xmlDom){	//传入xmlDom对象
		var xml = '';
		if(typeof XMLSerializer != 'undefined'){
			xml = (new XMLSerializer).serializeToString(xmlDom);
		}else if(typeof xmlDom.xml != 'undefined'){
			xml = xmlDom.xml;
		}else{
			throw new Error('无法解析XML');
		}
		return xml;
	}
/*	XML测试案例
	没有实现加载外部XML文件，因为有浏览器不支持
	var xmlStr = '<root><user>lee</user></root>';
	var xmlDom = createXMLDom(xmlStr);
	alert(xmlDom);
	alert(serializeXML(xmlDom));*/


//AJAX封装
//将包含多个对象的数组转化为字符串，格式为'name=lee&age=22&name=qee&age=11';
	function dealDate(data){		
		var result = '';
		var current_obj = {};
		for(var i=0;i<data.length;i++){
			current_obj = data[i];
			for(var property in current_obj){
				result += encodeURIComponent(property)+'='+encodeURIComponent(current_obj[property])+'&';
			}
		}
		//var str = result.slice(0,-1);
		result = result.slice(0,-1);
		return result;
	}


	function runAjax(obj){
		//参数判断
		if(typeof obj.method != 'string') throw new Error('method参数不合法！');
		if(typeof obj.url != 'string') throw new Error('url参数不合法！');
		if(!(obj.data instanceof Array)) throw new Error('data参数不合法！必须为数组');
		if(typeof obj.async != 'boolean') throw new Error('async参数不合法！');


		var xhr = new XMLHttpRequest();
		var post_data = null;

		//判断method
		if(obj.method === 'get'){
			//alert('use get');
			obj.url += obj.url.indexOf('?')==-1? '?':'&';
			obj.url += dealDate(obj.data);
			//alert(obj.url);
		}else if(obj.method === 'post'){
			post_data = dealDate(obj.data);
			//alert(post_data);
		}else{
			throw new Error('method参数必须为get或post');
		}

		//如果为异步，绑定onreadystatechange事件
		if(obj.async === true){
			xhr.onreadystatechange = function(){
				//alert(xhr.readyState);
				if(xhr.readyState == 4){
					callback();
				}
			};
		}

		//alert(obj.url);
		//准备发送请求
		xhr.open(obj.method,obj.url,obj.async);
		if(obj.method == 'post'){
			//为post方式设置头信息模拟表单提交
			xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		}
		xhr.send(post_data);

		//如果为同步，在send后执行输出
		if(obj.async === false){
			callback();
		}
		function callback(){
			if(xhr.status == 200){
				//函数回调,本来在addEvent中调用runAjax，现在又在runAjax中回调addEvent中的函数
				obj.success(xhr.responseText);	
			}else{
				alert('数据返回失败！错误代码：'+xhr.status+'错误信息：'+xhr.statusText);
			}
		}
		
	}
//AJAX调用模版
/*
	addEvent(document,'click',function(){
		runAjax({
			method : 'get',
			url : 'ajax.php?rand='+Math.random(),
			data : [				//可以直接传对象，不用数组，需修改dealData()
				{
					name : 'l&ee',
					age : 22
				}//,
				//{
				//	name : 'qee',
				//	age : 11				//传递属性名一样的数据时，前面的会被覆盖
				//}
			],
			async : true,

			success : function(content){
				alert(content);
			}
		});
		
	});

*/

//判断目标元素是否包含移入移出元素
	function checkHover(e,target){
	    if (getEvent(e).type=='mouseover')  {
	        return !contains(target,getEvent(e).relatedTarget||getEvent(e).fromElement) && !((getEvent(e).relatedTarget||getEvent(e).fromElement)===target);
	    } else if(getEvent(e).type=='mouseout'){
	        return !contains(target,getEvent(e).relatedTarget||getEvent(e).toElement) && !((getEvent(e).relatedTarget||getEvent(e).toElement)===target);
	    }else{
	    	throw new Error('this function just applicable for mouseover and mouseout!');
	    }

	    //parentNode包含childNode时返回true
	    function contains(parentNode, childNode) {
		    if (parentNode.contains) {
		        return parentNode != childNode && parentNode.contains(childNode);
		       // return parentNode.contains(childNode);
		    } else {
		        return !!(parentNode.compareDocumentPosition(childNode) & 16);
		    }
		}

		function getEvent(e){
		    return e||window.event;
		}
	}

//两张图片切换，一般用于导航图片
function changePicture(pic_in,pic_out){
	//如果当前有存在的计时器，先清除;
	if(typeof nav_interval_id != 'undefined' && nav_interval_id !== null){
		clearInterval(nav_interval_id);
		nav_interval_id = null;
		pic_in.style.opacity = 1;
		//pic_out.style.opacity = 0;
		
		pic_out.style.display = 'none';
	}
	var url_in = pic_in.src;
	var url_out = pic_out.src;
	var opacity_in = 0.5;
	var opacity_out = 1;
	var count = 1;
	
	//重置opacity属性
	pic_in.style.display = 'inline-block';
	pic_in.style.opacity = opacity_in;
	pic_out.style.opacity = opacity_out;

	//全局变量记录动画
	nav_interval_id = setInterval(oneChange,20);

	function oneChange(){
		if(count > 10){
			clearInterval(nav_interval_id);
			nav_interval_id = null;
			pic_in.style.opacity = 1;
			pic_out.style.display = 'none';
			return;
		}
		count++;
		opacity_in += 0.05;
		pic_in.style.opacity = opacity_in;
		opacity_out -= 0.05;
		pic_out.style.opacity = opacity_out;
	}
}