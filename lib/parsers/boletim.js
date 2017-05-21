const cheerio = require('cheerio');
const atob = require('atob');

const Parser = {};

const parseMatriculas = (html) => {
  const exp = /Boletim.setMatriculas\(\[(.*)\]\);/ig;
  const matches = exp.exec(html);
  return matches ? JSON.parse(`[${matches[1]}]`) : false;
};

const parseParciais = (linha) => {
  const $ = cheerio.load(linha);
  let parciais = $('.boletimLinkParciais').attr('onclick');
  const emptyParciais = parciais === "javascript:showParciais('');";

  if (typeof parciais !== 'undefined' && !emptyParciais) {
    const base64 = parciais
      .replace("javascript:showParciais(\'", '')
      .replace("\');", '');

    parciais = JSON.parse(atob(base64));
  }

  return parciais;
};

const getPeriodo = ($) => {
  const selector = '.boletimTabelaTop tr:nth-child(2) td:nth-child(4)';
  const periodoEl = $(selector).eq(0).text();
  const auxPeriodo = periodoEl.split('/');

  return {
    ano: parseInt(auxPeriodo[0], 10),
    semestre: parseInt(auxPeriodo[1], 10),
  };
};

const verifyHasAPS = ($) => {
  const APSSelector = '.boletimTabelaNotas tr:nth-child(1) td:nth-child(4)';
  return $(APSSelector).eq(0).text() === 'Falta APS';
};

const parseBoletim = (html) => {
  const $ = cheerio.load(html);
  const hasAPS = verifyHasAPS($);
  const { ano, semestre } = getPeriodo($);
  const data = [];

  $('table tbody tr').each((i, tr) => {
    const tds = $(tr).find('td');
    const obj = {
      cadeira: $(tds).eq(0).text(),
      parciais: parseParciais(tr),
      faltas: $(tds).eq(2).text(),
      ano,
      semestre,
    };

    if (hasAPS) {
      obj.aps = $(tds).eq(4).text();
      obj.conceitoFinal = $(tds).eq(5).text();
      obj.resultado = $(tds).eq(6).text();
    } else {
      obj.conceitoFinal = $(tds).eq(4).text();
      obj.resultado = $(tds).eq(5).text();
    }

    data.push(obj);
  });

  console.log(data);

  return data;
};

Parser.parseParams = html => parseMatriculas(html);

Parser.parseNotas = function parseNotas(html, enturmacao) {
  return {
    enturmacao,
    boletim: parseBoletim(html),
  };
};

module.exports = Parser;
