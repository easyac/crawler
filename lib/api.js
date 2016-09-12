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
    'Referer': 'http://apsweb.senacrs.com.br/modulos/aluno/consultaHistorico.php5',
    'Origin': 'http://apsweb.senacrs.com.br'
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

Api.browser = Browser;

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
            'Cookie': `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`,
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
 * Retorna as notas obtidas em determinado semestre
 * @param cookie
 * @param codigoEnturmacao Código da Turma(?)
 * @returns {Promise}
 */
Api.getNotas = function(cookie, enturmacao) {
    return new Promise(function(resolve, reject){
      let url = 'http://apsweb.senacrs.com.br/modulos/aluno/boletim.php5';
      baseRequest({
        url: url,
        method: 'POST',
        headers: {
          'Connection': 'keep-alive',
          'Save-Data':'on',
          'Cookie': `PHPSESSID=${cookie};`,
          'Referer': 'http://apsweb.senacrs.com.br/modulos/aluno/boletim.php5?aluno=1070153'
        },
        qs: {
          'ViewBoletimXmlXsl[method]': 'loadTemplate',
          'ajax': '1'
        },
        formData: {
          'enturmacao': enturmacao,
          'gvroute': 'f1d7198dfddbbeeb432fa3f8727a6da8ef3a063c'
        }
      }, (err, data, body) => {
          // console.log(data.statusCode, data.statusMessage);
          if(err) reject(err);
          resolve(Parser.boletim.parseNotas(body));
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
      resolve({ titulos: JSON.parse(body) });
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

Api.findTurma = (data, ano, semestre) => {
  let periodo = '2016|1';
  if(ano && semestre)
    periodo = `${ano}|${semestre}`;

  let turma = data.consultaFrequencia
    .modulos
    .filter((el) => el.periodo === periodo)
    .map((el) => el.turma)
    .reduce((prev, el) => el);
  return turma;
};

/**
 * Retorna a frequencia com base no código do aluno e da Turma
 * @param cookie
 * @param codigoAluno
 * @param codigoTurma
 * @returns {Promise}
 */
Api.getFrequencia = function (cookie, codigoAluno, ano, semestre) {
  let self = this;
  return this
    .getParamsFrequencia(cookie, codigoAluno)
    .then((data) => {
      let turma = self.findTurma(data,ano,semestre);
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
            'codigoTurma': turma,
            'numeroModulo': 1,
          }
        }, (err, data, body) => {
          if(err) reject(err);
          resolve(Parser.consultaFrequencia.parse(body));
        });
      });

    })

  ;


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
            return (matches) ? resolve(false) : resolve(true);
        });
    });
};


module.exports = Api;
