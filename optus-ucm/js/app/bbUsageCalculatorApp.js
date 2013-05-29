/**
	 * Represents data usage descriptions
	 */
	var DataUsage = Backbone.Model.extend({

		defaults: {
			title: '',
			listing: null,
			details: ''
		}
	});

/**
	 * Represents a single device
	 */
	var Device = Backbone.Model.extend({

		defaults: {
			deviceQuery: '',
			device : [],
			deviceFlag: null,
			deviceType: ''
		},
		
		getCurrentDeviceType: function () {
			var self = this;
			
			//get devicetype value from query string [true to enable slide, otherwise to disable slide]
			var queryStringArr = window.location.search.substring(1).split('&'); //window.location.hash.substring(1);  
			
			$.each(queryStringArr, function (i, query){ 
				if(query.toLowerCase().indexOf(self.toJSON().deviceQuery) != -1) {
					var q = query.split('=');  
					switch (q[1].toLowerCase()) {
						case 'mobile': 
						case 'tablet': 
						case 'modem':
							self.deviceFlag = true;
							self.deviceType = q[1].toLowerCase();
							break;
						default:	
							break;
					} 
				} 
			});
		
			return [self.deviceFlag, self.deviceType];
		}
	});

/**
	 * Represents a single calcuat
	 */
	var UsageCalculator = Backbone.Model.extend({

		defaults: {
	 		title: '',
	 		summaryTitle: '',
	 		type: '',
	 		unit1: '',
	 		unit2: '',
	 		unitMultiplier: null,
	 		activities: null
		},

		initialize: function (attributes) {
			this.set('activities', new UsageCalculatorActivityCollection(attributes.activities));
		},

		calculateMonthlyActivitySummary: function () {

			var summaryValue = 0;

			// FIXME: This is smelly.
			switch (this.get('type')) {

				case 'voice':
					summaryValue = this.calculateVoiceActivitySummary();
				break;

				case 'data':
					summaryValue = this.calculateDataActivitySummary();
				break;

				default:
					throw new Error('Unknown UsageCalculator type:', this.get('type'));
				break;

			}

			// FIXME Nicer way of calculating monthly amount.
			summaryValue = summaryValue * 30;

			return summaryValue;
		},

        /**
         * Voice activity is multiplicative.
         *
         * @return {String} The formatted display total.
         */
        calculateVoiceActivitySummary: function () {
            var selectedSteps = this.get('activities').pluck('selectedStep'); 

            // Memo is initially set to 1 so that the first iteration doesn't cause memo to be set to 0.
            var total = _.reduce(selectedSteps, function (memo, num) {
                return memo * num;
            }, 1);

            return total;
        },

        /**
         * Data activity is additive, with the additional use of a unit multiplier.
         * @return {String} The formatted activity summary value.
         */
        calculateDataActivitySummary: function () {

        	var unitMultiplier = this.get('unitMultiplier');
        	
            var total = 0;

            this.get('activities').each(function (activity) {

                var multiplier = unitMultiplier[activity.get('unit')];

                total = total + (activity.get('selectedStep') * multiplier);

            });

            return total;
        }

	});

/**
	 * Represents a single "activity" within a calculator.
	 */
	var UsageCalculatorActivity = Backbone.Model.extend({
	 	
		defaults: {
			title: "",
			unit: "",
			steps: [],
			selectedStep: null,
			index: ""
		},

		helloWorld: function () {
			return 'Hello, World! Love ' + this.get('label');
		}

	});

/**
	 * Main collection for data usage
	 */
	var DataUsageCollection = Backbone.Collection.extend({ 
		model: DataUsage 
	});
	

/**
	 * Main collection for the devices.
	 */
	var DeviceCollection = Backbone.Collection.extend({ 
		model: Device
	});

	/**
	 * Main collection for the app.
	 */
	var UsageCalculatorCollection = Backbone.Collection.extend({
		
		model: UsageCalculator

	}); 

/**
	 * Encapsulates activities within a calculator.
	 */
	var UsageCalculatorActivityCollection = Backbone.Collection.extend({
		model: UsageCalculatorActivity
	});

/**
	 * Represents a summary view of ALL the calculators.
	 */
	var CalculatorSummaryView = Backbone.View.extend ({

		initialize: function (options) {
			this.eventDispatcher = options.eventDispatcher;
			this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.eventDispatcher, 'activitySelectedStepChange', this.render);
			this.template = _.template(options.templateHtml);
			this.count = options.count;
		},
		
		rePosition: function () {
			// FOR DESKTOP CALC ONLY
			$('#usageCalculatorApp.desktop .calculators .m-section:eq(' + this.count + ') .activities').append($('.meter_summary:eq(' + this.count + ')'));  
		},
		
		render: function () {
            // TODO Should this view be the one responsible for formatting the number?

			var data = { 
				type: this.model.get('type'),	
				title: this.model.get('summaryTitle'),
				amount: this.model.calculateMonthlyActivitySummary(),
				unit: this.model.get('unit1')
			};

			if(data.type === 'data') {
				// convert data unit from MB to GB 
				data.unit = data.amount < 1000 ? this.model.get('unit1') : this.model.get('unit2'); 
				data.amount = data.amount < 1000 ? this.numberWithCommas(data.amount) : data.amount / 1000;
				
				//show max 2 digits after decimal point if it's not a whole number
				if (data.amount % 1 != 0)
					data.amount = parseFloat(data.amount).toFixed(2).replace(/0{0,2}$/, "");
				
				// removal of trailing decimal point if it's an int and it has trailing decimal point 
				var len = data.amount.length;
				if ((data.amount).indexOf('.') === (data.amount.length-1)) {
					data.amount = data.amount.substr(0, (data.amount.length-1));
				} 
			}
			
			this.$el.html(this.template(data));

			// Return this to enable chained calls.
			return this;
		},

		/**
		 * Formatting function to turn 3152 into 3,152
		 *
		 * TODO Move into a helper object?
		 *
		 * @see http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
		 *
		 * @param x Integer
		 *
		 * @return {String} Formatted number
		 */
		numberWithCommas: function (x) {
		    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

	});

/**
	 * Render all calculators in the collection.
	 */
	var CalculatorView = Backbone.View.extend ({

		initialize: function (options) {
			this.eventDispatcher = options.eventDispatcher;
			this.listenTo(this.model, 'change', this.render);
			this.template = _.template(options.templateHtml); 
		},
		
		render: function () {

			var self = this;

			var data = this.model.toJSON(); 

			this.$el.html(this.template(data));
			this.$el.addClass(data.type);
			
			var $activities = this.$el.find('.activities');

			$activities.empty();

			// Render activity views into the calculator view
			this.model.get('activities').each(function (activity) {
				 
				// Dynamic view creation (slider|pillbox). Based on calc model property. See JSON.
				switch (data.displayMode) {

					case 'pillbox':
						var activityView = new PillboxActivityView({
							model: activity,
							eventDispatcher: self.eventDispatcher
						});
					break;

					case 'slider':
						var activityView = new SliderActivityView({
							model: activity,
							eventDispatcher: self.eventDispatcher
						});
					break;

					default:
						throw new Error('Invalid displayMode. Use pillbox|slider.');
					break;

				}

				$activities.append(activityView.render().el);

			});

			// Return this to enable chained calls.
			return this;

		}

	});

/**
	 * Represents a device listing view of all available devices.
	 */
	var DataUsageLegendView = Backbone.View.extend ({
		
		initialize: function (options) { 
			this.eventDispatcher = options.eventDispatcher;
			this.listenTo(this.model, 'change', this.render); 
			this.template = _.template(options.templateHtml);
		},
		
		render: function () { 
			var data = { 
				title: this.model.get('title'),	
				listing: this.model.get('listing'),
				details: this.model.get('details')
			} 
		
			this.$el.html(this.template(data));
			 
			// Return this to enable chained calls.
			return this;
		}
	
	});

/**
	 * Represents a device listing view of all available devices.
	 */
	var DeviceListingView = Backbone.View.extend ({
		events: {
			'click li' : 'deviceTypeClick'
		},
		
		initialize: function (options) {
			this.eventDispatcher = options.eventDispatcher;
			this.listenTo(this.model, 'change', this.render);
			//this.listenTo(this.eventDispatcher, 'activitySelectedStepChange', this.render);
			this.template = _.template(options.templateHtml); 
		},
		
		render: function () {
			var data = this.getModelData(); 
			this.$el.html(this.template(data));
			
			for(var i = 0; i<data.device.length; i++) {
				// highlight selected device
				if (data.device[i].className === data.deviceType) {
					this.$el.find('li').eq(i).addClass('is-selected');
					this.displayCalculator(data.device[i], 'show');
				} 
			} 
			
			// disable all slide if no device type is selected
			if (!data.deviceFlag) {
				
				$('.slider').slider("disable"); 
				
				//show calc mask
				$('.usageCalculator .calcMask').show();
			} 
			
			// Return this to enable chained calls.
			return this;
		},
		
		getModelData: function () {
			var data = { 
				device: this.model.get('device'),
				deviceQuery: this.model.get('deviceQuery'),
				deviceFlag: this.model.getCurrentDeviceType()[0],
				deviceType: this.model.getCurrentDeviceType()[1]
			}; 
			
			return data;
		},
	
		deviceTypeClick: function (e) {
			e.stopPropagation();
			
			//highlight the clicked device
			this.$el.find('li').removeClass('is-selected');
			$(e.target).closest('li').addClass('is-selected');
			
			//enable all slider 
			$('.slider').slider("enable"); 
			
			//hide calc mask
			$('.usageCalculator .calcMask').hide(); 
			
			var data = this.getModelData();
			var currIndex = $(e.target).closest('li').attr('dataindex');
			this.displayCalculator(data.device[currIndex], 'animate');
		},
		
		displayCalculator: function (d, action) {
			if (action === 'animate') {
				if (d.voice === true) { 
					$('.calculators .m-section.voice').slideDown(); 
				}
				else {
					$('.calculators .m-section.voice').slideUp();
				}
				
				if (d.data === true) {
					$('.calculators .m-section.data').slideDown(); 
				}
				else {
					$('.calculators .m-section.data').slideUp();
				}
			}
			else if (action === 'show') {
				if (d.voice === true) { 
					$('.calculators .m-section.voice').show(); 
				}
				else {
					$('.calculators .m-section.voice').hide();
				}
				
				if (d.data === true) {
					$('.calculators .m-section.data').show(); 
				}
				else {
					$('.calculators .m-section.data').hide();
				}
			}
			
			// display device suggestion 
			/*
			$('.deviceSuggestion').slideDown();
			$('.deviceSuggestion .deviceType').text(d.deviceName);
			*/ 
		}
		
	});

/**
	 * Represents a single activity within a calculator.
	 * A sub-view.
	 */
	var PillboxActivityView = Backbone.View.extend({

		tagName: 'div',
		className: 'activities-itemContainer',

		events: {
			// TODO Consider using touchend?
			'click .pillButtons a': 'handlePillboxClick'
		},

		initialize: function (options) {
			this.eventDispatcher = options.eventDispatcher;
			this.listenTo(this.model, 'change', this.render);
			this.template = _.template($('#usageCalculatorActivityPillboxTemplate').html());
		},

		render: function () {
			var data = this.model.toJSON();
			this.$el.html(this.template(data));
			// Return this to enable chained calls.
			return this;
		},

		/**
		 * User has clicked on a pillbox button. Update the model.
		 */
		handlePillboxClick: function (e) {
			
			e.preventDefault();

			var $elem = $(e.target);
 
			// toggle clicked element. 
			if($elem.hasClass('is-active')) { 
				$elem.removeClass('is-active');
				$elem.attr('data-val', 0);
			}
			else {
				this.$el.find('.pillButtons a').removeClass('is-active');
				$elem.addClass('is-active');
				$elem.attr('data-val', $elem.text()); 
			}   
			 
			// for voice only
			if(this.model.toJSON().unit.toLowerCase() === 'call' || this.model.toJSON().unit.toLowerCase() === 'minute') {
				var len = this.$el.find('.is-active').length;
				if(len == 0)
					this.$el.find('.hidden-msg').slideDown();
				else 
					this.$el.find('.hidden-msg').slideUp();
				
			} 
			
			// FIXME Evaluate if this will always be an integer? I think so. User simplicity.
			var selectedStep = parseInt($elem.attr('data-val'), 10);

			// Version #1: Update model and use events to re-render this view.
			// 'is-active' flag, instead of re-rendering the entire pillbox?
			//this.model.set('selectedStep', selectedStep);

			// Version #2: Silent version. Don't re-render entire view.
			// Make use of backbone's flexibility :)
			this.model.set(
				{ selectedStep: selectedStep }, 
				{ silent: true }
			);
			  
            // FIXME This will be (very mildly) inefficient because all CalculatorSummaryViews will recalculate 
            // when only one needs to.
            this.eventDispatcher.trigger('activitySelectedStepChange');
		}

	});

/**
	 * Companion to PillboxActivityView, except using sliders.
	 * TODO Share parent with pillbox view to re-use features.
	 */
	var SliderActivityView = Backbone.View.extend({ 
		tagName: 'div',
		className: 'activities-itemContainer',

		initialize: function (options) {
			this.eventDispatcher = options.eventDispatcher;
			this.listenTo(this.model, 'change', this.render);
			this.template = _.template($('#usageCalculatorActivitySliderTemplate').html()); 
		}, 
		
		render: function () {
			var self = this;
			var data = self.model.toJSON();
			self.$el.html(self.template(data)); 
			
			// initialize jquery UI slider
			var $slider = $('.slider', self.$el);
			$slider.slider({
				orientation: 'horizontal',
				range: 'min',
				min: data.range[0],
				max: data.range[1],
				slide: function (e, ui) {
					// update slider value to 'span.value'
					   
					var selectedStep = parseInt(ui.value, 10);
					self.setCalcReading(selectedStep, $(this)); 
					
					// set cookie value to track slider state
					var arr = $.cookie(sliderCookie);
					arr[data.index] = ui.value;
					$.cookie(sliderCookie, arr);
				}
			});
			 
			self.readCookie($slider, data.index);	
			$('.calcReset').on('click', {me: self}, self.handleResetClick); 
			
			// Return this to enable chained calls.
			return this;
		},  

		setCalcReading: function (sliderValue, $slider) { 
			$slider.next().find('.value').html(sliderValue);
			
			this.model.set(
				{ selectedStep: sliderValue }, 
				{ silent: true }
			);
			
			this.eventDispatcher.trigger('activitySelectedStepChange');
		},
		
		// this is not optimal, any better approach ??
		handleResetClick: function (e) {
			$('.slider').slider('value', 0);
			$('.slider').next().find('.value').text('0');
			
			e.data.me.model.set(
				{ selectedStep: 0 }, 
				{ silent: true }
			);

			e.data.me.eventDispatcher.trigger('activitySelectedStepChange');  
			e.data.me.resetCookie();
			
		},
		
		readCookie: function ($slider, index) {
			if ($.cookie(sliderCookie) != null && $.cookie(counterCookie) === 0) { 
				var arr = $.cookie(sliderCookie);
				arr.splice(0, 0, 0);
				$.cookie(sliderCookie, arr); 
			}			
			else {
				var value = parseInt($.cookie(sliderCookie)[index], 10);
				$slider.slider('value', $.cookie(sliderCookie)[index]);  
				
				this.setCalcReading(value, $slider);  
			} 
		},
		
		// reset values in cookie array to 0
		resetCookie: function () {
			if ($.cookie(sliderCookie) != null) {
				var arr = $.cookie(sliderCookie);
				for(var i = 0; i < arr.length; i++) {
					arr[i] = 0;
				}
				$.cookie(sliderCookie, arr);
			} 
		}
	});

var usageCalculatorCollection = null;
var sliderCookie = 'sliderState';
var counterCookie = 'counterCookie';

(function (window, undefined) {

	var $ = window.jQuery;
 
	
	/**
	 * Initialize app with usageCalculatorData loaded from server.
	 */
	$(function () {

		//cookie creation 
		$.cookie.json = true;
		if($.cookie(sliderCookie) == null) { 
			$.cookie(sliderCookie, []);
			$.cookie(counterCookie, 0); 
		}
		else { 
			var counter = $.cookie(counterCookie) + 1;
			$.cookie(counterCookie, counter);
		}
		//console.log($.cookie(sliderCookie));
		 
		
		// Avoid using this like a god-object, instead, inject it into objects during construction.
		var eventDispatcher = _.clone(Backbone.Events);

		//console.log("Ready with usageCalculatorData:", usageCalculatorData);
		var $appElem 			= $('#usageCalculatorApp');
		var $appCalculatorsElem = $appElem.find('.calculators');
		var $appSummaryElem 	= $appElem.find('.usageMeterSummaryDisplay');
		var $appDeviceElem      = $appElem.find('.deviceListing');
		var $dataUsageElem      = $appElem.find('.dataUsageLegend');

		// Pass array of models
		usageCalculatorCollection = new UsageCalculatorCollection(usageCalculatorData.calculators);
		deviceCollection = new DeviceCollection(usageCalculatorData.devices);
		dataUsageCollection = new DataUsageCollection(usageCalculatorData.dataUsage);
		
		// Clear out any comments etc.
		$appCalculatorsElem.empty();
		$appSummaryElem.empty();
		$appDeviceElem.empty();
		$dataUsageElem.empty();

		// Load templates into strings
		var calcViewTplHtml     = $('#usageCalculatorTemplate').html();
		var calcSumViewTplHtml  = $('#calculatorSummaryViewTemplate').html();
		var deviceTypeTplHtml   = $('#DeviceTypeViewTemplate').html();
		var dataUsageTplHtml    = $('#dataUsageLegendViewTemplate').html();

		// Iterate over the collection of "calculators" (data, voice) and create 2 views (with sub-views).
		var count = 0;
		usageCalculatorCollection.each(function (calc) { 
			// Calculator view
			var calcView = new CalculatorView({
				model: calc,
				tagName: 'div',
				className: 'm-section',
				templateHtml: calcViewTplHtml,
				eventDispatcher: eventDispatcher
				//deviceFlag: deviceFlag	// FOR DESKTOP ONLY: boolean value to tell if a device type is selected
				
			}); 
			$appCalculatorsElem.append(calcView.render().el);  

			// Summary view 
			var summaryView = new CalculatorSummaryView({
				model: calc,
				tagName: 'div',
				className: 'meter_summary',
				templateHtml: calcSumViewTplHtml,
				eventDispatcher: eventDispatcher,
				count: count++
			}); 
			$appSummaryElem.append(summaryView.render().el);
			$appSummaryElem.append(summaryView.rePosition()); 
			// FIXME Uncertain about performance for this, vs rendering all html for a collection at once, then appending once.
			// Perhaps a view can render and cache it's html string, then we can assemble outside?
			
		});
		
		// DESKTOP ONLY: Iterate over the device collection (mobile, tablet, modem) and create view 
		deviceCollection.each(function (device) {
			//Device view
			var deviceView = new DeviceListingView({
				model: device,
				tagName: 'ul', 
				templateHtml: deviceTypeTplHtml,
				eventDispatcher: eventDispatcher
				//deviceType: deviceType  // FOR DESKTOP ONLY: get preload device type
			});	
			$appDeviceElem.append(deviceView.render().el);  
		});
		
		//DESKTOP ONLY: listing data usage legend view 
		dataUsageCollection.each(function (dataUsage) {
			var dataUsageView = new DataUsageLegendView({
				model: dataUsage,
				tagName: 'div',
				templateHtml: dataUsageTplHtml,
				eventDispatcher: eventDispatcher
			}); 
			$dataUsageElem.append(dataUsageView.render().el); 
		});  		
	});

}(window));