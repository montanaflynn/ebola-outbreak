# Ebola Outbreak

Powered by data obtained from [HealthMap](http://healthmap.org/ebola/) who in turn got it from the [World Health Organization](http://www.who.int/en/). The data is updated every 18 days so it is cached in `./data/cases.json` until an update is available.

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
ebola.project(5, function(err, data){
	if (err) throw err
	console.log(data)
})

// Return the latest growth rate:
ebola.rate(function(err, rate){
    if (err) throw err
    console.log(rate)
})

```

### Todos

- Add country specific data
- Include death counts
- Add different output types
