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
	//右下按钮切换
	toggle_btns.click(function(){
	
		toggleNavBac($.getIndexOf(this,toggle_btns));
	})

	//定时切换背景
	var toggle_intervar = setInterval(function(){
			toggleNavBac(cur_bac_index === nav_bacs_length-1? 0 : cur_bac_index+1);
		},3000);

	$('.nav').mouseenter(function(){
		clearInterval(toggle_intervar);
	}).mouseleave(function(){
		toggle_intervar = setInterval(function(){
			toggleNavBac(cur_bac_index === nav_bacs_length-1? 0 : cur_bac_index+1);
		},3000);
	})

	//切换背景，参数为下一背景下标
	function toggleNavBac(next_index){
		last_bac_index = cur_bac_index;			
		cur_bac_index = next_index; 
		//改变左下圆点按钮样式
		toggle_btns[cur_bac_index].className = 'btn-active';
		toggle_btns[last_bac_index].className = '';
		//淡入淡出背景
		$(nav_bacs[cur_bac_index]).fadeIn(500);
		$(nav_bacs[last_bac_index]).fadeOut(500);
	}
	
})