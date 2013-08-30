define(
	[
		"jquery", "underscore", "backbone"
	], 
	function($, _, Backbone) {
		console.log("test");
		
		$("body").prepend("heyyy");
		
		
		// underscore test
		_.each([1,2,3], function(num, index){
			console.log(num);
			$("body").prepend(num + "<br/>");
		})
});


