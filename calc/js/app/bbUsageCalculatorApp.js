/**
 * bbUsageCalculatorApp
 */

// FIXME God object during dev.
var usageCalculatorCollection = null;

(function (window, undefined) {

	var $ = window.jQuery;

	//--------------------------------------------------------------------------
	// Data model
	//--------------------------------------------------------------------------

	/**
	 * Represents a single "activity" within a calculator.
	 */
	var UsageCalculatorActivity = Backbone.Model.extend({
	 	
		defaults: {
			title: "",
			unit: "",
			steps: [],
			selectedStep: null
		},

		helloWorld: function () {
			return 'Hello, World! Love ' + this.get('label');
		}

	});

	/**
	 * Encapsulates activities within a calculator.
	 */
	var UsageCalculatorActivityCollection = Backbone.Collection.extend({
		model: UsageCalculatorActivity
	});

	/**
	 * Represents a single calcuat
	 */
	var UsageCalculator = Backbone.Model.extend({

		defaults: {
	 		title: '',
	 		summaryTitle: '',
	 		type: '',
	 		unit: '',
	 		kbPerUnit: null,
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

        	var kbPerUnit = this.get('kbPerUnit');

    		var total = 0;

    		this.get('activities').each(function (activity) {

    			var multiplier = kbPerUnit[activity.get('unit')];

    			// Convert to MB for summary display.
    			// Using 1024 notation.
    			total = total + ((activity.get('selectedStep') * multiplier) / 1024);

            });

            return total;
        }

	});

	/**
	 * Main collection for the app.
	 */
	var UsageCalculatorCollection = Backbone.Collection.extend({
		
		model: UsageCalculator

	});

	//--------------------------------------------------------------------------
	// Views
	//--------------------------------------------------------------------------

	/**
	 * Companion to PillboxActivityView, except using sliders.
	 * TODO Share parent with pillbox view to re-use features.
	 */
	var SliderActivityView = Backbone.View.extend({

		tagName: 'div',
		className: 'activities-itemContainer',

		events: {
			// TODO Slider events from jQuery UI
		},

		initialize: function (options) {
			this.eventDispatcher = options.eventDispatcher;
			this.listenTo(this.model, 'change', this.render);
			this.template = _.template($('#usageCalculatorActivitySliderTemplate').html());
		},

		render: function () {
			var data = this.model.toJSON();
			this.$el.html(this.template(data));
			// Return this to enable chained calls.
			return this;
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
			
			$('.calcReset').on('touchstart MSPointerDown', {me: this}, this.handleResetClick);
			$('.calcReset').on('mousedown', {me: this}, this.handleResetClick);
			
			// Return this to enable chained calls.
			return this;
		},
		
		// this is not optimal, any better approach ??
		handleResetClick: function (e) {
			e.preventDefault();

			e.data.me.$el.find('.pillButtons a.is-active').removeClass('is-active');
			e.data.me.$el.find('.pillButtons a.is-active').attr('data-val', 0);
				
			e.data.me.model.set(
				{ selectedStep: 0 },
				{ silent: true }
			);

			e.data.me.eventDispatcher.trigger('activitySelectedStepChange');
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
	 * Render all calculators in the collection.
	 */
	var CalculatorView = Backbone.View.extend({

		initialize: function(options) {
			
			this.eventDispatcher = options.eventDispatcher;
			this.listenTo(this.model, 'change', this.render);
			this.template = _.template(options.templateHtml);

		},

		render: function () {

			var self = this;

			var data = this.model.toJSON();

			this.$el.html(this.template(data));

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
	 * Represents a summary view of ALL the calculators.
	 */
	var CalculatorSummaryView = Backbone.View.extend({

		initialize: function(options) {
			this.eventDispatcher = options.eventDispatcher;
			this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.eventDispatcher, 'activitySelectedStepChange', this.render);
			this.template = _.template(options.templateHtml);
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
				
				if ( data.amount > 1024) {
					// unit: GB
					data.unit = this.model.get('unit2');
					// convert data in GB unit
					data.amount = data.amount / 1024;
					// show max 2 decimal point numbers
					data.amount = parseFloat(data.amount).toFixed(2).replace(/0{0,2}$/, "");
				}
				else {
					// unit: MB
					data.unit = this.model.get('unit1'); 
					// rounding to whole number
					data.amount = Math.round(data.amount);
				}
				
				// removal of decimal point if its a whole number 
				if (data.amount % 1 == 0) {
					data.amount = parseInt(data.amount);
				}
				
				// format to number greater than 1,000
				data.amount = data.amount > 1000 ? this.numberWithCommas(data.amount) : data.amount;	
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
	 * Initialize app with usageCalculatorData loaded from server.
	 */
	$(function () {

		// Avoid using this like a god-object, instead, inject it into objects during construction.
		var eventDispatcher = _.clone(Backbone.Events);

		//console.log("Ready with usageCalculatorData:", usageCalculatorData);
		var $appElem 			= $('#usageCalculatorApp');
		var $appCalculatorsElem = $appElem.find('.calculators');
		var $appSummaryElem 	= $appElem.find('.usageMeterSummaryDisplay');

		// Pass array of models
		usageCalculatorCollection = new UsageCalculatorCollection(usageCalculatorData.calculators);

		// Clear out any comments etc.
		$appCalculatorsElem.empty();
		$appSummaryElem.empty();

		// Load templates into strings
		var calcViewTplHtml = $('#usageCalculatorTemplate').html();
		var calcSumViewTplHtml = $('#calculatorSummaryViewTemplate').html();

		// Iterate over the collection of "calculators" (data, voice) and create 2 views (with sub-views).
		usageCalculatorCollection.each(function (calc) {

			// Calculator view
			var calcView = new CalculatorView({
				model: calc,
				tagName: 'div',
				className: 'm-section',
				templateHtml: calcViewTplHtml,
				eventDispatcher: eventDispatcher
			});
			$appCalculatorsElem.append(calcView.render().el);

			// Summary view
			var summaryView = new CalculatorSummaryView({
				model: calc,
				tagName: 'div',
				className: 'meter_summary',
				templateHtml: calcSumViewTplHtml,
				eventDispatcher: eventDispatcher
			});
			$appSummaryElem.append(summaryView.render().el);

			// FIXME Uncertain about performance for this, vs rendering all html for a collection at once, then appending once.
			// Perhaps a view can render and cache it's html string, then we can assemble outside?
			
		});

	});

}(window));