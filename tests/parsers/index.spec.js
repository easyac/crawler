/* globals describe, it */
'use strict';

var assert    = require('assert');
var fs        = require('fs');
const Parser  = require(__dirname + '/../../lib/parsers');

describe('Parser', function() {

  it('should be an object', function() {
    assert.equal(typeof Parser, 'object');
  })

  it('should have situacaoCurricular key as an object', function() {
    assert.equal(Parser.hasOwnProperty('situacaoCurricular'), true);
    assert.equal(typeof Parser.situacaoCurricular, 'object');
  });

  it('should have consultaFrequencia key as an object', function() {
    assert.equal(Parser.hasOwnProperty('consultaFrequencia'), true);
    assert.equal(typeof Parser.consultaFrequencia, 'object');
  });

  it('should have dadosAluno key as an object', function() {
    assert.equal(Parser.hasOwnProperty('dadosAluno'), true);
    assert.equal(typeof Parser.dadosAluno, 'object');
  });

  it('should have boletim key as a function', function() {
    assert.equal(Parser.hasOwnProperty('boletim'), true);
    assert.equal(typeof Parser.boletim, 'object');
  });

});
