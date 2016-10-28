'use strict';

var Parser = {};


const getMatches = (html, exp) => {
  let matches = exp.exec(html);
  return matches ? JSON.parse(matches[1]) : false;
}

const parseCursos = (html) => {
  const exp = /ConsultaFrequencia.storeCursos.loadData\( Ext.decode\('(.*)'\) \)/ig;
  return getMatches(html, exp);
};

const parseCiclos = (html) => {
  const exp = /ConsultaFrequencia.storeCiclos.loadData\( Ext.decode\('(.*)'\) \)/ig;
  return getMatches(html, exp);
};

const parsePeriodos = (html) => {
  const exp = /ConsultaFrequencia.storePeriodos.loadData\( Ext.decode\('(.*)'\) \)/ig;
  return getMatches(html, exp);
};

const parseTurmas = (html) => {
  const exp = /ConsultaFrequencia.storeTurmas.loadData\( Ext.decode\('(.*)'\) \)/ig;
  return getMatches(html, exp);
};

const parseModulos= (html) => {
  const exp = /ConsultaFrequencia.storeModulos.loadData\( Ext.decode\('(.*)'\) \)/ig;
  return getMatches(html, exp);
};

Parser.parse = function (html, ano, semestre) {

  try{
    let json = JSON.parse(html);
    json.data.ano = ano;
    json.data.semestre = semestre;

    return json.data;
  }
  catch(err){
    return { data: { ano: ano, semestre: semestre } };
  }

};

Parser.parseParams = function (html) {
  return {
    'consultaFrequencia' : {
      cursos: parseCursos(html),
      ciclos: parseCiclos(html),
      periodos: parsePeriodos(html),
      turmas: parseTurmas(html),
      modulos: parseModulos(html),
    }
  };
};

module.exports = Parser;
