$(function(){
	//1. header
	$('#show-downloadapp').hover(function(){
		$('.top-app').css('display','block');
	},function(){
		$('.top-app').css('display','none');
	});

	//2. nav
	//2.1 左侧导航栏部分
	var pre_a_index = -1,		//保存上一显示目录的下标
		i;

	//当离开wrap区域后当前显示的目录
	$('.left-nav-wrap').mouseleave(function(){
		$('.left-nav-menu').eq(pre_a_index).css('display','none');
		pre_a_index = -1;
	})
	//为nav左侧a标签添加事件，来控制对应目录的显示
	for( i = 0; i < 7; i++ ){
		(function(index){
			$('.left-nav a').eq(index).mouseenter(function(e){
				$('.left-nav-menu').eq(index).css('display','block');
				if( pre_a_index !== -1 ){
					$('.left-nav-menu').eq(pre_a_index).css('display','none');
				}
			}).mouseleave(function(){
				pre_a_index = index;
			});
		})(i);
		
	}

	//2.2 左右箭头切换nav背景
	var cur_bac_index = 0,			//当前显示的背景下标，从0开始
		last_bac_index,				//上一显示的背景下标
		nav_bacs = $('.nav-background'),	//获取所有背景
		nav_bacs_length = nav_bacs.length;
		toggle_btns = $('.toggle-btn span');	//获取左下所有圆点按钮
	//左箭头切换
	$('.toggle-left').click(function(){
		toggleNavBac(cur_bac_index === 0? nav_bacs_length-1 : cur_bac_index-1);
	});
	//右箭头切换
	$('.toggle-right').click(function(){
		toggleNavBac(cur_bac_index === nav_bacs_length-1? 0 : cur_bac_index+1);
	});
	//2.3 右下按钮切换nav背景
	toggle_btns.click(function(){
	
		toggleNavBac($.getIndexOf(this,toggle_btns));
	});

	//2.4 定时切换背景
	var toggle_intervar = setInterval(function(){
			toggleNavBac(cur_bac_index === nav_bacs_length-1? 0 : cur_bac_index+1);
		},5000);

	$('.nav').mouseenter(function(){
		clearInterval(toggle_intervar);
	}).mouseleave(function(){
		toggle_intervar = setInterval(function(){
			toggleNavBac(cur_bac_index === nav_bacs_length-1? 0 : cur_bac_index+1);
		},5000);
	});

	// $(window).focus(function(){
	// 	alert(11)
	// })
	//切换背景，参数为下一背景下标
	function toggleNavBac(next_index){
		last_bac_index = cur_bac_index;			
		cur_bac_index = next_index; 
		//改变左下圆点按钮样式
		toggle_btns[cur_bac_index].className = 'btn-active';
		toggle_btns[last_bac_index].className = '';
		//淡入淡出背景
		$(nav_bacs[cur_bac_index]).stop().fadeIn(500);
		$(nav_bacs[last_bac_index]).stop().fadeOut(500);
	}
	/* 3. courses */
	//3.1 鼠标进入某一课程显示更多信息
	$('.courses-list .info').mouseenter(function(){
		$(this).stop().animate({'height':'150px'},300);
	}).mouseleave(function(){
		$(this).stop().animate({'height':'110px'},300);
	})

	/* 4. 右侧固定菜单栏 */
	// 4.1 将图标改为文字
	$('.fixed-menu a').mouseover(function(){
		$(this).find('i').css('display','none');
		$(this).find('span').css('display','block');
	}).mouseout(function(){
		$(this).find('i').css('display','inline');
		$(this).find('span').css('display','none');
	})

	//4.2 显示app下载二维码
	$('.fixed-showapp').mouseenter(function(){
		$('.fixed-app').show(200);
	}).mouseleave(function(){
		$('.fixed-app').hide(200);
	});
	$('.fixed-showweixin').mouseenter(function(){
		$('.fixed-weixin').show(200);
	}).mouseleave(function(){
		$('.fixed-weixin').hide(200);
	});

	//4.3 显示返回顶部按钮
	$(window).scroll(function(){
		if($(window).scrollTop() > 400){
			$('.fixed-showtotop').fadeIn();
		} else {
			$('.fixed-showtotop').fadeOut();
		}
	});

	//4.4 点击返回顶部
	$('.fixed-totop').click(function(){
		//alert(11)
		$(window).animate({'scrollTop': '0'},400);
	})

	
})