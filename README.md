# Ebola Confirmed Cases

Built this to help spread awareness about the ongoing Ebola outbreak. 

## Install

npm install ebola-cases --save

## Usage

var ebola = require('./index.js')
var project = require('./project.js')

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