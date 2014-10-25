# Ebola Confirmed Cases

Built this to help spread awareness about the ongoing Ebola outbreak. Powered by data obtained from [HealthMap](http://healthmap.org/ebola/) who in turn got it from the [World Health Organization](http://www.who.int/en/). The data is updated every 18 days.

## Install

npm install ebola-outbreak --save

## Usage

var ebola = require('ebola-outbreak')

// Return all the confirmed cases
ebola.cases(function(err, output){
	console.log("Testing returning all the cases: \n")
	if (err) throw err
	console.log(output)
})

// Return confirmed cases plus 5 projections with the 'latest' model:
ebola.project(5, 'latest' ,function(err, output){
	if (err) throw err
	console.log(output)
})

// Return confirmed cases plus 5 projections with the 'average' model:
ebola.project(5, 'average' ,function(err, output){
	if (err) throw err
	console.log(output)
})

## Todos

- Add country specific data
- Include death counts
- Better projection models
