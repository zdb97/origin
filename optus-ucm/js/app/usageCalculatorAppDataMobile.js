/*
	Plan on rolling into an existing usage calc rewrite.
*/

var usageCalculatorData = {

	calculators: [

		{
			type: "voice",
			title: "Voice Usage",
			period: "(per day)",
			summaryTitle: 'month',
			unit1: 'mins',
			displayMode: 'pillbox',
			activities: [
				{
					title: "Calls you make", 
					unit: "call",
					steps: [
						1, 3, 5, 10, 20
					]
				}, 
				{
					title: "Time spent on each call (Minutes)",
					unit: "minute",
					steps: [
						1, 5, 10, 30, 60
					]
				}
			]
		},

		{
			title: "Data Usage",
			period: "(per day)",
			summaryTitle: 'month',
			type: "data",
			unit1: 'MB',
			unit2: 'GB',
			displayMode: 'pillbox',
			unitMultiplier: {
				page: 0.4,		// 400kb
				email: 0.5,		// 500kb
				video: 5.8,		// 5.8mb
				song: 1,
				app: 7,
				GPS: 0.083,		//83kb
				socialPost: 2,	//2mb
				videoCall: 3.2	
			},
			activities: [
				{
					title: "Web pages visited",
					unit: "page",
					steps : [
						5, 10, 20, 50, 100
					]
				}, 
				{
					title: "Emails with attachment",
					unit: "email",
					steps: [
						5, 10, 20, 50, 100
					]
				}, 
				{
					title: "Streaming video (minutes)",
					unit: "video",
					steps: [
                        5, 10, 30, 60, 120
					]
				}, 
				{
					title: "Streaming music (minutes)",
					unit: "song",
					steps: [
						5, 10, 30, 60, 120
					]
				}, 
				{
					title: "Apps/ Games/ Songs",
					unit: "app",
					steps: [
						1, 3, 5, 7, 10
					]
				},
				{
					title: "GPS Navigation (minutes)",
					unit: "GPS",
					steps: [
                        5, 10, 30, 60, 120
					]
				},
				{
					title: "Social media posts with photos",
					unit: "socialPost",
					steps: [
						1, 2, 5, 10, 20
					]
				},
				{
					title: "Video calling (minutes)",
					unit: "videoCall",
					steps: [
					    5, 10, 30, 60, 120
					]
				}
			]

		}

	]

};