/*
 * author: zidan bian
  * date: 28/08/2013
*/

(function (window, undefined) {
	/*
	 * profile model
	 */
	var ProfileModel =  Backbone.Model.extend({
		defaults: {
			id: 	"",
			firstName: "",
			lastName: "",
			picture: "",
			bio: "",
			selected: ""
		},
		
		initialize: function () {
			this.set("bio", this.get("bio").replace(/\n/g, '<br />'));
			
			console.log('ProfileModel initialized: ', this.toJSON());
		}
	});

	/*
	* profile collection
	*/
     var ProfileCollection = Backbone.Collection.extend({

        model: ProfileModel,
		//url: "scripts/data.js",	// url ralative to html page
		
		initialize: function () {
			console.log('PlaceCollection initialized'); 
		}
	});
	
	
	/*
	 * tab view
	 */
	 var TabView = Backbone.View.extend({
		template: _.template($("#profile-tab").html()),
		flag: true,
		
		events: {
			// consider "touchstart", "MSPointerDown" for touchable devices
			"click li": "listItemClick"
		}, 
		
		initialize: function (options){
			this.collection = options.collection; 
			this.el = options.el;
			
			this.listenTo(this.collection, 'change', this.render);
			console.log("tab view initialized: ", this);
			
			this.render();
		},
		
		render: function () {
			var self = this;
			var html = "";
			
			self.collection.models = _.sortBy(self.collection.models, function(model) {
				return model.get("firstName");
			});
			
			_.each(self.collection.models, function(model, index) {
				if(index === 0 && self.flag == true) {console.log("sd");
					model.set("selected", "selected");
					self.flag = false;
				}
				
				html += self.template(model.toJSON());
			});
			self.$el.html("");
			self.$el.append(html);
			
			// for chaining
			return this;
		},
		
		listItemClick: function (e) {
			var clickModel = _.find(this.collection.models, function(model) {
				return (model.get("id") == $(e.target).attr("index"));
			});
			
			var currentDisplayModel = _.find(this.collection.models, function(model) {
				return (model.get("selected") == "selected");
			});
			
			currentDisplayModel.set("selected", "");
			clickModel.set("selected", "selected");
		}
	 });
	 
	 
	 /*
	 * content view
	 */
	 var ContentView = Backbone.View.extend({
		template: _.template($("#profile-content").html()),
		
		events: {
			// consider "touchstart", "MSPointerDown" for touchable devices
			"click .title": "listItemClick"
		}, 
	
		initialize: function (options){
			this.collection = options.collection; 
			this.el = options.el;
			
			this.listenTo(this.collection, 'change', this.render);
			console.log("content view initialized: ", this);
			
			this.render();
		},
	 
		render: function() {
			var self = this;
			var html = "";
			
			// collection already sorted in tab view
			_.each(self.collection.models, function(model, index) {
				html += self.template(model.toJSON());
			});
			
			self.$el.html("");
			self.$el.append(html);
			
			// for chaining
			return this;
		},
		
		listItemClick: function (e) {
			var clickModel = _.find(this.collection.models, function(model) {
				return (model.get("id") == $(e.target).attr("index"));
			});
			
			var currentDisplayModel = _.find(this.collection.models, function(model) {
				return (model.get("selected") == "selected");
			});
			
			currentDisplayModel.set("selected", "");
			clickModel.set("selected", "selected");
		}
	});	
		
	 
	 
	 
	
	
	var profileCollection = new ProfileCollection(data);
	
	var tabView = new TabView({
		collection: profileCollection,
		el: "ul.tabs"
	});

	var contentView = new ContentView({
		collection: profileCollection,
		el: "ul.contents"
	});
	
	
	
}(window));


