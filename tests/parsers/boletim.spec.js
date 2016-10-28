'use strict';

var assert    = require('assert');
var fs        = require('fs');
const Parser  = require(__dirname + '/../../lib/parsers');

describe('Parser.boletim', function() {

  describe('.enturmacao', function() {
    it('should return the same value of param', function() {
      let enturmacao = 'banana';
      let parsed = Parser.boletim.parseNotas('<title></title>', enturmacao);

      assert.equal(parsed.enturmacao, enturmacao);
    });

    it('should return an empty array if invalid html', function() {
      let enturmacao = 'banana';
      let parsed = Parser.boletim.parseNotas('<title></title>', enturmacao);

      assert.equal(Array.isArray(parsed.boletim), true);
      assert.equal(parsed.boletim.length, 0);
    });

    it('should add parciais to array if valid html', function() {
      let enturmacao = 'banana';
      let html = fs.readFileSync(__dirname + '/../fixtures/boletim.html').toString()
      let parsed = Parser.boletim.parseNotas(html, enturmacao);
      let expected = { enturmacao: 'banana', boletim: [ { cadeira: 'TCC I', parciais: undefined, faltas: '12', conceitoFinal: '12', resultado: 'SC' }, { cadeira: 'Sistemas Distribuídos', parciais: [Object], faltas: '30', conceitoFinal: '30', resultado: 'D' }, { cadeira: 'Tópicos Avançados em ADS', parciais: [Object], faltas: '10', conceitoFinal: '10', resultado: 'A' }, { cadeira: 'Qualidade de Software', parciais: [Object], faltas: '20', conceitoFinal: '20', resultado: 'C' } ] }

      assert.equal(parsed.boletim.length, 4);
      assert.equal(parsed.boletim[0].cadeira, 'TCC I');
      assert.equal(parsed.boletim[0].parciais, undefined);
      assert.equal(parsed.boletim[1].parciais.length, 3);

    });



  });

});
