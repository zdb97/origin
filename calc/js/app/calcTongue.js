/*global $ document console setTimeout */

/*  12JUL13: created by Zidan
*   usage: new calcTongue($container, {
*       pxToMove: [int],	(optional, minimum displacement in px for the panel to animate)
*       displayByDefault: [true|false] (optional, show or hide the panel on page load)
*       animate: [true|false (default)] (optional, animate the menu after page load)
*   }).init();
*/

var calcTonguePanel = function ($container, options) {
	this.param = {
		$container:         $container,
		isMoving:           false,
		showPanelCssClass:  'show-panel',
		hidePanelCssClass:  'hide-panel',
		startX:             0,
		startY:             0,
		diffX:	            0,
		diffY:	            0,
		isTouch:            null
	};
	
	this.options = {
        pxToMove:           (options.pxToMove || 50),
		displayByDefault:   (options.displayByDefault !== undefined ? options.displayByDefault : true),
		animate:            (options.animate !== undefined ? options.animate : false)
	};
};

calcTonguePanel.prototype = {
    init: function () {
	    // attach events
	    this.param.$container.on('touchstart MSPointerDown mousedown', {self: this}, this.toggleCalcTongueStart);
	    this.param.$container.on('touchmove MSPointerMove mousemove', { self: this }, this.toggleCalcTongue);
	    this.param.$container.on('touchend MSPointerUp mouseup', { self: this }, this.toggleCalcTongueEnd);
        
		this.param.isTouch = this.isTouch();
		
		this.setPanelStatus();
    },
	
	isTouch: function () {
	    // [for most browsers || ie10 ] on a touch-able device
	    return (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
	},
	
	setPanelStatus: function (e) {
	    var self = this;
		
		// remove the show/hide classes on container if there's any
	    this.param.$container.removeClass(this.param.showPanelCssClass);
	    this.param.$container.removeClass(this.param.hidePanelCssClass);
	    // add css class on container according to option attributes value
	    if (this.options.displayByDefault === true) {
	        this.param.$container.addClass(this.param.showPanelCssClass);
	        
	        if (this.options.animate === true) {
	            setTimeout(function () {
	                self.param.$container.addClass(self.param.hidePanelCssClass);
	            }, 1500);
	        }
	    }
	    else {
            this.param.$container.addClass(this.param.hidePanelCssClass);
            
            if (this.options.animate === true) {
	            setTimeout(function () {
	                self.param.$container.addClass(self.param.showPanelCssClass);
	            }, 1500);
	        }
	    }
	},
    
    toggleCalcTongueStart: function (e) {
		e.data.self.param.isMoving = true;

		// all touch device browsers (except windows phone ie)
		if (e.type === 'touchstart') {
		    // IMPORTANT: stop any touches on this container from scrolling the page
			e.preventDefault();
			
			//use with native js: addEventListener
			//var touches = e.touches[0];
			//var touches = e.changedTouches[0];
			
			// use with jquery .on
			var touches = e.originalEvent.touches[0];
				
			e.data.self.param.startX = touches.pageX;
			e.data.self.param.startY = touches.pageY;
			 
			console.log('1-1: startX: ' + e.data.self.param.startX + ', startY: ' + e.data.self.param.startY);
		}
		// ie10+ on touch-able devices
		else if (e.type === 'MSPointerDown' && e.data.self.param.isTouch === true) { 
		    e.preventDefault();
		
		    e.data.self.param.startX = e.originalEvent.clientX;
			e.data.self.param.startY = e.originalEvent.clientY;
			
			// test
			console.log('1-2: startX: ' + e.data.self.param.startX + ', startY: ' + e.data.self.param.startY);
		}
		// non-touchable device browsers
		else if (e.type === 'mousedown' && e.data.self.param.isTouch === false) {
			e.data.self.param.startX = e.pageX;
			e.data.self.param.startY = e.pageY;
			
			// test
			console.log('1-3: startX: ' + e.data.self.param.startX + ', startY: ' + e.data.self.param.startY);
		}
	},
	
	toggleCalcTongue: function (e) {
	    if (e.data.self.param.isMoving === true) {
		
			if (e.type === 'touchmove') {
			    // IMPORTANT: stop any touches on this container from scrolling the page
				e.preventDefault();
			
				var touches = e.originalEvent.touches[0];
				 
				e.data.self.param.diffX = touches.pageX - e.data.self.param.startX;
				e.data.self.param.diffY = touches.pageY - e.data.self.param.startY;	
			}
			else if (e.type === 'MSPointerMove' && e.data.self.param.isTouch === true) {
			    e.preventDefault();
				
				e.data.self.param.diffX = e.originalEvent.clientX - e.data.self.param.startX;
			    e.data.self.param.diffY = e.originalEvent.clientY - e.data.self.param.startY;
			}
			else if (e.type === 'mousemove' && e.data.self.param.isTouch === false) {
		
				e.data.self.param.diffX = e.pageX - e.data.self.param.startX;
				e.data.self.param.diffY = e.pageY - e.data.self.param.startY;
			}
			
			// if vertical movements && displacement > 20px
			if ((Math.abs(e.data.self.param.diffX) < Math.abs(e.data.self.param.diffY)) &&  Math.abs(e.data.self.param.diffY) > e.data.self.options.pxToMove) {
				if ($(this).hasClass(e.data.self.param.showPanelCssClass) && e.data.self.param.diffY < -(e.data.self.options.pxToMove)) {
					$(this).removeClass(e.data.self.param.showPanelCssClass).addClass(e.data.self.param.hidePanelCssClass);
				}
				else if ($(this).hasClass(e.data.self.param.hidePanelCssClass) && e.data.self.param.diffY > e.data.self.options.pxToMove) {
					$(this).removeClass(e.data.self.param.hidePanelCssClass).addClass(e.data.self.param.showPanelCssClass);
				}
				 
				// test
				console.log('2: diffX: ' + e.data.self.param.diffX + ', diffY: ' + e.data.self.param.diffY);
		    }
		}
	},

	toggleCalcTongueEnd: function (e) {
		e.data.self.param.isMoving = false;
        /*
		if (e.type === 'touchend' || e.type === 'MSPointerUp') { }
		else if (e.type === 'mouseup' && !('ontouchmove' in document.documentElement)) { }
	    */
	}
	
};
   
// object initialization
new calcTonguePanel($('.calcSummaryTongue'), {
	pxToMove: 5,
	displayByDefault: true,
	animate: true
}).init();


