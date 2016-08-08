'use strict';

/**
 * USAGE:  node index.js {user} {password} {unidade}
 */
var fs         = require('fs')
  , senacApi   = require('./lib/index')
  , user       = process.argv[2] || 631420378
  , password   = process.argv[3] || 'password'
  , unidade    = process.argv[4] || '1,63'
  ;


/**
 * Login Example
 */
senacApi
    .login(user, password, unidade)
    .then((cookie) => {
        fs.writeFile('./cookie.json', JSON.stringify(cookie));
    })
    .catch((err) => console.log(err) );


fs.readFile('./cookie.json', function (err, data) {
    let cookie = JSON.parse(data.toString());
    let codigoAluno = 1070153;

    senacApi.isLoogedIn(cookie.value)
      .then(function (data) {
        return senacApi.getParamsFrequencia(cookie.value, codigoAluno);
      })
      .then(function (data) {
        let periodo = '2016|1';

        let turma = data.modulos
          .filter((el, i) => el.periodo == periodo)
          .map((el, i) => el.turma)
          .reduce((prev, el) => el);

        return senacApi.getFrequencia(cookie.value, codigoAluno, turma);
      })
      .then(function(situacaoCurricular){
        console.log(JSON.stringify(situacaoCurricular));
      })
      .catch(function(err){
        console.log(err);
      });
});
