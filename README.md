# connect-csvboy
> Express middleware to check user access based on the ressources URIs and
 HTTP methods.


[![NPM version](https://badge.fury.io/js/connect-csvboy.png)](https://npmjs.org/package/connect-csvboy) [![Build status](https://secure.travis-ci.org/SimpliField/connect-csvboy.png)](https://travis-ci.org/SimpliField/connect-csvboy) [![Dependency Status](https://david-dm.org/SimpliField/connect-csvboy.png)](https://david-dm.org/SimpliField/connect-csvboy) [![devDependency Status](https://david-dm.org/SimpliField/connect-csvboy/dev-status.png)](https://david-dm.org/SimpliField/connect-csvboy#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/SimpliField/connect-csvboy/badge.png?branch=master)](https://coveralls.io/r/SimpliField/connect-csvboy?branch=master) [![Code Climate](https://codeclimate.com/github/SimpliField/connect-csvboy.png)](https://codeclimate.com/github/SimpliField/connect-csvboy)

## Usage
```js
var csvboy = require('connect-csvboy');

// Add the middleware
app.use(csvboy());

// Consume the request
app.use(function(req, res, next) {
  // Pipe the request
  req.pipe(req.csvboy);

  // Consume the rows
  req.csvboy.on('readable', function() {
    var row;
    while(null !== (row = req.csvboy.read())) {
      console.log('New row:', row);
      // do whatever you want with the row (ex: insert in a db)
    }
  });
  req.csvboy.on('finish', function() {
    res.send(204);
  });

  // Threat errors
  req.csvboy.on('error', function(err) {
    req.unpipe(req.csvboy);
    next(err);
  });
});
```

## API

### reaccess(options)

### options
Type: `Object`

The options of the reaccess middleware.

### options.mimes
Type: `Array`
Default: `['text/csv']`

Mime type that csvboy should listen for.

### options.methods
Type: `Array`
Default: `['POST', 'PUT', 'PATCH']`

HTTP methods that csvboy should listen for.

### options.immediate
Type: `Boolean`
Default: `false`

Immediatly pipe the request in the csv parser.

### options.csvOptions
Type: `Object`

The CSV parser options. See the
 [oh-csv README file](https://www.npmjs.org/package/oh-csv).

## Stats

[![NPM](https://nodei.co/npm/connect-csvboy.png?downloads=true&stars=true)](https://nodei.co/npm/connect-csvboy/)
[![NPM](https://nodei.co/npm-dl/connect-csvboy.png)](https://nodei.co/npm/connect-csvboy/)


