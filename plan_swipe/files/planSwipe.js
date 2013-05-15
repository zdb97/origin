/*global $ window Swipe */

var SwipePlans = function () {

    this.config = {
        $activePlanContainer: $('.planMasterContainer .planListContainer.is-active .planSwipe'),
        $planIndexContainer: $('nav ul.planIndicator'),
        planIndexItem: 'nav ul.planIndicator li',
        activePlansContainer: '.planListContainer.is-active .planList >ul >li',
        bonusContainer: '.planBonus',
        edge: 20,
        margin: 5
    };
};


SwipePlans.prototype = {
    init: function () {
        var self = this;
        this.config.$planIndexContainer.html('');
        
        $.each($(this.config.$activePlanContainer), function () {
            self.buildPlanSwipe($(this));
        });
    },

    buildPlanSwipe: function ($this) {
        var self = this;
        if ($this.is(':visible')) {

            window.planSwipe = new Swipe($this.get(0), {
                // startSlide: 4,
                // auto: 3000,
                // continuous: true,
                // disableScroll: true,
                // stopPropagation: true,
                // transitionEnd: function(index, element) {}
                siblingEdge: self.config.edge,
                sideMargin: self.config.margin,
                callback: function (index, elem) {
                    $(self.config.planIndexItem).removeClass('on');
                    $(self.config.planIndexItem).eq(index).addClass('on');
                    
                    $(self.config.activePlansContainer).removeClass('on prev next');
                    $(elem).addClass('on');
                    
                    if ($(elem).prev().length) {
                        $(elem).prev().addClass('prev');
                    }
                    else {
                        $(elem).siblings(':last').addClass('prev');
                    }
                    
                    if ($(elem).next().length) {
                        $(elem).next().addClass('next');
                    }
                    else {
                        $(elem).siblings(':first').addClass('next');
                    }
                    
                }
            });

            self.buildPlanIndex(window.planSwipe.getNumSlides());
            self.setSwipeItem(self.getSwipeItemHeight());
        }
    },
    
    buildPlanIndex: function (len) {
        for (var i = 0; i < len; i++) {
            if (i === 0) {
                this.config.$planIndexContainer.append('<li itemIndex="' + i + '" class="on">');
            }
            else {
                this.config.$planIndexContainer.append('<li itemIndex="' + i + '">');
            }
        }

        $(this.config.planIndexItem).on('hover', function () {
            window.planSwipe.slide($(this).attr('itemIndex'), 300);
        });
    },
    
    getSwipeItemHeight: function () {
        var self = this;
        var maxH = 0;
        $.each($(self.config.activePlansContainer), function () {
            var bounuH = $(self.config.bonusContainer, this).length > 0 ? $(self.config.bonusContainer, this).outerHeight() : 0;
            //console.log(bounuH);

            maxH = maxH > ($(this).outerHeight() + bounuH) ? maxH : ($(this).outerHeight() + bounuH);
            //console.log(maxH);
        });
        
        return maxH;
    },
    
    setSwipeItem: function (h) {
        if (this.config.margin !== 'undefined' || this.config.margin !== '') {
            $(this.config.activePlansContainer).css({'margin-left': this.config.margin + 'px',
                'margin-right': this.config.margin + 'px'});
        }
        
        $(this.config.activePlansContainer).css({'height': h});
        $(this.config.activePlansContainer).eq(0).addClass('on');
		$(this.config.activePlansContainer).eq(1).addClass('next');
        $(this.config.activePlansContainer).last().addClass('prev');
    }
};

//new SwipePlans().init();

