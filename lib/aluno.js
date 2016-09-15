'use strict';

module.exports = (function(session){
  const crawler = require('./api');
  const NormalizerTurma = require('./normalizer/turma');

  let aluno = {};

  function getAluno(){
    return new Promise((resolve, reject) => {
      if(!session) reject('missing session');

      return crawler.getCodigoAluno(session)
        .then((data) => {
          aluno.codigo = data;
          return resolve(aluno);
        })
        .catch((err) => reject(err));
    });
  }

  function getTurmas(){
    return new Promise((resolve, reject) => {
      if(!aluno || !aluno.codigo) reject('missing aluno.codigo');
      let turmas = {};

      crawler.browser.getNotas(session, aluno.codigo)
        .then(() => crawler.getParamsFrequencia(session, aluno.codigo))

        // Encontra todas as turmas
        .then((data) => {
          turmas = NormalizerTurma.normalizeFromFrequencia(data);

          let promises = turmas.map((turma) => {
            return crawler.getFrequencia(session, aluno.codigo, turma.ano, turma.semestre);
          });

          return Promise.all(promises);
        })

        // encontra todos os códigos de enturmação
        .then((responses) => {
          let enturmacoes = NormalizerTurma.normalizeEnturmacao(responses);
          let data = NormalizerTurma.mergeEnturmaTurma(turmas, enturmacoes);
          turmas = data;

          let promises = turmas.map((turma) => {
            return crawler.getNotas(session, turma.codigoEnturmacao);
          });

          return Promise.all(promises);
        })

        //
        .then((responses) => {
          resolve(responses);
        });
    });
  }

  return {
    'get': getAluno,
    'getTurmas': getTurmas
  };

});
