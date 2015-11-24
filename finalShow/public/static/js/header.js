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
	$('.mobile-icon').click(function() {
		/* Act on the event */
		alert("hello World!");
	});
});

