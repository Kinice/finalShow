/*$(function(){
	var timeout         = 100;
	var closetimer		= 0;
	var ddmenuitem      = 0;

	function open(){
		canceltimer();
		close();
		ddmenuitem = $(this).find('ul').eq(0).css('visibility', 'visible');
	}

	function close(){
		if(ddmenuitem) ddmenuitem.css('visibility', 'hidden');
	}

	function timer(){
		closetimer = window.setTimeout(close, timeout);
	}
	function canceltimer(){
		if(closetimer){	
			window.clearTimeout(closetimer);
			closetimer = null;
		}
	}
	$(document).ready(function(){	
		$('.nav-inside').bind('mouseover', open);
		$('.nav-inside').bind('mouseout',  timer);
	});
	document.onclick = close;
});*/
$(function(){
	$('.menu').click(function() {
		/* Act on the event */
        var randNum = Math.random();
        if(randNum >= 0 && randNum <0.5){
            menuSlide();
        }else{
            menuFade();
        }
	});
    $('.home').click(function(){
        backOne();
    });
    $(document).scroll(function(){
        if(getScrollTop() <= 200){
            $('.back-to-top').fadeOut();
        }else if(getScrollTop() >= 200){
            //Back To Top
            $('.back-to-top').fadeIn();
        }
    });
    $('.back-to-top').click(function(){
        $('html,body').animate({
            scrollTop: 0
        },500);
    });
    $('.pin').click(function() {
        /* Act on the event */
        var $pin = $(this);
        var $hd = $('.g-hd');
        if($hd.css('position')=='absolute'){
            dispFixed($hd);
            $pin.css({
                'transform':'rotate(-90deg)',
                'color':'#fff'
            });
        }else{
            dispAbsolute($hd);
            $pin.css({
                'transform':'rotate(0deg)',
                'color':'#f26651'
            });
        }
    });
});
function menuSlide(){
    if($('.mobile-menu').css('display') == 'block'){
        $('.mobile-menu').slideUp(150);
    }else{
        $('.mobile-menu').slideDown(150);
    }
}
function menuFade(){
    if($('.mobile-menu').css('display') == 'block'){
        $('.mobile-menu').fadeOut(150);
    }else{
        $('.mobile-menu').fadeIn(150);
    }
}
function getScrollTop(){
    return $(document).scrollTop();
}
function backOne(){
    window.history.go(-1);
}
function dispAbsolute(element){
    element.css('position','absolute');
}
function dispFixed(element){
    element.css('position','fixed');
}