(function (window, undefined) {

	var $ = window.jQuery;
	
	/*
	 * place model
	 */
	var placeModel =  Backbone.Model.extend({
		defaults: {
			city: 	"",
			lat: 	"",
			lon: 	"",
			time_of_arrival:	"",
			country:	"",
			image: 	""
		},
		
		initialize: function () {
			console.log('placeModel loaded: ', this.toJSON());
		}
	});

	/*
	* place collection
	*/
     var placeCollection = Backbone.Collection.extend({

        model: placeModel,
		url: "json/map.json",	// url ralative to html page
		
		initialize: function () {
			console.log('placeCollection loaded'); 
			
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
			console.log("placeCollection model added, models count: ", this.models.length);
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
			"click #mapLinks": "listItemClick"
		}, 
		
		initialize: function (options){
			//this.setElement($('ul.place-list'));
			console.log("place view initialized");
			
			this.collection = options.collection; 
			this.el = options.el;
			this.render();
		},
		
		render: function () {
			var self = this;
			
			self.collection.fetch({
				// fetch the json url and returns the collection by (collection.parse)
				success: function (collection, response) {
					console.log("fetch json url： ", collection);
					
					self.addCollectionDataToTemplate();
					
					var mapview = new mapView({
						collection: collection,
						el: "div#map-canvas",
						inputField: "#searchTextField"
					});
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
				html += self.template(model.toJSON());
			});
			
			self.$el.append(html);
		},
		
		listItemClick: function () {
			console.log("qwerty");
		}
	 });
	 
	 /*
	  * map view
	  */
	var mapView = Backbone.View.extend({
		
		initialize: function (options) {	
			console.log("mapView initialized"); 
			 
			this.collection = options.collection; 
			this.el = options.el;
			this.inputField = options.inputField;
			this.render();  
		},
		
		render: function () {
			var myPosition = new google.maps.LatLng(this.collection.models[0].toJSON().lat, this.collection.models[0].toJSON().lon);
		
			var mapOptions = {
				//FIXME
				center: myPosition,
				zoom: 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			  };
			
			// google map object
			var map = new google.maps.Map(this.$el.get(0), mapOptions);
		 
			// google map marker
			// FIXME, not displaying???
			var myPosition = new google.maps.LatLng()
			var marker = new google.maps.Marker({
				position: myPosition,
				map: map,
				title: this.collection.models[0].get("city")
			});
			console.log("marker: ", marker);
		 
			// google auto complete 
			var input = $(this.inputField).get(0);
			var autocompleteOptions = {
				types: ['(cities)'],
				componentRestrictions: {country: 'au'}
			};	
			var autocomplete = new google.maps.places.Autocomplete(input, autocompleteOptions);

			//autocomplete.bindTo('bounds', map);
			google.maps.event.addListener(autocomplete, 'place_changed', this.changeLocation);
		},
		
		changeLocation: function () {
			console.log("loc change");
		}
	});
	
	 
	
	// controllers
	var dataCollection = new placeCollection();
	
	var placelistview = new placeListView({
		collection: dataCollection,
		el: "ul.place-list"
	});
	
	
	
	
	
	
	
/*
 * google map functions
 */ 
function  initialize() {
	 
}

 
  
//google.maps.event.addDomListener(window, 'load', initialize); 	
	
	
	
	 
	
}(window));


