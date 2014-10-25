var fs = require('fs')
var unirest = require('unirest')
var parse = require('csv-parse')
var predictor = require("predictor")

module.exports = {
  cases: function(callback) {
    if (!checkForDataUpdate()) {
      callback(false, require('./data/cases.json'))
      return
    }
    unirest
    .get('http://healthmap.org/ebola/csv/allnone.csv')
    .end(function(res) {
      parse(res.body, function(err, output) {
        if (typeof output !== "object") return callback(true, res)
        output.shift()
        var response = []
        var last = 0
        for (var i = 0; i < output.length; i++) {
          if (output[i][1] != 'X') {
            var cases = parseInt(output[i][1])
            var cumulative = last + cases
            response.push({
              date: new Date(output[i][0]).toISOString(),
              cases: cases,
              cumulative: cumulative,
              status: 'confirmed'
            })
            last = parseInt(output[i][1])
          }
        }
        saveData(response, function() {
          callback(err, response)
        })
      })
    })
  },
  project: function(distance, model, callback) {
    this.cases(function(err, data) {
      if (err) return callback(err, false)
      var originalData = data
      var cleanData = data.map(function(datum) {
        return parseInt(datum.cases)
      })
      var guesses = []
      while (distance > 0) {
        var last = cleanData[data.length - 1]
        var growth = growthRate(cleanData, model)
        var guess = Math.floor(last * growth)
        cleanData.push(guess)
        var newDate = new Date(data[data.length - 1]['date'])
        newDate.setHours(24 * 18)
        data.push({
          date: newDate.toISOString(),
          cases: guess,
          cumulative: guess + last,
          status: 'projection'
        })
        distance--
      }
      callback(err, data)
    })
  },
  update: function(callback) {
    this.cases(function(err, response) {
      if (err) return callback(err, response)
      callback(false, response)
    })
  }
}

function growthRate(data, model) {
  if (model === "latest" || !model) {
    var current = data[data.length - 1]
    var previous = data[data.length - 2]
    return (current / previous)
  }

  if (model === "average") {
    var rates = []
    for (var i = 0; i < data.length; i++) {
      var current = data[i]
      var previous = data[i - 1] || 1
      rates.push(current / previous)
    }
    var sum = rates.reduce(function(a, b) {
      return a + b
    })
    var avg = sum / rates.length
    return avg
  }
}

function toCSV(input) {
  var output = "timestamp, cases, cumulative, status\n"
  for (var i = 0; i < input.length; i++) {
  var date = new Date(input[i].date)
  var dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
  var cases = input[i]['cases']
  var cumulative = input[i]['cumulative']
  var status = input[i]['status']
  output += dateString + ", " + cases + ", " + cumulative + ", " + status + "\n"
  }
  return output
}

function checkForDataUpdate() {
  try {
    var data = require('./data/cases.json')
  } catch (e) {
    return true
  }
  var lastDataDate = new Date(data[data.length - 1]['date'])
  lastDataDate.setHours(24 * 18)
  var newDataTimestamp = lastDataDate.getTime()
  var currentTimestamp = new Date().getTime()
  if (currentTimestamp > newDataTimestamp) {
    return true
  }
  return false
}

function saveData(data, callback) {
  fs.writeFile('./data/cases.json', JSON.stringify(data, null, 2), function(err) {
    if (err) throw err
    callback()
  })
}