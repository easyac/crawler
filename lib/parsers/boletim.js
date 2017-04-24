'use strict';

const cheerio = require('cheerio');
var atob    = require('atob');
var Parser = {};

const parseMatriculas = (html) => {
  const exp   = /Boletim.setMatriculas\(\[(.*)\]\);/ig;
  let matches = exp.exec(html);
  return matches ? JSON.parse('[' + matches[1] + ']') : false;
}

const parseParciais = (linha) => {
  let $ = cheerio.load(linha);
  let parciais = $('.boletimLinkParciais').attr('onclick');

  if(typeof parciais !== 'undefined'){
    let base64 = parciais
      .replace("javascript:showParciais(\'",'')
      .replace("\');",'');
    parciais = JSON.parse(atob(base64));
  }

  return parciais;
};

const parseBoletim = (html) => {
    let $ = cheerio.load(html);
    let data = [];

    $('table tbody tr').each((i, tr) => {
      let tds = $(tr).find('td');

      data.push({
        'cadeira': $(tds).eq(0).text(),
        'parciais': parseParciais(tr),
        'faltas': $(tds).eq(2).text(),
        'conceitoFinal': $(tds).eq(3).text(),
        'resultado': $(tds).eq(4).text()
      });
    });

    return data;
};

Parser.parseParams = (html) => {
  return parseMatriculas(html);
}

Parser.parseNotas = function (html, enturmacao) {
  return {
    enturmacao: enturmacao,
    boletim: parseBoletim(html)
  };

};

module.exports = Parser;
