var fs = require('fs')
var unirest = require('unirest')
var parse = require('csv-parse')
var regression = require('regression')

var dataFile = __dirname + '/data/cases.json'

module.exports = {
  cases: function(callback) {
    if (!checkForDataUpdate()) {
      callback(false, require(dataFile))
      return
    }
    getData(callback)
  },
  project: function(distance, callback) {
    this.cases(function(err, data) {
      if (err) return callback(err, false)
      var output = projectData(distance, data)
      callback(err, output)
    })
  },
  update: function(callback) {
    this.cases(function(err, response) {
      if (err) return callback(err, response)
      callback(false, response)
    })
  }
}

function checkForDataUpdate() {
  try {
    var data = require(dataFile)
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

function getData(callback) {
  unirest
  .get('http://healthmap.org/ebola/csv/allnone.csv')
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

function parseData(input) {
  return data
}

function cleanData(input) {
  input.shift()
  var data = []
  var last = 0
  for (var i = 0; i < input.length; i++) {
    if (input[i][1] != 'X') {
      var cases = parseInt(input[i][1])
      data.push({
        date: new Date(input[i][0]).toISOString(),
        cases: cases,
        status: 'confirmed'
      })
    }
  }
  return data
}

function projectData(distance, data) {

  // Get last date
  var lastDate = new Date(data[data.length-1]['date'])

  // Add to the inital data
  while (distance > 0) {

    // Create new date
    lastDate.setHours(24 * 18)

    // Add projected placeholder
    data.push({ 
      date: lastDate.toISOString(),
      cases: null,
      status: 'projected'
    })

    distance--
  }

  // Get the data in usable form
  var regressionData = []
  for (var i = 0; i < data.length; i++) {
    var datum
    if (!data[i]) {
      datum = null
    } else {
      datum = data[i].cases
    }

    regressionData.push([i,datum])
  }

  // Build the projection model
  var model = regression('exponential', regressionData).points
  var model = model.map(function(data) {
    data[1] = Math.round(data[1])
    return data
  })   

  // Add back to original data
  for (var i = 0; i < data.length; i++) {
    var datum = data[i]
    if (!datum.cases) datum.cases = model[i][1]
  }

  // Voila
  return data
}

function saveData(data, callback) {
  fs.writeFile(dataFile, JSON.stringify(data, null, 2), function(err) {
    if (err) throw err
    callback()
  })
}
