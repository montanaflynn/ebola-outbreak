var assert = require('chai').assert
var ebola = require('../index.js')

describe('Cases', function(){

  it('should return an array', function(done){
    ebola.cases(function(err,output){
      assert.typeOf(output, 'array', 'Output is not an array');
      done()
    })
  })

  it('should return a non-empty array', function(done){
    ebola.cases(function(err,output){
      assert(output.length != 0, 'Output length is zero');
      done()
    })
  })

  it('should return an array of objects', function(done){
    ebola.cases(function(err,output){
      assert.typeOf(output[0], 'object', 'Output does not include objects');
      done()
    })
  })

  it('should return objects with date property', function(done){
    ebola.cases(function(err,output){
      assert(output[0].date != undefined, 'Output does not include date');
      done()
    })
  })

  it('should return objects with cases property', function(done){
    ebola.cases(function(err,output){
      assert(output[0].cases != undefined, 'Output does not include cases');
      done()
    })
  })

  it('should return objects with deaths property', function(done){
    ebola.cases(function(err,output){
      assert(output[0].deaths != undefined, 'Output does not include deaths');
      done()
    })
  })

  it('should return objects with status property', function(done){
    ebola.cases(function(err,output){
      assert(output[0].status != undefined, 'Output does not include status');
      done()
    })
  })

  it('should not return an error', function(done){
    ebola.cases(function(err,output){
      assert(!err, 'Error is returned');
      done()
    })
  })

})

describe('Project', function(done){
  it('should return 5 projections', function(done){
    ebola.project(5, function(err,output){
      var count = 0
      for (var i = 0; i < output.length; i++) {
        if (output[i].status === 'projected') count++
      }
      assert(count === 5, 'Projection count is not 5');
      done()
    })
  })
  
  it('should return an array', function(done){
    ebola.project(5, function(err,output){
      assert.typeOf(output, 'array', 'Output is not an array');
      done()
    })
  })
  
  it('should return a non-empty array', function(done){
    ebola.project(5, function(err,output){
      assert(output.length != 0, 'Output length is zero');
      done()
    })
  })
  
  it('should return an array of objects', function(done){
    ebola.project(5, function(err,output){
      assert.typeOf(output[0], 'object', 'Output does not include objects');
      done()
    })
  })
  
  it('should return objects with date property', function(done){
    ebola.project(5, function(err,output){
      assert(output[0].date != undefined, 'Output does not include date');
      done()
    })
  })
  
  it('should return objects with cases property', function(done){
    ebola.project(5, function(err,output){
      assert(output[0].cases != undefined, 'Output does not include cases');
      done()
    })
  })
  
  it('should return objects with deaths property', function(done){
    ebola.project(5, function(err,output){
      assert(output[0].deaths != undefined, 'Output does not include deaths');
      done()
    })
  })
  
  it('should return objects with status property', function(done){
    ebola.project(5, function(err,output){
      assert(output[0].status != undefined, 'Output does not include status');
      done()
    })
  })
  
  it('should not return an error', function(done){
    ebola.project(5, function(err,output){
      assert(!err, 'Error is returned');
      done()
    })
  })
})

describe('Rate', function(){
  it('should return an object', function(done){
    ebola.rate(function(err,output){
      assert.typeOf(output, 'object', 'Output is not an object');
      done()
    })
  })

  it('should return object with cases property', function(done){
    ebola.rate(function(err,output){
      assert(output.cases != undefined, 'Output does not include case growth rate');
      done()
    })
  })
  
  it('should return object with deaths property', function(done){
    ebola.rate(function(err,output){
      assert(output.deaths != undefined, 'Output does not include death growth rate');
      done()
    })
  })
  
  it('should return case growth rate as a string', function(done){
    ebola.rate(function(err,output){
      assert.typeOf(output.cases, 'string', 'Case output is not a string');
      done()
    })
  })
  
  it('should return death growth rate as a string', function(done){
    ebola.rate(function(err,output){
      assert.typeOf(output.deaths, 'string', 'Death output is not a string');
      done()
    })
  })

  it('should not return an error', function(done){
    ebola.rate(function(err,output){
      assert(!err, 'Error is returned');
      done()
    })
  })
})
