/*global Backbone*/
var DataUsageSliderModel = Backbone.Model.extend({

	initialize: function () {
		//console.log("usage slider model init");
	},

    defaults: {
        label: null,
        min: 0,
        max: 0,
        unit: null,
        dataPerUnit: 0,
        type: null
    }

});

/*global Backbone*/
var DataUsageCalculatorMeterModel = Backbone.Model.extend({

	initialize: function () {
		//console.log("meterModelCreated");
		//console.log(this.get("min"));
	},

	defaults: {
		min: 0,
		max: 0,
		marks: []
	}
});
/*global Backbone DataUsageSliderModel*/
var DataUsageSlidersCollection = Backbone.Collection.extend({

	model: DataUsageSliderModel,

	initialize: function () {
		
	}

});
/*global _ Backbone $*/
var DataUsageCalculatorSlidersView = Backbone.View.extend({
	
	initialize: function () {
		this.template = _.template($("#usageSliderTemplate").html());
		this.render();
		this.enableSlider();
		//find the calculator reset
		this.$resetCalculatorControl = $("#resetCalculatorBtn");
		this.enableCalReset();
	},

	el: "#bb_usage_sliders",

	render: function () {
		var self = this;
		self.$el.empty();
		_.each(self.collection.models, function (model) {
			var html = self.template(model.toJSON());
			self.$el.append(html);
		});
	},

	enableSlider: function () {
		
		var self = this;

		this.$el.find(".bb_dataUsageSlider").each(function () {
			
			var $slider = $(this).find(".fn-slider");

			var range = $slider.attr("data-range").split(","),
				max = Math.max.apply(Math, range),
				min = Math.min.apply(Math, range),
				$display = $(this).find(".display .num"),
				$filterValue = $(this).find(".filterValue");
			
			//$slider.data("amountPerUnit",)
			
			$slider.slider({
				range: "min",
				min: min,
				max: max,
				orientation: "horizontal",
				animate: true,
				slide: function (event, ui) {
					$display.text(ui.value);
					$filterValue.val(ui.value);
				},
				stop: function (event, ui) {
					var usage = self.calculateDataSum();
					$(window).trigger("bb_updateDataUsageMeter", [ usage ]);
				}
			});
			
		});
	},

	calculateDataSum: function () {
		var sum = 0;
		this.$el.find(".bb_dataUsageSlider").each(function () {
			var amount = parseFloat($(this).find(".filterValue").val());
			var amountPerUnit = parseFloat($(this).find(".fn-slider").attr("data-amount-per-unit"));
			var data = amount * amountPerUnit;
			sum += data;
		});
		return sum;
	},

	enableCalReset: function () {
		var self = this;
		var $resetButton = this.$resetCalculatorControl;
		$resetButton.click(function (e) {
			e.preventDefault();
			self.$el.find(".num").each(function () {
				$(this).html("0");
			});
			self.$el.find(".fn-slider").each(function () {
				$(this).slider("value", 0);
			});
			$(window).trigger("bb_updateDataUsageMeter", [ 0 ]);
		});
	}
	
});
/*global console _ Backbone $*/
/**
 *
 */
var GenericUsageCalculatorSliderView = Backbone.View.extend({
	
	initialize: function () {

		var self = this;
		
		//this is a custom backbone view attributes to decide which type of the slider are 
		//base on the slider Type, the calculation are different
		this.sliderType = this.options.sliderType;
		this.unit = this.options.unit;
		
		//render elements using templates
		this.template = _.template($("#usageSliderTemplate").html());
		
		this.render();
		
		this.enableSlider();

		//find the calculator reset
		// FIXME Sigh another globally referenced element.
		this.$resetCalculatorControl = $("#resetCalculatorBtn");
		this.enableCalReset();

		// FIXME We need a new view for the "summary". And probably a parent 'app'-ish view.
		//this.$meterSummary = this.$el.parents('.calculator_section:first').find('.meter_summary');
		this.$meterSummary = $('.' + this.sliderType + '_meter_summary');

		// FIXME SM 06Feb12: Listen for the update event
		this.$el.bind('bb_updateVoiceUsageMeter', function (event, usage) {
			self.updateText(usage);
		});
		this.$el.bind('bb_updateDataUsageMeter', function (event, usage) {
			self.updateText(usage);
		});
	},

	//el will be passed by constructor 
	//el:"#bb_usage_sliders",
	render: function () {
		var self = this;
		self.$el.empty();
		_.each(self.collection.models, function (model) {
			var html = self.template(model.toJSON());
			self.$el.append(html);
		});
	},

	enableSlider: function () {
		var self = this;
		if (self.sliderType === "voice") {
			self.enableVoiceSlider();
		} else if (self.sliderType === "data") {
			self.enableDataSlider();
		} else {
			console.error("Slider type: " + self.sliderType + "is not supported");
			return false;
		}
	},

	enableVoiceSlider: function () {
		//console.log("TODO:voice slider");
		var self = this;
		
		var $freqSelector = $("#voiceSliderFrequency");
		
		$freqSelector.change(function () {
			self.displayUsage(this, self.$el);
		});
		
		this.$el.find(".generic_usage_slider").each(function () {
			
			var $slider = $(this).find(".fn-slider");
			var range = $slider.attr("data-range").split(","),
				max = Math.max.apply(Math, range),
				min = Math.min.apply(Math, range),
				$display = $(this).find(".variable_display .num"),
				$filterValue = $(this).find(".filterValue");
			
			
			$slider.slider({
				min: min,
				max: max,
				range: "min",
				orientation: "horizontal",
				animate: true,
				slide: function (event, ui) {
					//see if it's a time slider or call slider
					
					if ($(event.target).attr("id") === "usage_slider_time") {
						$display.html(self.displayTimeText(ui.value));
					} else {
						$display.html(self.displayCallsText(ui.value));
						self.displayUsage($freqSelector, $display);
					}
					
					$filterValue.val(ui.value);
				},
				stop: function (event, ui) {
					var usage = self.calculateVoiceSum();
					// console.log("GenericUsageCalculatorSliderView enableVoiceSlider stop - usage:", usage);
					//$(window).trigger("bb_updateVoiceUsageMeter", [ usage ]);
					self.$el.trigger("bb_updateVoiceUsageMeter", [ usage ]);
				}
			});
		});
	},

	enableDataSlider: function () {
		var self = this;
		
		var $freqSelector = $("#dataSliderFrequency");
		
		$freqSelector.change(function () {
			self.displayUsage(this, self.$el);
		});
		
		this.$el.find(".generic_usage_slider").each(function () {
			
			var $slider = $(this).find(".fn-slider");
			var range = $slider.attr("data-range").split(","),
				max = Math.max.apply(Math, range),
				min = Math.min.apply(Math, range),
				$display = $(this).find(".variable_display .num"),
				$filterValue = $(this).find(".filterValue");
			
			//$slider.data("amountPerUnit",)
			$slider.slider({
				min: min,
				max: max,
				range: "min",
				orientation: "horizontal",
				animate: true,
				slide: function (event, ui) {
					$display.html("<span class='per-day'>" + ui.value + "</span> <span class='per-month'>" + (ui.value * 30) + "</span>");
					self.displayUsage($freqSelector, $display);
					$filterValue.val(ui.value);
				},
				stop: function (event, ui) {
					self.$el.trigger("bb_updateDataUsageMeter", [ self.calculateDataSum() ]);
				}
			});
			
		});
	},

	/**
	 *
	 */
	calculateDataSum: function () {
		
		var sum = new Number(0);

		this.$el.find(".generic_usage_slider").each(function () {

			var $elem = $(this);

			var amount = parseFloat($elem.find(".filterValue").val());
			
			var amountPerUnit = parseFloat($elem.find(".fn-slider").attr("data-amount-per-unit"));
			
			sum += (amount * amountPerUnit);

			console.log('calculateDataSum amount:', amount, 'amountPerUnit:', amountPerUnit, 'sum:', sum);

		});

		// this is a daily usage, so x 30  
		// FIXME 03Dec12: x30 eh? :)
		// SM 11Feb13: Round to nearest
		sum = sum * 30;

		return sum.toFixed(2);
	},

	/**
	 * SM 11Feb13: For the voice slider summary.
	 */
	calculateVoiceSum: function () {


		var calls	= parseInt(this.$el.find("#call_display > .num > span:visible").text(), 10);
		var sec		= parseFloat(this.$el.find("#time_display .num").text());

		//this is a daily usage, so x 30
		// FIXME 03Dec12: x30 eh? :)
		var sum = Math.round(calls * sec * 30);

		console.log('calculateVoiceSum calls:', calls, 'sec:', sec, 'sum:', sum);
		
		return this.convertSecondsToMins(sum);
	
	},

	enableCalReset: function () {
		var self = this;
		var $resetButton = self.$resetCalculatorControl;
		$resetButton.click(function (e) {
			e.preventDefault();
			self.$el.find(".num").each(function () {
				$(this).html("0");
			});
			self.$el.find(".filterValue").each(function () {
				$(this).val("0");
			});
			self.$el.find(".num.time_value").each(function () {
				$(this).html("00.00");
			});
			self.$el.find(".fn-slider").each(function () {
				$(this).slider("value", 0);
			});
			self.$el.trigger("bb_updateVoiceUsageMeter", [ 0 ]);
			self.$el.trigger("bb_updateDataUsageMeter", [ 0 ]);
		});
	},
	
	displayTimeText: function (value) {
		
		var self = this;
		return self.convertSecondsToMins(value);

	},

	// FIXME too dumb
	displayCallsText: function (value) {
		return "<span class='per-day'>" + value + "</span> <span class='per-month'>" + (value * 30) + "</span>"; //value + " /day <span class='small'>(" + value * 30 + "/month)</span>";
	},
	
	displayUsage: function (selector, display) {
		if ($(selector).val() === 'day') {
			display.find('.per-month').hide();
			display.find('.per-day').show();
		} else {
			display.find('.per-month').show();
			display.find('.per-day').hide();
		}
	},
	
	/**
	 *
	 */
	convertSecondsToMins: function (seconds) {

		var mins = Math.round(parseInt(seconds / 60, 10));
		var secs = Math.round(seconds % 60);
		var time = (mins < 10 ? "0" + mins : mins) + "." + (secs  < 10 ? "0" + secs : secs);

		return time;
	},

	/**
	 * SM 06Feb12: Quick implementation for mobile.
	 * TODO Move out into a separate view.
	 */
	updateText: function(usage) {
		this.$meterSummary.find('.number').text(usage);
	},

	/**
	 * TODO SM 11Feb13: Call this when changing frequency.
	 */
	updateUnit: function(unit) {
		this.unit = unit;
		this.$meterSummary.find('.unit').text(unit);
	}

});
/*global _ Backbone $*/
/**
 *
 */

var DataUsageCalculatorMeterView = Backbone.View.extend({

	initialize: function () {
		// console.log("meter init");
		this.initMeter();
		this.watchingChange();
	},
	
	el: "#bb_dataUsageMeterViewPort",
	
	initMeter: function () {
		this.$meter = this.$el.find(".usage_meter_bar");
		this.$viewPort = this.$el;
		this.$floatingMark = this.$el.find(".usage_meter_floating_mark");
		this.$meterContainer = this.$el.find(".usage_meter_wrap");
		
		this.basePosition = 10;
	},
	
	watchingChange: function () {
		var self = this;
		$(window).bind("bb_updateDataUsageMeter", function (event, dataAmount) {
			// console.log("DataUsageCalculatorMeterView bb_updateDataUsageMeter dataAmount:", dataAmount);
			self.animateMeter(dataAmount);
			self.updateText(dataAmount);
		});
	},

	updateText: function (dataAmount) {
		//will discuss with back end on 1000 or 1024
		var displayTxt;
		if (dataAmount < 1000) {
			displayTxt = dataAmount.toFixed(0) + "MB";
		} else {
			displayTxt = (dataAmount / 1000).toFixed(2) + "GB";
		}
		this.$floatingMark.find(".number").text(displayTxt);
	},

	animateMeter: function (dataAmount) {

		//total amount in the meter is 5G 5000MB
		var percent = dataAmount / 5000;
		var outterHeight = this.$meterContainer.height();
		var targetHeight = parseInt(outterHeight * percent, 10); // SM 30Nov12: Don't forget the radix,
		var viewPortHeight = this.$viewPort.height();
		
		//shift the meter if needed 
		
		if (targetHeight > (viewPortHeight - 20)) {

			//console.log("time to shift meter");
			this.$meterContainer.animate({
				bottom: -130
			}, 200);

		} else {

			this.$meterContainer.animate({
				// 10px is for the bottom spacing
				bottom: 10
			}, 200);

		}

		//animate the bar
		this.$meter.animate({
			height: targetHeight
		}, 500);

		//animate the float mark
		this.$floatingMark.animate({
			bottom: targetHeight
		}, 500);
	}

});
/*global _ Backbone $*/
/**
 *
 */
var GenericUsageCalculatorMeterView = Backbone.View.extend({

	// el will be passed by parameter

	initialize: function () {
		this.max = this.model.get("max");
		this.min = this.model.get("min");
		this.unit = this.model.get("unit");
		//TODO:deal with the marks later, will come up some more idea
		//eventually the marks should be populated via js, (now its hard coded in html)
		this.marks = this.model.get("marks");
		//this is the value to decide when we should start showing 'Timeless' on the meter
		this.timeless = 650;

		// Pass in the name of the event to listen for, in order to update the meter.
		this.registerEvent = this.options.registerEvent;

		//init and start watching change
		this.initMeter();
		this.watchingChange();
	},

	initMeter: function () {
		//element need to be animated;
		this.$meter				= this.$el.find(".usage_meter_bar");
		this.$viewPort			= this.$el.parents(".usage_meter");
		this.$floatingMark		= this.$el.find(".usage_meter_floating_mark");
		this.$meterContainer	= this.$el.find(".usage_meter_wrap");
		this.$meterText			= this.$el.find(".number");
	},

	watchingChange: function () {
		var self = this;
		$(window).bind(self.registerEvent, function (event, dataAmount) {
			// console.log("GenericUsageCalculatorMeterView registerEvent triggered - dataAmount:", dataAmount);
			self.animateMeter(dataAmount);
			self.updateText(dataAmount);
		});
	},

	updateText: function (dataAmount) {
		var self = this;
		this.$meterText.text(dataAmount + " " + self.unit);
		if (dataAmount > self.timeless) {
			this.$meterText.text("Timeless");
		}
	},

	animateMeter: function (dataAmount) {
		var self = this;
		
		var percent = (parseInt(dataAmount, 10) / parseInt(self.max, 10)).toFixed(2);
				
		if (percent >= 1) {
			percent = 1;
		}
		
		var outterHeight = this.$meterContainer.height();
		var targetHeight = parseInt(outterHeight * percent, 10);
		
		//animate the bar
		this.$meter.animate({
			height: targetHeight
		}, 500);

		//animate the float mark
		this.$floatingMark.animate({
			bottom: targetHeight
		}, 500);
		
	}

});
/*global DataUsageSlidersCollection GenericUsageCalculatorSliderView DataUsageCalculatorMeterView DataUsageCalculatorMeterModel GenericUsageCalculatorMeterView*/
/*global dataUsageCalculatorMock voiceUsageCalculatorMock voiceCalculatorMeterViewMock*/
/**
 * Plugin to bootstrap backbone plan view &  popular plan views.
 *
 * SM 28Nov12: Tidied things up a bit.
 *
 * TODO SM 28Nov12: Separate this into 2 plugins: planBuilder.js and usageCalculator.js.
 * FIXME SM 28Nov12: Better way to dynamically create objects from data? BackboneLoader.js?
 */
(function (window, undefined) {

	var $ = window.jQuery;

	/**
	 * Initialise the data usage calculator
	 */
	function initUsageCalculator(dataUsageCalculator, voiceUsageCalculator, voiceCalculatorMeterView) {

		// console.log('*** initUsageCalculator dataUsageCalculator:', dataUsageCalculator, 'voiceUsageCalculator:', voiceUsageCalculator, 'voiceCalculatorMeterView:', voiceCalculatorMeterView);

		// data sliders backbone collection
		var dataUsageSlidersCollection = new DataUsageSlidersCollection(dataUsageCalculator);

		// data slider view
		var dataUsageCalculatorSlidersView = new GenericUsageCalculatorSliderView({
			collection : dataUsageSlidersCollection,
			el : '#bb_data_sliders',
			sliderType : 'data',
			unit: 'MB'
		});

		// data usage meter view
		var dataUsageCalculatorMeterView = new DataUsageCalculatorMeterView();

		//----------------------------------------------------------------------

		// call sliders backbone collection
		var voiceUsageSlidersCollection = new DataUsageSlidersCollection(voiceUsageCalculator);
		var voiceUsageCalculatorMeterModel = new DataUsageCalculatorMeterModel(voiceCalculatorMeterView);

		// call slider view
		var voiceUsageCalculatorSlidersView = new GenericUsageCalculatorSliderView({
			collection : voiceUsageSlidersCollection,
			el : '#bb_voice_sliders',
			sliderType : 'voice',
			unit: voiceCalculatorMeterView.unit
		});

		// voice usage meter view
		var voiceUsageCalculatorMeterView = new GenericUsageCalculatorMeterView({
			model : voiceUsageCalculatorMeterModel,
			el : '#bb_voiceUsageMeterViewPort',
			registerEvent : 'bb_updateVoiceUsageMeter'
		});

	}

	// TODO SM 06Feb13: Load automatically on page load? Needed?
	$(document).ready(function () {
		$(window).trigger('bbInitUsageCalculator');
	});

	// SM 06Feb12: Custom event to load this app whenever we like.
	// TODO Some cleaner separation would be nice. Bound to an element id, passing in specific data, etc.
	$(window).bind('bbInitUsageCalculator', function () {
		initUsageCalculator(dataUsageCalculatorMock, voiceUsageCalculatorMock, voiceCalculatorMeterViewMock);		
	});
	
}(window));