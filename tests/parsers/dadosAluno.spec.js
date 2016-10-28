/* globals describe, it */
'use strict';

var assert    = require('assert');
var fs        = require('fs');
const Parser  = require(__dirname + '/../../lib/parsers');


describe('Parser.dadosAluno', function() {


  describe('.parseCodigoAluno', function() {

    it('should return false if not match CodigoAluno', function() {
      let html = '<html></html>';
      let codAluno = Parser.dadosAluno.parse(html);
      assert.equal(false, codAluno);
    });

    it('should return the CodigoAluno', function(done) {
      fs.readFile(__dirname + '/../fixtures/dadosAluno.html', function(err, html){
        let codAluno = Parser.dadosAluno.parse(html);
        assert.equal(1070153, codAluno);
        done();
      });
    });

  });

});
