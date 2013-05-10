/*global $ window Swipe console */

$.SwipePlans = function () {

    this.config = {
        $activePlansContainer: $('.planMasterContainer .planListContainer.is-active'),
        $planContainer: $('.planSwipe'),
        $planIndicatorContainer: $('nav ul.planIndicator'),
        planIndicatorItem: 'nav ul.planIndicator li',
        width: 40,
        gap: 30,
        activePlansContainer: '.planListContainer.is-active .planList >ul >li'
    };
};


$.SwipePlans.prototype = {
    init: function () { },
    
    showPlanSwipe: function () {
        var self = this;
        this.config.$planIndicatorContainer.html('');
        
        $.each($(this.config.$planContainer, this.config.$activePlansContainer), function () {
            if ($(this).is(':visible')) {

                self.buildPlanIndicator($('> ul > li', $(this)).length);

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
                        $(self.config.planIndicatorItem).eq(index).attr('class', 'on');
                    }
                });
                
                self.customizePlanSwiper();
            }
        });
    },
    
    buildPlanIndicator: function (len) {
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
        var planItemWidth = $(self.config.activePlansContainer).first().outerWidth() - self.config.width;
        var ItemGap = $(self.config.activePlansContainer).first().outerWidth() - self.config.gap;
        //console.log(planItemWidth);
        
        //console.log($(self.config.activePlansContainer).length);
        $.each($(self.config.activePlansContainer), function (i) {
            console.log($(this).outerWidth() + ' ===-');
            $(this).css('width', planItemWidth + 'px');
            $(this).css('left', (i * ItemGap * (-1)) + 'px');
        });
    }
};




