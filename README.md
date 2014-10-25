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
ebola.cases(function(err, output){
	if (err) throw err
	console.log(output)
})

// Return confirmed cases plus 5 projections:
ebola.project(5, function(err, output){
	if (err) throw err
	console.log(output)
})

```

### Todos

- Add country specific data
- Include death counts
- Better projection models
- Write tests with framework
- Add different output types
