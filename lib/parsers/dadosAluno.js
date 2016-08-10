'use strict';

// const cheerio = require('cheerio');
var Parser = {};


const getMatches = (html, exp) => {
  let matches = exp.exec(html);
  return matches ? JSON.parse(matches[1]) : false;
}

Parser.parseCodigoAluno = (html) => {
  const exp = /codigoAluno=(\w*)"/ig;
  return getMatches(html, exp);
};

Parser.parse = function (html) {
  return Parser.parseCodigoAluno(html);
};


module.exports = Parser;
