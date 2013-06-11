/*global jQuery window Math */

(function ($) {
	function getSwipeItemWidth() {
		//console.log('yoyoo');
		var wrapperWidth = $('.swiper-partial').outerWidth();
		var itemWidth = Math.floor(wrapperWidth * 0.45);
		$('.swiper-slide').width(itemWidth);
		$('.swiper-wrapper').width(itemWidth * 6);
	}
	
	$(window).on('throttledresize orientationchange', getSwipeItemWidth);
     
    getSwipeItemWidth();
   
    //Partial Slides
    $('.swiper-partial').swiper({
		slidesPerSlide: 'auto',
		initialSlide: 0
	});
	
	
	
	// menu init
	$('nav#menu').mmenu();
	 

   
})(jQuery);