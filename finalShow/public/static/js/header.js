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
        window.location.href='/';
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