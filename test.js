var ebola = require('./index.js')

// Return all the confirmed cases
ebola.cases(function(err, output){
	console.log("Testing returning all confirmed cases")
	if (err) 
		return console.log("\033[31m", "Test Failed", "\033[0m \n")

	if (typeof output === "object") {
		console.log("\033[32m", "Test Passed", "\033[0m \n")
	} else {
		console.log("\033[31m", "Test Failed", "\033[0m \n")
	}
})

// Return confirmed cases plus 5 projections with the 'latest' model:
ebola.project(5, 'latest' ,function(err, output){
	console.log("Testing confirmed cases plus 5 projections with the 'latest' model")
	if (err) 
		return console.log("\033[31m", "Test Failed", "\033[0m \n")

	if (typeof output === "object") {
		console.log("\033[32m", "Test Passed", "\033[0m \n")
	} else {
		console.log("\033[31m", "Test Failed", "\033[0m \n")
	}
})

// Return confirmed cases plus 5 projections with the 'average' model:
ebola.project(5, 'average' ,function(err, output){
	console.log("Testing confirmed cases plus 5 projections with the 'average' model")
	if (err) 
		return console.log("\033[31m", "Test Failed", "\033[0m \n")

	if (typeof output === "object") {
		console.log("\033[32m", "Test Passed", "\033[0m \n")
	} else {
		console.log("\033[31m", "Test Failed", "\033[0m \n")
	}
})

// Update data in './data/cases.json'
ebola.update(function(err, output){
	console.log("Testing updating the data")
	if (err) 
		return console.log("\033[31m", "Test Failed", "\033[0m \n")
	
	if (typeof output === "object") {
		console.log("\033[32m", "Test Passed", "\033[0m \n")
	} else {
		console.log("\033[31m", "Test Failed", "\033[0m \n")
	}
})