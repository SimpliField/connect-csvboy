var assert = require('assert');
var csvboy = require('../src');
var csv = require('oh-csv');
var request = require('supertest');
var express = require('express');

describe('csvboy', function() {

  it('should work with basic usage', function(done) {
    testReq({}, 'put', [
      ['1', 'plop', 'kikoolol'],
      ['2', 'plop2', 'kikoolol2'],
      ['3', 'plop3', 'kikoolol3']
    ]).expect(204, done);
  });

  it('should work with custom CSV options', function(done) {
    testReq({
      csvOpts: {quote: '"'}
    }, 'put', [
      ['1', 'plop', 'kikoolol'],
      ['2', 'plop2', 'kikoolol2'],
      ['3', 'plop3', 'kikoolol3']
    ]).expect(204, done);
  });

  it('should work with immediate option', function(done) {
    testReq({
      immediate: true
    }, 'put', [
      ['1', 'plop', 'kikoolol'],
      ['2', 'plop2', 'kikoolol2'],
      ['3', 'plop3', 'kikoolol3']
    ]).expect(204, done);
  });

  it('should work with custom mimes', function(done) {
    testReq({
      mimes: ['text/tsv']
    }, 'put', [
      ['1', 'plop', 'kikoolol'],
      ['2', 'plop2', 'kikoolol2'],
      ['3', 'plop3', 'kikoolol3']
    ], 'text/tsv').expect(204, done);
  });

  it('should work with unauthorized mimes', function(done) {
    testReq({
      mimes: ['text/csv']
    }, 'put', [
      ['1', 'plop', 'kikoolol'],
      ['2', 'plop2', 'kikoolol2'],
      ['3', 'plop3', 'kikoolol3']
    ]).expect(204, done);
  }, 'text/tsv');

  it('should work with custom methods', function(done) {
    testReq({
      methods: ['POST']
    }, 'post', [
      ['1', 'plop', 'kikoolol'],
      ['2', 'plop2', 'kikoolol2'],
      ['3', 'plop3', 'kikoolol3']
    ]).expect(204, done);
  });

  it('should not execute with unauthorized methods', function(done) {
    testReq({
      methods: ['POST']
    }, 'put', [
      ['1', 'plop', 'kikoolol'],
      ['2', 'plop2', 'kikoolol2'],
      ['3', 'plop3', 'kikoolol3']
    ]).expect(501, done);
  });

});

// Helper
function testReq(opts, method, startRows, type, path) {
  var body = '';
  var app;
  var encoder = csv.Encoder();

  // Getting CSV content
  encoder.on('data', function(chunk) {
    body += chunk.toString();
  });
  
  startRows.forEach(function(row) {
    encoder.write(row);
  });

  // Setting server and making the request
  app = express();
  path = path || '/foo';
  app.use(csvboy(opts));
  app.use(path, function(req, res, next) {
    var rows = [];

    if(!req.csvboy) {
      return next();
    }
    // Pipe the request
    if(!opts.immediate) {
      req.pipe(req.csvboy);
    }

    // Consume the rows
    req.csvboy.on('readable', function() {
      var row;
      while(null !== (row = req.csvboy.read())) {
        rows.push(row);
      }
    });
    req.csvboy.on('end', function() {
      assert.deepEqual(rows, startRows);
      res.send(204);
    });
  });
  app.use(path, function(req, res, next) {
    res.send(501);
  });

  return request(app)[method](path || '/foo')
    .set('Content-Type', type || 'text/csv')
    .send(body);
}

