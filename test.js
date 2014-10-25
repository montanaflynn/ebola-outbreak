var fs = require('fs')
var ebola = require('./index.js')

fs.unlink(__dirname + '/data/cases.json', runTests)

function runTests() {

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

  // Return confirmed cases plus 5 projections:
  ebola.project(5 ,function(err, output){
    console.log("Testing confirmed cases plus 5 projections")
    if (err) 
      return console.log("\033[31m", "Test Failed", "\033[0m \n")

    if (typeof output === "object") {
      console.log("\033[32m", "Test Passed", "\033[0m \n")
    } else {
      console.log("\033[31m", "Test Failed", "\033[0m \n")
    }

    console.log(output)

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

}
