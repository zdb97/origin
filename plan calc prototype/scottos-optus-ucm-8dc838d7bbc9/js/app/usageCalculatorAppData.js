/*
	SM 14Feb13: Updated mock data structure.
	Plan on rolling into an existing usage calc rewrite.
*/

var usageCalculatorData = {

	calculators: [

		{
			type: "voice",
			title: "Daily Call Usage",
			summaryTitle: 'Monthly Calls',
			unit: 'Mins',
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
			title: "Daily Data Usage",
			summaryTitle: 'Monthly Data',
			type: "data",
			unit: 'MB',
			unitMultiplier: {
				page: 1,
				email: 1,
				video: 10,
				song: 3,
				app: 10
			},
			activities: [
				{
					title: "Web pages visited",
					unit: "page",
					steps : [
						1, 2, 5, 10, 50
					]
				}, 
				{
					title: "Emails with attachment",
					unit: "email",
					steps: [
						1, 2, 5, 10, 50
					]
				}, 
				{
					title: "Videos watched",
					unit: "video",
					steps: [
						1, 2, 5, 10, 50
					]
				}, 
				{
					title: "Songs listened to",
					unit: "song",
					steps: [
						5, 20, 50, 100, 300
					]
				}, 
				{
					title: "Apps downloaded",
					unit: "app",
					steps: [
						1, 2, 5, 10, 50
					]
				}
			]

		}

	]

};