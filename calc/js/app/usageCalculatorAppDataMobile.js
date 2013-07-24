/*
	SM 14Feb13: Updated mock data structure.
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
			kbPerUnit: {
				/**/
				page: 400,			// 400kb
				email: 500,			// 500kb
				video: 5939.2,		// 5.8mb
				song: 1024,			// 1mb
				app: 7168,			// 7mb
				GPS: 83,			//83kb
				socialPost: 2048,	//2mb
				videoCall: 3276.8	// 3.2 mb
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
					title: "Apps/ Games/ Songs downloaded",
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