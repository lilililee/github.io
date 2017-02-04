function showDownloadApp(){
	//获取要显示的app下载区域
	var app = document.getElementsByClassName('header-options-mobile');
	//获取移入触发事件的a节点
	var links = document.getElementsByClassName('header-options')[0].getElementsByTagName('a');
	//绑定移入移出事件
	addEvent(links[1],'mouseover',function(){
		app[0].style['display'] = 'block';
	});
	addEvent(links[1],'mouseout',function(){
		app[0].style['display'] = 'none';
	});
}

function showNavMenu(){
	var nav = document.getElementById('nav');
	//获取nav中ul下的a链接
	var links = nav.getElementsByTagName('ul')[0].getElementsByTagName('a');
	var menu = nav.getElementsByClassName('menu');
	//alert(links.length);
	var len = menu.length;
	//alert(menu.length);

	//为导航链接绑定mouseover事件
	for(var i=0;i<len;i++){
		addEvent(links[i],'mouseover',function(event){
			//重置所有menu为none
			resetMenuDisplay();
			var sub_menu = this.className.replace('for-','');
			for(var k=0;k<len;k++){
				if(menu[k].className.indexOf(sub_menu) !== -1){
					menu[k].style['display'] = 'inline-block';
				}
			}
		});

	}

	//当鼠标移出包裹层for-menu时，所有menu为none
	var menu_out = document.getElementById('for-menu');
	addEvent(menu_out,'mouseout',function(e){
		//判断是否从menu_out真正移出去，而不是内部元素冒泡触发
		if(checkHover(e,this)){
			resetMenuDisplay();
		}
	});
	
	//隐藏所有menu内容
	function resetMenuDisplay(){
		for(var j=0;j<len;j++){
				menu[j].style['display'] = 'none';
		}
	}

}
/*
function changeNavBack(){
	var nav = document.getElementById('nav');
	//预先加载背景图片
	//nav.style.background = 'url(images/nav/background2.jpg) no-repeat ';
	//nav.style.background = 'url(images/nav/background3.jpg) no-repeat ';
	//nav.style.background = 'url(images/nav/background3.jpg) no-repeat ';
	var left = document.getElementsByClassName('back-left')[0];
	var right = document.getElementsByClassName('back-right')[0];
	var point = document.getElementsByClassName('three-bottom')[0].getElementsByTagName('i');

	//通过两个左右箭头改变	
	addEvent(left,'click',function(){
		//获得当前背景url
		var now_url = nav.style.background;
		var now_index = now_url[now_url.indexOf('ground')+6]*1;
		var new_index = now_index===1? 3:now_index-1;
		//alert(new_index);
		var new_url = now_url.replace('ground'+now_index,'ground'+new_index);
		nav.style.background = new_url;
		setSelect(new_index);
	});
	addEvent(right,'click',function(){
		//获得当前背景url
		var now_url = nav.style.background;
		var now_index = now_url[now_url.indexOf('ground')+6]*1;
		var new_index = now_index===3? 1:now_index+1;
		//alert(new_index);
		var new_url = now_url.replace('ground'+now_index,'ground'+new_index);
		nav.style.background = new_url;
		setSelect(new_index);
	});


	//通过右下角三个圆点改变
	for(var i=0,len=point.length;i<len;i++){
		point[i].index = i+1;
		addEvent(point[i],'click',function(){
			var now_url = nav.style.background;
			var now_index = now_url[now_url.indexOf('ground')+6]*1;
			var new_url = now_url.replace('ground'+now_index,'ground'+this.index);
			nav.style.background = new_url;
			setSelect(this.index);
		});
	}
	
	function setSelect(index){
		for(var i=0,len=point.length;i<len;i++){
			point[i].className = 'fa fa-circle-o';
		}
		point[index-1].className = 'fa fa-circle';
	}

}*/


function changeNavBackground(){
	//获取操作节点（箭头，圆点）和被操作节点（img背景图）
	var left = document.getElementsByClassName('back-left')[0];
	var right = document.getElementsByClassName('back-right')[0];
	var point = document.getElementsByClassName('three-bottom')[0].getElementsByTagName('i');
	var background = document.getElementsByClassName('nav-background');
	//当前背景序号，初始为0,表示第一张
	var current_id = 0;

	//图片自动轮播,移入导航时取消轮播，增加用户体验
	var nav = document.getElementById('nav');
	var lunbo_interval_id = setInterval(turnRight,4000);
	addEvent(nav,'mouseover',function(e){
		if(checkHover(e,this)){
			clearInterval(lunbo_interval_id);
			lunbo_interval_id = null;
		}
	});
	addEvent(nav,'mouseout',function(e){
		if(checkHover(e,this)){
			lunbo_interval_id = setInterval(turnRight,4000);
		}
	});

	//左箭头点击事件
	addEvent(left,'click',turnLeft);
	//右箭头点击事件
	addEvent(right,'click',turnRight);

	//右下角三个图标
	for(var i=0,len=point.length;i<len;i++){
		point[i].index = i;
		addEvent(point[i],'click',function(){
			setSelect(this.index);
			if(this.index != current_id){
				var pic_in = background[this.index];
				var pic_out = background[current_id];
				current_id = this.index;
				changePicture(pic_in,pic_out);
			}
			
		});
	}


	//改变选中图标
	function setSelect(index){
		for(var i=0,len=point.length;i<len;i++){
			point[i].className = 'fa fa-circle-o';
		}
		point[index].className = 'fa fa-circle';
	}

	//图片左切换
	function turnLeft(){
		var pic_in = current_id ===0? background[background.length-1] : background[current_id-1];
		var pic_out = background[current_id];
		changePicture(pic_in,pic_out);
		current_id = current_id ===0? background.length-1 : current_id-1;
		setSelect(current_id);
	}
	//图片右切换
	function turnRight(){
		var pic_in = current_id === background.length-1? background[0] : background[current_id+1];
		var pic_out = background[current_id];
		changePicture(pic_in,pic_out);
		current_id = current_id === background.length-1? 0 : current_id+1;
		setSelect(current_id);
	}
}



function showFixedApp(){
	//获取链接和img节点
	var fixed_menu = document.getElementById('fixed-menu');
	var link_app = fixed_menu.getElementsByClassName('fa-mobile')[0];
	var link_account = fixed_menu.getElementsByClassName('fa-commenting-o')[0];
	var pics = fixed_menu.getElementsByTagName('img');
	var pic_app = pics[0];
	var pic_account = pics[1];

	//添加事件
	addEvent(link_app,'mouseover',function(){
		showFixedPic(pic_app,160,180);
	});
	addEvent(link_app,'mouseout',function(){
		pic_app.style.display = 'none';
	});
	addEvent(link_account,'mouseover',function(){
		showFixedPic(pic_account,160,200);
	});
	addEvent(link_account,'mouseout',function(){
		pic_account.style.display = 'none';
	});
}

function showFixedPic(pic,pic_width,pic_height){
	if(typeof pic_width!='number' || typeof pic_height!= 'number' || pic_width<0 || pic_height<0){
		throw new Error('参数不合法');
	}
	
	if(typeof fixed_menu_interval_id !== 'undefined' && fixed_menu_interval_id !== null){
		clearInterval(fixed_menu_interval_id);
		fixed_menu_interval_id = null;
	}
	var speed_x = pic_width/20;
	var speed_y = pic_height/20;
	var width = 0;
	var height = 0;
	var count = 1;
	pic.style.width = 0;
	pic.style.height = 0;
	pic.style.display = 'inline-block';

	fixed_menu_interval_id = setInterval(oneStep,10);

	//移动一次
	function oneStep(){
		if(count>20){
			clearInterval(fixed_menu_interval_id);
			fixed_menu_interval_id = null;
			pic.style.width = pic_width+'px';
			pic.style.height = pic_height+'px';
			return;
		}
		count++;
		width += speed_x;
		height += speed_y;
		pic.style.width = width+'px';
		pic.style.height = height+'px';
	}
}



addOnloadEvent(showDownloadApp);
addOnloadEvent(showNavMenu);
addOnloadEvent(changeNavBackground);
addOnloadEvent(showFixedApp);

