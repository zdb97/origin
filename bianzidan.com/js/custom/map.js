(function (window, undefined) {

	var $ = window.jQuery;
	
	/*
	 * place model
	 */
	var placeModel =  Backbone.Model.extend({
		defaults: {
			city: 	"",
			lat: 	"",
			lng: 	"",
			time_of_first_arrival:	"",
			country:	"",
			image: 	"",
			index: ""
		},
		
		initialize: function () {
			console.log('placeModel initialized: ', this.toJSON());
		}
	});

	/*
	* place collection
	*/
     var placeCollection = Backbone.Collection.extend({

        model: placeModel,
		url: "json/map.json",	// url ralative to html page
		
		initialize: function () {
			console.log('placeCollection initialized'); 
			
			this.on("add", this.addModel, this);
			this.on("remove", this.removeModel, this);
			this.on("reset", this.resetModel, this);
		},
		
		/* 
		 * parse is called by Backbone whenever a collection's models are returned by the server, in fetch
		 * The function is passed the raw response object, and should return the array of model attributes to be added to the collection.
		 */
		parse: function (response) {
			return response.places;
		},
		
		addModel: function () {
		},
		
		removeModel: function () {
			console.log("placeCollection model removed, models count: ", this.models.length);
		},
		
		resetModel: function () {
			console.log("placeCollection model resetted");
		}
		
	});
	
	
	/*
	 * place list view
	 */
	 var placeListView = Backbone.View.extend({
		template: _.template($("#place-item").html()),
		
		events: {
			"click .mapLink": "listItemClick"
		}, 
		
		initialize: function (options){
			//this.setElement($('ul.place-list'));
			console.log("place view initialized: ", options);
			
			this.collection = options.collection; 
			this.map = options.map;
			this.el = options.el;
			this.render();
		},
		
		render: function () {
			var self = this;
			
			self.collection.fetch({
				// fetch the json url and returns the collection by (collection.parse)
				success: function (collection, response) {
					console.log("fetch json url： ", collection);
					
					// add data collection to view template
					self.addCollectionDataToTemplate();
					self.map.render();
				},
				error: function () {
					console.error("fetching error....");
				}
			});
			
			return this;
		},
		
		addCollectionDataToTemplate: function () {
			var self = this;
			var html = "";
			
			_.each(self.collection.models, function(model, index) {
				// set index value of model at run time
				model.set({index: self.collection.indexOf(model)});
			
				html += self.template(model.toJSON());
			});
			
			self.$el.append(html);
		},
		
		listItemClick: function (e) {
			//this.map.setMapCenter([$(e.target).attr("lat"), $(e.target).attr("lng")]);
			this.map.setMapCenter($(e.target).attr("index"));
		}
	 });
	 
	 /*
	  * map view
	  */
	var mapView = Backbone.View.extend({
	
		map: null,
		
		//constant
		ZOOM: 12,
		
		initialize: function (options) {	
			console.log("map view initialized."); 
			 
			this.collection = options.collection; 
			this.el = options.el;
			this.inputField = options.inputField;
		},
		
		render: function () {
			var myPosition = new google.maps.LatLng(parseFloat(this.getDisplayModel().toJSON().lat), parseFloat(this.getDisplayModel().toJSON().lng));
			
			var mapOptions = {
				center: myPosition,
				zoom: this.ZOOM,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			  };
			
			//initialize google map
			this.map = new google.maps.Map(this.$el.get(0), mapOptions);
			// initialize google map marker
			this.addMarkerToMap(myPosition);
		 
			// google auto complete 
			/*
			var input = $(this.inputField).get(0);
			var autocompleteOptions = {
				types: ['(cities)'],
				componentRestrictions: {country: 'au'}
			};	
			var autocomplete = new google.maps.places.Autocomplete(input, autocompleteOptions);

			//autocomplete.bindTo('bounds', map);
			google.maps.event.addListener(autocomplete, 'place_changed', this.changeLocation);
			*/
			return this;
		},
		
		addMarkerToMap: function (position) {
			var marker = new google.maps.Marker({
				position: position,
				map: this.map,
				title: this.collection.models[0].get("city")
			});
		},
		
		getDisplayModel: function () {
		    return _.find(this.collection.models, function (model, index) {
				return (model.get("show_on_map") === "true");
			});
		},
		
		setMapCenter: function (index) {
			var lat = this.collection.models[index].get("lat");
			var lng = this.collection.models[index].get("lng");
			var myPosition = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
			
			this.map.setCenter(myPosition);
			this.addMarkerToMap(myPosition);
		}
	});
	
	 
	
	// controllers
	var dataCollection = new placeCollection();
	
	var mapview = new mapView({
		collection: dataCollection,
		el: "div#map-canvas",
		inputField: "#searchTextField"
	});
	
	var placelistview = new placeListView({
		collection: dataCollection,
		map: mapview,
		el: "ul.place-list"
	});
	
	
	
/*
	google map api: https://developers.google.com/maps/documentation/javascript/reference?csw=1#ComponentRestrictions
*/	
}(window));


