var fs = require('fs')
var unirest = require('unirest')
var parse = require('csv-parse')

var dataFile = __dirname + '/data/cases.json'

module.exports = {
  cases: function(callback) {
    if (!checkForDataUpdate()) {
      callback(false, require(dataFile))
      return
    }
    unirest
    .get('http://healthmap.org/ebola/csv/allnone.csv')
    .end(function(res) {
      parse(res.body, function(err, output) {
        if (typeof output !== "object") return callback(true, res)
        output.shift()
        var data = []
        var last = 0
        for (var i = 0; i < output.length; i++) {
          if (output[i][1] != 'X') {
            var cases = parseInt(output[i][1])
            data.push({
              date: new Date(output[i][0]).toISOString(),
              cases: cases,
              status: 'confirmed'
            })
          }
        }
        var output = mungeData(data, 'cases')
        saveData(output, function() {
          callback(err, output)
        })
      })
    })
  },
  project: function(distance, callback) {
    this.cases(function(err, data) {
      if (err) return callback(err, false)
      var data = data.map(function(datum) {
        var originalData = parseInt(datum.cases['new'])
        datum['cases'] = originalData
        return datum
      })      
      var cleanData = data.map(function(datum) {
        return datum.cases
      })
      var guesses = []
      while (distance > 0) {
        var last = cleanData[data.length - 1]
        var growth = growthRate(cleanData)
        var guess = Math.floor(last * growth)
        cleanData.push(guess)
        var newDate = new Date(data[data.length - 1]['date'])
        newDate.setHours(24 * 18)
        data.push({
          date: newDate.toISOString(),
          cases: guess,
          status: 'projection'
        })
        distance--
      }
      // console.log(data)
      var output = mungeData(data, 'cases')
      console.log(output)
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

function growthRate(data) {
  var current = data[data.length - 1]
  var previous = data[data.length - 2]
  return (current / previous)
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

function saveData(data, callback) {
  fs.writeFile(dataFile, JSON.stringify(data, null, 2), function(err) {
    if (err) throw err
    callback()
  })
}

function mungeData(source, property) {
  var sum = 0;
  return source.map(function(current) {
    var cumulative = sum + current[property];
    sum += current[property];
    var datoid = {
      "new" : current[property],
      "total" : cumulative
    }
    delete current[property]
    current[property] = datoid
    return current;
  });  
}
