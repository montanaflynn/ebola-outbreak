# Ebola Outbreak

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
