const request = require('request');
const debug = require('debug')('crawler');
const Iconv = require('iconv').Iconv;
const Browser = require('./browser');
const Aluno = require('./aluno');
const Parser = require('./parsers');

const Api = {};

const baseRequest = request.defaults({
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    Referer: 'http://apsweb.senacrs.com.br/modulos/aluno/consultaHistorico.php5',
    Origin: 'http://apsweb.senacrs.com.br',
  },
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

Api.aluno = Aluno;

/**
 * Retorna o HTML da
 * @param cookie
 * @param codigoAluno Código do aluno naquele semestre
 * @param codigoEnturmacao Código da Turma(?)
 * @returns {Promise}
 */
Api.getSituacaoCurricular = function getSituacaoCurricular(cookie, codigoAluno, codigoEnturmacao) {
  return new Promise((resolve, reject) => {
    const url = 'http://apsweb.senacrs.com.br/modulos/aluno/consultaHistorico.php5';

    baseRequest({
      url,
      method: 'POST',
      headers: {
        Cookie: `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`,
      },
      qs: {
        codigoAluno,
        codigoEnturmacao,
      },
      formData: {
        'ViewConsultaHistoricoXmlXsl[method]': 'getConteudoSituacaoCurricular',
      },
    }, (err, data, body) => {
      if (err) reject(err);
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
Api.getNotas = function getNotas(cookie, enturmacao) {
  return new Promise((resolve, reject) => {
    const url = 'http://apsweb.senacrs.com.br/modulos/aluno/boletim.php5';
    baseRequest({
      url,
      method: 'POST',
      encoding: null,
      headers: {
        Connection: 'keep-alive',
        'Save-Data': 'on',
        Cookie: `PHPSESSID=${cookie};`,
      },
      qs: {
        'ViewBoletimXmlXsl[method]': 'loadTemplate',
        ajax: '1',
      },
      formData: {
        enturmacao,
        gvroute: 'f1d7198dfddbbeeb432fa3f8727a6da8ef3a063c',
      },
    }, (err, data, body) => {
      if (err) reject(err);
      const iconv = new Iconv('ISO-8859-1', 'UTF8');
      const bodyConverted = iconv.convert(body);
      const res = Parser.boletim.parseNotas(bodyConverted, enturmacao);
      resolve(res);
    });
  });
};

/**
 *
 * @param cookie
 * @param codigoAluno
 * @returns {Promise}
 */
Api.getParamsSituacaoCurricular = function getParamsSituacaoCurricular(cookie, codigoAluno) {
  return new Promise((resolve, reject) => {
    const url = 'http://apsweb.senacrs.com.br/modulos/aluno/consultaHistorico.php5';

    baseRequest({
      url,
      method: 'GET',
      headers: {
        Cookie: `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`,
      },
      qs: {
        codigoAluno,
      },
    }, (err, data, body) => {
      if (err) reject(err);
      resolve(Parser.situacaoCurricular.parseParams(body));
    });
  });
};

Api.getCodigoAluno = function getCodigoAluno(cookie) {
  debug('Api.getCodigoAluno started');
  return new Promise((resolve, reject) => {
    const url = 'http://apsweb.senacrs.com.br/modulos/aluno/index.php5';

    baseRequest({
      url,
      method: 'GET',
      headers: {
        Cookie: `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`,
      },
    }, (err, data, body) => {
      if (err) {
        debug('Api.getCodigoAluno err: %o', err);
        reject(err);
      }
      const parsedBody = Parser.dadosAluno.parse(body);
      debug('Api.getCodigoAluno resolve: %o', parsedBody);
      resolve(parsedBody);
    });
  });
};

/**
 * Procura por todos os títulos do aluno
 * @param cookie
 * @returns {Promise}
 */
Api.getTitulos = function getTitulos(cookie) {
  return new Promise((resolve, reject) => {
    const url = 'http://apsweb.senacrs.com.br/modulos/aluno/consultaAreaFinanceira.php5';
    baseRequest({
      url,
      method: 'POST',
      headers: {
        Cookie: `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`,
      },
      qs: {
        'ViewConsultaAreaFinanceiraXmlXsl[method]': 'loadParcelas',
        gvroute: 'f1d7198dfddbbeeb432fa3f8727a6da8ef3a063c',
        httpReferer: 'http://apsweb.senacrs.com.br/modulos/aluno/consultaAreaFinanceira.php5',
        enturmacao: 'null',
      },
      formData: {
        aluno: 'Todos',
        ano: 'Todos',
        tipo: 'Todos',
      },
    }, (err, data, body) => {
      if (err) reject(err);
      resolve({ titulos: JSON.parse(body) });
    });
  });
};

/**
 * Procura por todos os títulos do aluno
 * @param cookie
 * @returns {Promise}
 */
Api.getParamsFrequencia = function getParamsFrequencia(cookie, codigoAluno) {
  return new Promise((resolve, reject) => {
    const url = 'http://apsweb.senacrs.com.br/modulos/aluno/consultaFrequencia.php5';
    baseRequest({
      url,
      method: 'GET',
      headers: {
        Cookie: `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`,
      },
      qs: {
        codigoAluno,
      },
    }, (err, data, body) => {
      if (err) reject(err);
      resolve(Parser.consultaFrequencia.parseParams(body));
    });
  });
};

/**
 * Encontra todos os códigos de "enturmacao" e retorna
 * @param cookie
 * @returns {Promise}
 */
Api.getParamsBoletim = function getParamsBoletim(cookie, codigoAluno) {
  return new Promise((resolve, reject) => {
    const url = 'http://apsweb.senacrs.com.br/modulos/aluno/boletim.php5';
    baseRequest({
      url,
      method: 'GET',
      headers: {
        Cookie: `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`,
      },
      qs: {
        aluno: codigoAluno,
      },
    }, (err, data, body) => {
      if (err) reject(err);
      resolve(Parser.boletim.parseParams(body));
    });
  });
};

Api.findTurma = (data, ano, semestre) => {
  let periodo = '2016|1';
  if (ano && semestre) { periodo = `${ano}|${semestre}`; }

  const turma = data.consultaFrequencia
    .modulos
    .filter(el => el.periodo === periodo)
    .map(el => el.turma)
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
Api.getFrequencia = function getFrequencia(cookie, codigoAluno, ano, semestre) {
  const self = this;
  return this
    .getParamsFrequencia(cookie, codigoAluno)
    .then((data) => {
      const turma = self.findTurma(data, ano, semestre);
      return new Promise((resolve, reject) => {
        const url = 'http://apsweb.senacrs.com.br/modulos/aluno/consultaFrequencia.php5';
        baseRequest({
          url,
          method: 'POST',
          headers: {
            Cookie: `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`,
          },
          qs: {
            codigoAluno,
          },
          formData: {
            'ViewConsultaFrequenciaXmlXsl[method]': 'getDisciplinasFaltas',
            codigoTurma: turma,
            numeroModulo: 1,
          },
        }, (err, data, body) => {
          if (err) reject(err);
          resolve(Parser.consultaFrequencia.parse(body, ano, semestre));
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
Api.isLoggedIn = function isLoggedIn(cookie) {
  return new Promise((resolve, reject) => {
    const url = 'http://apsweb.senacrs.com.br/modulos/aluno/index.php5';

    baseRequest({
      url,
      method: 'GET',
      headers: {
        Cookie: `PHPSESSID=${cookie}; ys-path_menu_aluno=s%3A/ynode-7/ynode-23/ynode-29`,
      },
    }, (err, data, body) => {
      if (err) reject(err);
      const matches = body.match(/<!-- GVCOLLEGE_SESSION_EXPIRED -->/ig);
      return (matches) ? resolve(false) : resolve(true);
    });
  });
};


module.exports = Api;
