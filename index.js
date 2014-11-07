var fs = require('fs')
var unirest = require('unirest')
var parse = require('csv-parse')
var regression = require('regression')

var dataFile = __dirname + '/data/cases.json'

module.exports = {
  cases: function(callback) {
    getData(callback)
  },
  project: function(distance, callback) {
    getData(function(err, data) {
      if (err) return callback(err, false)
      var output = projectData(distance, data)
      callback(err, output)
    })
  },
  rate: function(callback) {
    getData(function(err, data) {
      if (err) return callback(err, false)
      callback(err, growthRate(data))
    })
  },
  update: function(callback) {
    getData(function(err, response) {
      if (err) return callback(err, response)
      callback(false, response)
    })
  }
}

function getData(callback) {
  unirest
    .get('https://raw.githubusercontent.com/montanaflynn/ebola-outbreak-data/master/ebola-outbreak-data.csv')
    .end(function(res) {
      parse(res.body, function(err, output) {
        if (typeof output !== "object") return callback(true, res)
        var data = cleanData(output)
        saveData(data, function() {
          callback(err, data)
        })
      })
    })
}

function cleanData(input) {
  input.shift()
  var data = []
  var last = 0
  for (var i = 0; i < input.length; i++) {
    if (input[i][1] != 'X') {
      var cases = parseInt(input[i][1])
      var deaths = parseInt(input[i][2])
      data.push({
        date: new Date(input[i][0]).toISOString(),
        cases: cases,
        deaths: deaths,
        status: 'confirmed'
      })
    }
  }
  return data
}

function pluckCases(data) {
  var regressionData = []
  for (var i = 0; i < data.length; i++) {
    var timestamp = new Date(data[i].date).getTime()
    var daySinceEpoch = (timestamp / 86400000).toFixed()
    var datum = data[i].cases
    regressionData.push([daySinceEpoch, datum])
  }
  return regressionData
}

function pluckDeaths(data) {
  var regressionData = []
  for (var i = 0; i < data.length; i++) {
    var timestamp = new Date(data[i].date).getTime()
    var daySinceEpoch = (timestamp / 86400000).toFixed()
    var datum = data[i].deaths
    regressionData.push([daySinceEpoch, datum])
  }
  return regressionData
}


function projectData(distance, data) {

  // Get last date
  var lastDate = new Date(data[data.length - 1]['date'])

  // Add to the inital data
  while (distance > 0) {

    // Create new date
    lastDate.setHours(24 * 7)

    // Add projected placeholder
    data.push({
      date: lastDate.toISOString(),
      cases: null,
      deaths: null,
      status: 'projected'
    })

    distance--

  }

  // Get cases and death data in regression format
  var caseData = pluckCases(data)
  var deathData = pluckDeaths(data)

  // Build the cases projection model
  var caseModel = regression('exponential', caseData).points
  var caseModel = caseModel.map(function(data) {
    data[1] = Math.round(data[1])
    return data
  })

  // Build the deaths projection model
  var deathModel = regression('exponential', deathData).points
  var deathModel = deathModel.map(function(data) {
    data[1] = Math.round(data[1])
    return data
  })

  // Add back to original data
  for (var i = 0; i < data.length; i++) {
    var datum = data[i]
    if (!datum.cases) datum.cases = caseModel[i][1]
    if (!datum.deaths) datum.deaths = deathModel[i][1]
  }

  // Return implemented data
  return data
}

function growthRate(data) {
  var regressionData = pluckData(data)
  return regression('exponential', regressionData).string
}

function saveData(data, callback) {
  fs.writeFile(dataFile, JSON.stringify(data, null, 2), function(err) {
    if (err) throw err
    callback()
  })
}
