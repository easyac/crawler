'use strict';

var Nightmare  = require('nightmare')
  , vo         = require('vo')
  , Browser    = {}
  ;

/**
 * Retorna o primeiro response (cookie)
 */
Browser.getFirstResponse = function(responses){
  return responses[0];
}

/**
 * Faz o processo de login do usuário e retorna o Cookie
 * @param  String username Usuário do Portal
 * @param  String password Senha do Portal
 * @param  String unidade  Unidade do aluno
 * @return Promise      [description]
 */
Browser.login = function(username, password, unidade){
  return new Promise(function(resolve, reject){
    vo([
      runLogin(username, password, unidade)
    ], Browser.getFirstResponse)
        .then((result) => resolve(result))
        .catch((err) => reject(err))
  })
}

Browser.mapCookies = (cookies) => {
  return cookies
        .filter((cookie, idx) => {
          if(cookie.name === 'PHPSESSID')
            return cookie;
        })
        .map((cookie) => {
          return cookie.value;
        });
}

function *runLogin(username, password, unidade) {
  let nightmare = Nightmare({
    show: false,
    webPreferences: {
      images: false
    }
  });

  yield nightmare
    .useragent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36')
    .goto('http://apsweb.senacrs.com.br/modulos/aluno')
    .wait('a')
    .click('a')
    .wait(100)
    .wait(function(){
      return (document.getElementById('carregandoUnidades').style.visibility == 'hidden')
    })
    .select('#lstUnidades', unidade)
    .type('#usr', username)
    .type('[name=passwd]', password)
    .click('#btnEntrar')
    .wait('iframe');

  let cookies = yield nightmare
    .cookies.get()
    .then(function(cookies){
      return cookies;
    });

  console.log(cookies);

  yield nightmare.end();

  return Browser.mapCoockies(cookies);
}


module.exports = Browser;
