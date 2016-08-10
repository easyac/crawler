'use strict';

var assert    = require('assert');
var fs        = require('fs');
const Parser  = require(__dirname + '/../../lib/parsers');


describe('Parser.consultaFrequencia', function() {

  describe('.parseParams', function() {

    it('should return an object with values equals false', function() {
      let html   = '<html></html>';
      let params = Parser.consultaFrequencia.parseParams(html);

      let expected = {
        cursos: false,
        ciclos: false,
        periodos: false,
        turmas: false,
        modulos: false,
      };

      assert.deepEqual(expected, params);
    });

    it('should return an object with values filled', function(done) {

      fs.readFile(__dirname + '/../fixtures/paramsFrequencia.html', function (err, file) {
        let html = file.toString();
        let params = Parser.consultaFrequencia.parseParams(html);

        fs.readFile(__dirname + '/../fixtures/paramsFrequencia.json', function(err, buff){
          let expected = JSON.parse(buff.toString());
          assert.deepEqual(expected, params);
          done();
        });

      }); // end fs

    }); // end it

  });

});
