(function(){
    $(function(){
        var $pin = $('.pin');
        var $hd = $('header');
        if(sessionStorage.pin == 'fixed'){
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
        $('.menu').click(function() {
            /* Act on the event */
//        var randNum = Math.random();
//        if(randNum >= 0 && randNum <0.5){
//            menuSlide();
//        }else{
//            menuFade();
//        }
            menuSlide();
        });
//    $('.home').click(function(){
//        backOne();
//    });
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
//function menuFade(){
//    if($('.mobile-menu').css('display') == 'block'){
//        $('.mobile-menu').fadeOut(150);
//    }else{
//        $('.mobile-menu').fadeIn(150);
//    }
//}
    function getScrollTop(){
        return $(document).scrollTop();
    }
//function backOne(){
//    window.history.go(-1);
//}
    function dispAbsolute(element){
        sessionStorage.pin = 'absolute';
        element.css('position','absolute');
    }
    function dispFixed(element){
        sessionStorage.pin = 'fixed';
        element.css('position','fixed');
    }

}());
(function(){
    var oriTitle = document.title;
    var hidden,state,visibilityChange;
    if(typeof document.hidden !=='undefined'){
        hidden = 'hidden';
        visibilityChange = 'visibilitychange';
        state = 'visibilityState';
    }else if(typeof document.mozHidden !=='undefined'){
        hidden = 'mozHidden';
        visibilityChange = 'mozvisibilitychange';
        state = 'mozVisibilityState';
    }else if(typeof document.webkitHidden !=='undefined'){
        hidden = 'webkitHidden';
        visibilityChange = 'webkitvisibilitychange';
        state = 'webkitVisibilityState';
    }else if(typeof document.msHidden !=='undefined'){
        hidden = 'msHidden';
        visibilityChange = 'msvisibilitychange';
        state = 'msVisibilityState';
    }
    console.log(hidden+','+visibilityChange+','+state);
    document.addEventListener(visibilityChange,function(){
        var h = event.target[hidden];
        if(h){
            document.title='(｡・`ω´･)'+oriTitle;
        }else{
            document.title = oriTitle;
        }
    },true);
}());
