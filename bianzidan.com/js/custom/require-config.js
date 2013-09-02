require.config({
	baseUrl: "./js/",
	paths: {
		custom: "custom/",
		lib: "lib/",
		
		jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
		underscore: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.1/underscore-min",
		backbone: "//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min",
		async: 'lib/async',
		/*
		jquery: "lib/jquery-1.10.2.min",
		underscore: "lib/underscore-min",
		backbone: "lib/backbone-min"
		*/
		
		// internal js
		map: "custom/map"
	},
	/* 
	 * shim: http://requirejs.org/docs/api.html#config-shim
	 * only use shim config for non-AMD scripts, scripts that do not already call define(). The shim config will not work correctly if used on AMD scripts,
	 */
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		
	}
});



