# Ebola Outbreak [![NPM Version](http://img.shields.io/npm/v/ebola-outbreak.svg?style=flat-square)](https://www.npmjs.org/package/ebola-outbreak) [![wercker continuous integration testing](http://img.shields.io/wercker/ci/546b83aba60c33c27c02add4.svg?style=flat-square)](https://app.wercker.com/project/bykey/424955e2b6029e7fbc3412bcc63d833f) [![npm dependencies](http://img.shields.io/david/montanaflynn/ebola-outbreak.svg?style=flat-square)](https://david-dm.org/montanaflynn/ebola-outbreak)

Powered by [data](https://github.com/montanaflynn/ebola-outbreak-data) obtained from the [World Health Organization](http://www.who.int/en/). 

### Install

```shell
npm install ebola-outbreak --save
```

### Usage

```javascript
var ebola = require('ebola-outbreak')

// Return all the confirmed cases
ebola.cases(function(err, cases){
  if (err) throw err
  console.log(cases)
})

// Return confirmed cases plus 5 projections:
ebola.project(5, function(err, projections){
  if (err) throw err
  console.log(projections)
})

// Return the latest growth rate:
ebola.rate(function(err, rate){
  if (err) throw err
  console.log(rate)
})

```

### Todos

- Add country specific data
- Add different output types
