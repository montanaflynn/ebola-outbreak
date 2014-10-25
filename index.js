var fs = require('fs')
var unirest = require('unirest')
var parse = require('csv-parse')
var predictor = require("predictor")

module.exports = {
	cases : function(callback) {
		if (!checkForDataUpdate()) {
			callback(false, require('./data/cases.json'))
			return
		}
		unirest
			.get('http://healthmap.org/ebola/csv/allnone.csv')
			.end(parseResponse)

		function parseResponse(res) {
			parse(res.body, function(err, output){
			  	output.shift()
			  	var response = []
			  	for (var i = 0; i < output.length; i++) {
			  		if (output[i][1] != 'X') {
						response.push({
							date : new Date(output[i][0]).toISOString(),
              cases :  output[i][1],
              status :  'confirmed'
						})
					}
				}
				saveData(response, function(){
					callback(err, response)
				})
			})
		}
	},
	project : function(distance, model, callback) {
		this.cases(function(err, data){
			var originalData = data
			var cleanData = data.map(function(datum) {
			  return datum.cases;
			})
			var guesses = []
			while (distance > 0) {
				var last = cleanData[data.length-1]
				var growth = growthRate(cleanData, model)
				var guess = Math.floor(last * growth)
				cleanData.push(guess)
				var newDate = new Date(data[data.length-1]['date'])
				newDate.setHours(24*18)
				data.push({
					date : newDate.toISOString(),
					cases : guess,
          status :  'projection'
				})
				distance--
			}
			callback(err, data)
		})
	},
  update : function(callback) {
    this.cases(function(err, response){
      if (err) return callback(err, response)
      callback(false, response)
    })
  }
}

function growthRate(data, model) {
	if (model === "latest" || !model) {
		var current = data[data.length-1]
		var previous = data[data.length-2]
		return (current / previous)
	}

	if (model === "average") {
		var rates = []
		for (var i = 0; i < data.length; i++) {
			var current = data[i]
			var previous = data[i-1] || 1
			rates.push(current / previous)
		}
		var sum = rates.reduce(function(a, b) { return a + b });
		var avg = sum / rates.length;
		return avg
	}
}

function checkForDataUpdate() {
	try {
		var data = require('./data/cases.json')
	} catch(e) {
		return true
	}
	var lastDataDate = new Date(data[data.length-1]['date'])
	lastDataDate.setHours(24*18)
	var newDataTimestamp = lastDataDate.getTime()
	var currentTimestamp = new Date().getTime()
	if (currentTimestamp > newDataTimestamp) {
		return true
	}
	return false
}

function saveData(data, callback) {
	fs.writeFile('./data/cases.json', JSON.stringify(data,null,2), function (err) {
	  if (err) throw err;
	  callback()
	})
} 
