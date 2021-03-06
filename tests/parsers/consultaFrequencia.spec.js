/* globals describe, it */
'use strict';

var assert    = require('assert');
var fs        = require('fs');
const Parser  = require(__dirname + '/../../lib/parsers');


describe('Parser.consultaFrequencia', function() {

  describe('.parse', function() {
    it('should return an object with values filled if invalid json', function() {
      let html   = '<html></html>';
      let ano = 2016;
      let semestre = 2;
      let params = Parser.consultaFrequencia.parse(html, ano, semestre);

      let expected = {
        data: {
          ano: ano,
          semestre: semestre
        }
      };

      assert.deepEqual(expected, params);
      assert.equal(params.data.ano, ano);
      assert.equal(params.data.semestre, semestre);
    });

    it('should return an object with values filled', function() {
      let html   = fs.readFileSync(__dirname + '/../fixtures/frequencia.json').toString();
      let ano = 2016;
      let semestre = 2;
      let parsed = Parser.consultaFrequencia.parse(html, ano, semestre);

      assert.equal(parsed.ano, ano);
      assert.equal(parsed.semestre, semestre);
      assert.equal(parsed.enturmacoes.length, 1);
    });
  });

  describe('.parseParams', function() {

    it('should return an object with values equals false', function() {
      let html   = '<html></html>';
      let params = Parser.consultaFrequencia.parseParams(html);

      let expected = {
        consultaFrequencia: {
          cursos: false,
          ciclos: false,
          periodos: false,
          turmas: false,
          modulos: false
        }
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
