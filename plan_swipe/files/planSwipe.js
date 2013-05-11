/*global $ window Swipe console window */

$.SwipePlans = function () {

    this.config = {
        $activePlansContainer: $('.planMasterContainer .planListContainer.is-active'),
        $planContainer: $('.planSwipe'),
        $planIndicatorContainer: $('nav ul.planIndicator'),
        planIndicatorItem: 'nav ul.planIndicator li',
        lessWidth: 40,
        gap: 30,
        activePlansContainer: '.planListContainer.is-active .planList >ul >li'
    };
};


$.SwipePlans.prototype = {
    init: function () {
		var self = this;
		$(window).on('resize', function() {
			self.customizePlanSwiper();
		}); 
	},
	
	 
    
    showPlanSwipe: function () {
        var self = this;
        this.config.$planIndicatorContainer.html('');
        
        $.each($(this.config.$planContainer, this.config.$activePlansContainer), function () {
            if ($(this).is(':visible')) {

                self.buildPlanIndex($('> ul > li', $(this)).length);

                window.planSwipe = new Swipe($(this).get(0), {
                    // startSlide: 4,
                    // auto: 3000,
                    // continuous: true,
                    // disableScroll: true,
                    // stopPropagation: true,
                    // transitionEnd: function(index, element) {}
                    callback: function (index) {
                        $.each($(self.config.planIndicatorItem), function () {
                            $(this).attr('class', '');
                        });
						
						console.log(index + ' ppppp');
                        $(self.config.planIndicatorItem).eq(index).attr('class', 'on');
                    }
                });
                
                self.customizePlanSwiper(); 
            }
        });
    },
    
    buildPlanIndex: function (len) {
        for (var i = 0; i < len; i++) {
            if (i === 0) {
                this.config.$planIndicatorContainer.append('<li itemIndex="' + i + '" class="on">');
            }
            else {
                this.config.$planIndicatorContainer.append('<li itemIndex="' + i + '">');
            }
        }
        
        $(this.config.planIndicatorItem).on('hover', function () {
            window.planSwipe.slide($(this).attr('itemIndex'), 300);
        });
    },
    
    customizePlanSwiper: function () {
        var self = this;
        // set new plan container width (original - 40)
		var planContainerWidth = $(self.config.activePlansContainer).first().outerWidth() - self.config.lessWidth;
		// set new plan container offset/transition (original - 30)
        var ItemGap = $(self.config.activePlansContainer).first().outerWidth() - self.config.gap;
        
        //console.log($(self.config.activePlansContainer).length);
        // apple the new calculation
		$.each($(self.config.activePlansContainer), function (i) {
            console.log($(this).outerWidth() + ' ===-');
            $(this).css('width', planContainerWidth + 'px');
            $(this).css('left', (i * ItemGap * (-1)) + 'px');
			
			console.log('hahahaaa');
			//console.log($(this).css('transform'));
			
        });
    }
	
};


new $.SwipePlans().init();




