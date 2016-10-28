'use strict';

var assert    = require('assert');
var fs        = require('fs');
const Parser  = require(__dirname + '/../../lib/parsers');

describe('Parser.situacaoCurricular', function() {

  describe('.parse', function() {
    it('should return an empty object if just passed a string', function() {
      let parsed = Parser.situacaoCurricular.parse('<title></title>');

      let expected = {
        situacaoCurricular: {
          summary: [],
          data: []
        }
      }

      assert.deepEqual(expected, parsed);
    });

  });

  describe('.parse', function() {
    it('should return an fullfilled object if passed an valid html', function() {
      let parsed = Parser.situacaoCurricular.parse('<title></title>');

      let expected = {
        situacaoCurricular: {
          summary: [],
          data: []
        }
      }

      assert.deepEqual(expected, parsed);
    });

  });


  describe('.parse', function() {
    it('should return an empty object if just passed a string', function() {
      let parsed = Parser.situacaoCurricular.parse('<title></title>');

      let expected = {
        situacaoCurricular: {
          summary: [],
          data: []
        }
      }

      assert.deepEqual(expected, parsed);
    });

  });

});
