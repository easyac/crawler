'use strict';

var Parser = {};

Parser.parseCodigoAluno = (html) => {
  const exp = /codigoAluno=(\w*)"/ig;
  let matches = exp.exec(html);
  return matches ? JSON.parse(matches[1]) : false;
};

Parser.parse = function (html) {
  return Parser.parseCodigoAluno(html);
};


module.exports = Parser;
