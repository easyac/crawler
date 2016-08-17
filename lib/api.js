'use strict';

var request   = require('request');
var Browser   = require('./browser');
var Parser    = require('./parsers');
var Api       = {};

const baseRequest = request.defaults({
  headers : {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With':'XMLHttpRequest',
    'Referer': 'http://apsweb.senacrs.com.br/modulos/aluno/consultaHistorico.php5'
  }
});

/**
 * Faz o processo de login do usuário e retorna o Cookie
 * @param  String username Usuário do Portal
 * @param  String password Senha do Portal
 * @param  String unidade  Unidade do aluno
 * @return Promise
 */
Api.login = Browser.login;


/**
 * Retorna o HTML da
 * @param cookie
 * @param codigoAluno Código do aluno naquele semestre
 * @param codigoEnturmacao Código da Turma(?)
 * @returns {Promise}
 */
Api.getSituacaoCurricular = function(cookie, codigoAluno, codigoEnturmacao) {
    return new Promise(function(resolve, reject){
      let url = 'http://apsweb.senacrs.com.br/modulos/aluno/consultaHistorico.php5';

      baseRequest({
        url: url,
        method: 'POST',
        headers: {
            'Cookie': `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`
        },
        qs: {
            'codigoAluno': codigoAluno,
            'codigoEnturmacao': codigoEnturmacao
        },
        formData: {
            'ViewConsultaHistoricoXmlXsl[method]':'getConteudoSituacaoCurricular'
        }
      }, (err, data, body) => {
          if(err) reject(err);
          resolve(Parser.situacaoCurricular.parse(body));
      });
  });
};

/**
 *
 * @param cookie
 * @param codigoAluno
 * @returns {Promise}
 */
Api.getParamsSituacaoCurricular = function(cookie, codigoAluno) {
  return new Promise(function(resolve, reject){
    let url = 'http://apsweb.senacrs.com.br/modulos/aluno/consultaHistorico.php5';

    baseRequest({
      url: url,
      method: 'GET',
      headers: {
        'Cookie': `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`
      },
      qs: {
        'codigoAluno': codigoAluno
      }
    }, (err, data, body) => {
      if(err) reject(err);
      resolve(Parser.situacaoCurricular.parseParams(body));
    });
  });
};

Api.getCodigoAluno = function(cookie) {
  return new Promise(function(resolve, reject){
    let url = 'http://apsweb.senacrs.com.br/modulos/aluno/index.php5';

    baseRequest({
      url: url,
      method: 'GET',
      headers: {
        'Cookie': `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`
      },
    }, (err, data, body) => {
      if(err) reject(err);
      resolve(Parser.dadosAluno.parse(body));
    });
  });
};


/**
 * Procura por todos os títulos do aluno
 * @param cookie
 * @returns {Promise}
 */
Api.getTitulos = function (cookie) {
  return new Promise(function(resolve, reject){
    const url = 'http://apsweb.senacrs.com.br/modulos/aluno/consultaAreaFinanceira.php5';
    baseRequest({
      url: url,
      method: 'POST',
      headers: {
        'Cookie': `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`
      },
      qs: {
        'ViewConsultaAreaFinanceiraXmlXsl[method]':'loadParcelas',
        'gvroute': 'f1d7198dfddbbeeb432fa3f8727a6da8ef3a063c',
        'httpReferer': 'http://apsweb.senacrs.com.br/modulos/aluno/consultaAreaFinanceira.php5',
        'enturmacao': 'null'
      },
      formData: {
        'aluno':'Todos',
        'ano': 'Todos',
        'tipo': 'Todos'
      }
    }, (err, data, body) => {
      if(err) reject(err);
      resolve(JSON.parse(body));
    });
  });
};


/**
 * Procura por todos os títulos do aluno
 * @param cookie
 * @returns {Promise}
 */
Api.getParamsFrequencia = function (cookie, codigoAluno) {
  return new Promise(function(resolve, reject){
    const url = 'http://apsweb.senacrs.com.br/modulos/aluno/consultaFrequencia.php5';
    baseRequest({
      url: url,
      method: 'GET',
      headers: {
        'Cookie': `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`
      },
      qs: {
        'codigoAluno': codigoAluno
      }
    }, (err, data, body) => {
      if(err) reject(err);
      resolve(Parser.consultaFrequencia.parseParams(body));
    });
  });
};

/**
 * Retorna a frequencia com base no código do aluno e da Turma
 * @param cookie
 * @param codigoAluno
 * @param codigoTurma
 * @returns {Promise}
 */
Api.getFrequencia = function (cookie, codigoAluno, codigoTurma) {
  return new Promise(function(resolve, reject){
    const url = 'http://apsweb.senacrs.com.br/modulos/aluno/consultaFrequencia.php5';
    baseRequest({
      url: url,
      method: 'POST',
      headers: {
        'Cookie': `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`
      },
      qs: {
        'codigoAluno': codigoAluno
      },
      formData: {
        'ViewConsultaFrequenciaXmlXsl[method]': 'getDisciplinasFaltas',
        'codigoTurma': codigoTurma,
        'numeroModulo': 1,
      }
    }, (err, data, body) => {
      if(err) reject(err);
      resolve(Parser.consultaFrequencia.parse(body));
    });
  });
};


/**
 * Acessa a página inicial do portal e verifica se a sessão ainda está ativa
 * @param cookie
 * @returns {Promise}
 */
Api.isLoggedIn = function (cookie) {
    return new Promise(function(resolve, reject){
        let url = 'http://apsweb.senacrs.com.br/modulos/aluno/index.php5';

        baseRequest({
            url: url,
            method: 'GET',
            headers: {
                'Cookie': `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`
            },
        }, (err, data, body) => {
            if(err) reject(err);
            let matches = body.match(/<!--\ GVCOLLEGE_SESSION_EXPIRED\ -->/ig);
            return (matches) ? resolve(true) : resolve(false);
        });
    });
};


module.exports = Api;
