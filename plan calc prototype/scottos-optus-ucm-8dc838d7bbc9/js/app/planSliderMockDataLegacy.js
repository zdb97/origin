/**
 * TODO SM 30Nov12: Remove mocked data we no-longer need.
 */

// slider mocks
var sliderMock = [{
	type: "call",
	value: [200, 400, 600, 50000],
	unit: "minute",
	range: false,
	step: false
}, {
	type: "data",
    value: [400, 1000, 2000, 3000],
    unit: "MB",
    range: false,
    step: false
}];
 
var rangeSliderMock = [{
	type: "call",
	value: [200, 800],
	unit: "minute",
	range: true,
	step: false
}, {
	type: "data",
	value: [400, 3000],
	unit: "MB",
	range: true,
	step: false
}];

var rangeSliderWithStepMock = [{
	type: "call",
	value: [200, 400, 600, 800],
	unit: "minute",
	range: true,
	step: true
}, {
	type: "data",
	value: [400, 1000, 2000, 3000],
	unit: "MB",
	range: true,
	step: true
}];
 
// monthly data usage calculator
// all the data unit is in MB for now


var voiceUsageCalculatorMock = [{
	label: "Calls you make",
	range: [0, 10],
	min: 0,
	max: 100,
	unit: "call",
	dataPerUnit: 0,
	type: "call"
}, {
	label: "Time spent on each call (Minutes)",
	range: [0, 1800],
	min: 0,
	max: 300,
	unit: "second",
	dataPerUnit: 0,
	type: "time"
}];


var dataUsageCalculatorMock = [{
	label: "Web page Visited",
	range: [0, 30],
	min: 0,
	max: 30,
	unit: "pages",
	dataPerUnit: 0.289,
	type: "webPage"
}, {
	label: "Email with attachment",
	range: [0, 40],
	min: 0,
	max: 40,
	unit: "emails",
	dataPerUnit: 0.3,
	type: "email"
}, {
	label: "Minutes of streaming video",
	min: 0,
	max: 20,
	range: [0, 20],
	unit: "mins",
	dataPerUnit: 2,
	type: "streamVideo"
}, {
	label: "Minutes of streaming music",
	min: 0,
	max: 40,
	range: [0, 20],
	unit: "mins",
	dataPerUnit: 0.5,
	type: "streamMusic"
}, {
	label: "Apps/Games/songs",
	min: 0,
	max: 20,
	range: [0, 20],
	unit: "Apps/Games/songs",
	dataPerUnit: 4,
	type: "apps"
}];

var dataCalculatorMeterViewMock = [{
	marks: [{
		label: "0MB",
		value: "0"
	}, {
		label: "500MB",
		value: "500"
	}, {
		label: "1GB",
		value: "1000"
	}, {
		label: "1.5GB",
		value: "1500"
	}, {
		label: "2GB",
		value: "2000"
	}, {
		label: "2.5GB",
		value: "2500"
	}, {
		label: "2.5GB",
		value: "2500"
	}, {
		label: "2.5GB",
		value: "2500"
	}]
}];

var voiceCalculatorMeterViewMock = {
	min: 0,
	max: 700,
	unit: "Min"
};