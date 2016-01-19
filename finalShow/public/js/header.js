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
        if(getScrollTop() <= 600){
            $('.back-to-top').stop().fadeOut();
        }else if(getScrollTop() >= 600){
            //Back To Top
            $('.back-to-top').stop().fadeIn();
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
        var $hd = $('header');
        if($hd.css('position')=='absolute'){
            dispFixed($hd);
            $pin.css({
                'transform':'rotate(0deg)',
                'color':'#f26651'
            });
        }else{
            dispAbsolute($hd);
            $pin.css({
                'transform':'rotate(-90deg)',
                'color':'#fff'
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