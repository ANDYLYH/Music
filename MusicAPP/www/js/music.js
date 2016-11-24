;
$(function(){
	
	var $btnChanges = $('.head .tag1');//头部标题
	var btnPlay = $('.logo span').eq(1);//暂停播放
	var eAlbum = $('.foot_left img');//旋转图片
	var big_eAlbum =$('#singer_img img');//大图片
	var btnPrev = $('.icon-prev');//上一曲
	var btnNext = $('.icon-next');//下一曲
	var eTitle = $('.foot_right h2');//歌手
	var eTitle2 = $('.foot_right p');//歌名
	var playstyle = $('.bofang_model span').eq(2);//播放模式切换按钮
	var eTime_left= $('.logo2 time').eq(0);//时间1
	var eTime_right= $('.logo2 time').eq(1);//时间2
	var eProgress = $('progress');//进度条
	var $nav = $('.nav');//导航栏
	var $navlist = $('.nav .navlist');
	var $seachsong = $('.head span').eq(4);
	var $seachbox = $('#seach_input');
	var $seachinput=$('.song_seach');
	var $style = $('.head span').eq(0);//显示/隐藏导航栏，切换歌曲类型
	var $datalist = $('<datalist/>').attr({'id':'music_list'}).addClass('datalist');//播放列表容器
	//定义全局变量
	var flag= false;
	var MusicStyle = 5;
	var index = 0;//初始坐标
	var model = 2;//初始播放模式
	
	//点击搜索
	$seachbox.hide();
	$seachsong.on('singleTap',function(e){
		$seachbox.toggle();
		e.stopPropagation();
	})
	
	$seachinput.on('focus',function(e){
		e.stopPropagation();
	})
	
	//点击，隐藏、显示导航栏
	$style.on('singleTap',function(e){
		$nav.toggle();
		e.stopPropagation();
	})
	//点击切换歌类型
	$navlist.on('singleTap','li',function(e){
		index = 0;
		playlist =[];
		$nav.hide();
		$datalist.empty();
		$(this).addClass('aim').siblings('li').removeClass('aim');
		MusicStyle = $(this).attr('styleid');
		musicLoad(MusicStyle);
		
	})
	
	$(document).on('singleTap',function(){
     	$nav.hide();
//   	$seachbox.hide();
	})
	
	//左右滑动
	var myswiper = new Swiper('#main_body',{
//		initialSlide:1,
		pagination: '.swiper-pagination',
		freeMode:false,
		onSlideChangeStart: function(){
			$btnChanges.eq(myswiper.activeIndex).addClass('active').siblings('span').removeClass('active');
		}
		
	})
	
	//点击切换
	$btnChanges.on('singleTap',function(){
    	var index = $(this).index()-1;  //获取下标
    	$(this).addClass('active').siblings('span').removeClass('active');
    	myswiper.slideTo(index, 1000, false);
   })

	var playlist =[];
	var $songList = $('#song');
	var oplay = new Audio();
	//创建临时容器
	var fg = document.createDocumentFragment();
	//1）、封装一个函数
	function musicLoad(songstyle){
		$.ajax({
		type:"get",
		url:"http://route.showapi.com/213-4",
		async:true,
		data:{
			showapi_appid:'27148',
			showapi_sign:'ef192ef38a734b6d8647dbfe77e94aa0',
			topid:songstyle
		},
		success:function(res){
			console.log(res.showapi_res_body.pagebean.songlist)
			playlist = res.showapi_res_body.pagebean.songlist;
//			var $datalist = $('<datalist/>').attr({'id':'music_list'}).addClass('datalist');
			res.showapi_res_body.pagebean.songlist.forEach(function(item,idx){
				var option = $('<option/>');
				var j = idx+1;
				option.html(j+"、"+item.singername + ' -- ' + item.songname);
				option.appendTo($datalist);
			})
			$songList.append($datalist);
			oplay.src = playlist[index].url;
			oplay.play();
			//点击列表播放歌曲
			$('#music_list').on('singleTap','option',function(){
				 index = $(this).index();
				 oplay.src = playlist[index].url;
				 oplay.play();
			})
		}
	});
	}
	//执行函数
	musicLoad(MusicStyle);
	
	
	// 2）播放/暂停歌曲
	// console.log(btnPlay.classList)
	btnPlay.on('singleTap',function(){
		//如果当前处于暂停状态，就播放
		
		if(oplay.paused){
			oplay.src = playlist[index].url;
			oplay.play();
			
		}else{
			oplay.pause();	
		}
	})
	
	
		//3）、 播放时触发
	oplay.onplay = function(){
		btnPlay.addClass('icon-zanting').removeClass('icon-zan');

		// 图片旋转效果
		eAlbum.addClass('playing');
		eAlbum.css("animationPlayState","running");

		// 给当前播放歌曲添加高亮效果
		var $option = $('#music_list option');
		for(var i=0;i<$option.length;i++){
			if(i===index){
				$option[i].classList.add('highlight');
				$option[i].scrollIntoView();
			}else{
				$option[i].classList.remove('highlight');
			}
		}
		

//		// 改变标题
		eTitle.html(playlist[index].singername);
		eTitle2.html(playlist[index].songname);
//		
//
//		// 专辑图片
		eAlbum.attr({'src':playlist[index].albumpic_small});
		big_eAlbum.attr({'src':playlist[index].albumpic_big});
	}
	
	// 暂停时触发
	oplay.onpause = function(){
		btnPlay.removeClass('icon-zanting').addClass('icon-zan');

		// 移除图片旋转效果
		eAlbum.removeClass('playing');
        eAlbum.css("animationPlayState","paused");
	}
	
	// 上一曲/下一曲
	btnPrev.on('singleTap',function(){
		if(model == 4){
		  index = Math.round(Math.random()*playlist.length);	
		}else{
		  index--;
		}
		play();
	})
	btnNext.on('singleTap',function(){
		if(model == 4){
		  index = Math.round(Math.random()*playlist.length);	
		}else{
		  index++;
		}
		play();
	})
	
		// 4）播放模式
	// 当前歌曲播放完毕后，下一步做什么
	oplay.onended = function(){
		// 判断播放模式
		// 0:单曲播放,1:单曲循环,2:列表播放,3:列表循环,4:随机播放
		switch(model){
			case 1:
				play();
				break;
			case 2:
				if(index<playlist.length-1){
					index++;
					play();
				}
				break;
			case 3:
				index++;
				play();
				break;
			case 4:
				index = Math.round(Math.random()*playlist.length);
				play();
				break;
		}
	}
	
	//6)切换播放模式
	playstyle.on('singleTap',function(){
		model++;
		if(model>4){
			model =1;
		}
		switch(model){
			case 1:playstyle.removeClass('icon-suijibofang').addClass('icon-danquxunhuan');
			break;
			case 2:playstyle.removeClass('icon-danquxunhuan').addClass('icon-icon');
			break;
			case 3:playstyle.removeClass('icon-icon').addClass('icon-ttpodicon');
			break;
			case 4:playstyle.removeClass('icon-ttpodicon').addClass('icon-suijibofang');
			break;
			default:break;
		}
	})
	// 播放进度改变时触发
	// 播放过程一直触发
	oplay.ontimeupdate = function(){
		updateTime();
	}

	
	//7) 歌曲能播放时
	oplay.oncanplay = function(){
		init();
	}
	
	// 初始化
	// 改变播放器的初始状态
	// 歌名，图片，播放模式，时间
	function init(){
      // 改变标题
		eTitle.html(playlist[index].singername);
		eTitle2.html(playlist[index].songname);
		// 专辑图片
		eAlbum.src = playlist[index].url;

		// 更新时间
		updateTime();
		
	}

     function updateTime(){
		// 时间
		// 播放了多少分
		var minLeft = parseInt(oplay.currentTime/60);
		var secLeft = parseInt(oplay.currentTime%60);
		//总时间长度
		var minRight = parseInt(oplay.duration/60);
		var secRight = parseInt(oplay.duration%60);

		eTime_left.html( minLeft + ':' + (secLeft<10 ? '0' : '') + secLeft);
        eTime_right.html(minRight + ':' + (secRight<10 ? '0' : '') + secRight);

		// 进度条
		eProgress.val(oplay.currentTime/oplay.duration*100);
	}
	// 8）点击进度条改变播放进度
	eProgress.on('click',function(e){
		console.log(e.offsetX);
		oplay.currentTime = (e.offsetX/eProgress.width())*oplay.duration;
	})
	
	//定义一个播放函数
	function play(){
		if(index<0){
			index = playlist.length-1;
		}else if(index > playlist.length-1){
			index = 0;
		}
		oplay.src = playlist[index].url;
		oplay.play();
	}
	
	
});
