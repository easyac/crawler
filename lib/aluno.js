'use strict';

module.exports = (function(session){
  const crawler = require('./api');

  let aluno = {};

  function getAluno(){
    return new Promise((resolve, reject) => {
      if(!session) reject('missing session');

      crawler.getCodigoAluno(session)
        .then((data) => {
          aluno.codigo = data;
          resolve(aluno);
        })
        .catch((err) => reject(err));
    });
  }

  function getTurmas(){
    return new Promise((resolve, reject) => {
      if(!aluno || !aluno.codigo) reject('missing aluno.codigo');

      crawler.browser.getNotas(session, aluno.codigo)
        .then(() => crawler.getParamsFrequencia(session, aluno.codigo))
        .then((data) => resolve(data))

    });
  }


  return {
    'get': getAluno,
    'getTurmas': getTurmas
  }

})
