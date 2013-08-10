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
		
		// 
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
		
		initialize: function (options){
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
			var mapOptions = {
				//FIXME
				//center: new google.maps.LatLng(this.collection.models[0].toJSON().lat, this.collection.models[0].toJSON().lon),
				center: new google.maps.LatLng(-33.8688, 151.2195),
				zoom: 12,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			  };
			
			var map = new google.maps.Map(this.$el.get(0), mapOptions);
		 
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
	
	var mapview = new mapView({
		collection: dataCollection,
		el: "div#map-canvas",
		inputField: "#searchTextField"
	});
	
	
	
	
	
	
	
	
/*
 * google map functions
 */ 
function  initialize() {
	 
}

 
  
//google.maps.event.addDomListener(window, 'load', initialize); 	
	
	
	
	 
	
}(window));


