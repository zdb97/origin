/**
 * bbUsageCalculatorApp
 * Rewrite of the original by Yinan (sheet, man!).
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

		initialize: function () {
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
			// Return this to enable chained calls.
			return this;
		},

		/**
		 * User has clicked on a pillbox button. Update the model.
		 */
		handlePillboxClick: function (e) {
			
			e.preventDefault();

			var $elem = $(e.target);

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

			// Switch the is-active class to the clicked element.
			this.$el.find('.pillButtons a').removeClass('is-active');
			$elem.addClass('is-active');

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

				// TODO Dynamic view creation (slider|pillbox).
				var activityView = new PillboxActivityView({
					model: activity,
					eventDispatcher: self.eventDispatcher
				});

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
				title: this.model.get('summaryTitle'),
				amount: this.model.calculateMonthlyActivitySummary(),
				unit: this.model.get('unit')
			};

			// TODO Pluralise unit based on raw number

			data.amount = this.numberWithCommas(data.amount);

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

		// Iterate over the collection of "calculators" (data, voice) and create 2 views (with sub-views).
		usageCalculatorCollection.each(function (calc) {

			// Calculator view
			var calcView = new CalculatorView({
				model: calc,
				tagName: 'div',
				className: 'm-section',
				templateHtml: $('#usageCalculatorTemplate').html(),
				eventDispatcher: eventDispatcher
			});
			$appCalculatorsElem.append(calcView.render().el);

			// Summary view
			var summaryView = new CalculatorSummaryView({
				model: calc,
				tagName: 'div',
				className: 'meter_summary',
				templateHtml: $('#calculatorSummaryViewTemplate').html(),
				eventDispatcher: eventDispatcher
			});
			$appSummaryElem.append(summaryView.render().el);

			// FIXME Uncertain about performance for this, vs rendering all html for a collection at once, then appending once.
			// Perhaps a view can render and cache it's html string, then we can assemble outside?
			
		});

	});

}(window));