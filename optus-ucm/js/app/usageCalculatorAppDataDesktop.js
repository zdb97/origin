var usageCalculatorData = {	
	devices: {
		deviceQuery: "devicetype",
		device: [
			{deviceName: "Mobile phone", className: "mobile", voice: true, data: true, deviceQuery: "devicetype"},
			{deviceName: "Tablet", className: "tablet",  voice: false, data: true, deviceQuery: "devicetype"},
			{deviceName: "Mobile broadband modem", className: "modem",  voice: false, data: true, deviceQuery: "devicetype"}
		]
	},
    calculators: [
        {
            type: "voice",
            title: "Voice Usage",
			frequency: "(per day)",
            summaryTitle: 'month',
            unit1: 'mins',
			displayMode: 'slider',
            activities: [
                {
                    title: "Calls you make a day",
                    unit: "call",
					usage: "calls",
                    range: [
                        0, 20
                    ],
                    index: 0
                }, 
                {
                    title: "Time spent on each call",
                    unit: "minute",
					usage: "mins",
                    range: [
                        0, 60
                    ],
                    index: 1
                }
            ]
        },

        {
			type: "data",
            title: "Data Usage",
			frequency: "(per day)",
            summaryTitle: 'month', 
            unit1: 'MB',
			unit2: 'GB',
			displayMode: 'slider',
            unitMultiplier: {  
				page: 0.4,		// 400kb
				email: 0.5,		// 500kb
				video: 5.8,		// 5.8mb
				song: 1,
				app: 7,
				GPS: 0.083,		//83kb
				socialMedia: 2,	//2mb
				videoCall: 3.2	
            },
            activities: [
                {
                    title: "Web pages visited",
                    unit: "page",
					usage: "pages",
                    range : [
                        0, 200
                    ],
                    index: 2
                }, 
                {
                    title: "Emails with attachment",
                    unit: "email",
					usage: "emails",
                    range: [
                        0, 200
                    ],
                    index: 3
                }, 
                {
                    title: "Streaming video",
                    unit: "video",
					usage: "mins",
                    range: [
                        0, 240
                    ],
                    index: 4
                }, 
                {
                    title: "Streaming music",
                    unit: "song",
					usage: "mins",
                    range: [
                        0, 240
                    ],
                    index: 5
                }, 
                {
                    title: "Apps/ Games/ Songs",
                    unit: "app",
					usage: "items",
                    range: [
                        0, 10
                    ],
                    index: 6
                },
				{
                    title: "GPS Navigation",
                    unit: "GPS",
					usage: "mins",
                    range: [
                        0, 240
                    ],
                    index: 7
                },
				{
                    title: "Social media posts with photos",
                    unit: "socialMedia",
					usage: "posts",
                    range: [
                        0, 50
                    ],
                    index: 8
                },
				{
                    title: "Video calling",
                    unit: "videoCall",
					usage: "mins",
                    range: [
                        0, 240
                    ],
                    index: 9
                }
            ] 
        }
    ],
	
	dataUsage: {
		title: "Data usage legend",
		listing: [
			"Hours of general internet use = 5MB per hour",
			"Photos or documents downloaded or uploaded = 850KB per image",
			"Music downloaded or uploaded = 5MB per song (4-5 min duration)",
			"Movie trailers or game trailers downloaded = 100MB each",
			"Movies downloaded or uploaded = 2GB per film",
			"Hours spent on online games = 15MB per hour",
			"Emails sent or received = 500KB per email (including attachments)",
			"1MB = 1,024 KB and 1GB = 1,024 MB",
			"Hours of online videos viewed = 2MB per minute",
			"2 min. Standard national mobile call = up to $0.20",
			"Hours of online radio listened to = Average stream at 128kb"
		],
		details: "Voice and data usage varies by device. The above examples are based on averages and are estimates only. Voice calls is inclusive of standard national calls only. The actual amount of data used for the described activitiy can vary and customers are to regularly check and manage your usage"
	}
		
	

};