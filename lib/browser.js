'use strict';

var Nightmare  = require('nightmare');
var vo         = require('vo');
var Browser    = {};

function fixUnidade(unidade) {
  if(!unidade) return;

  if (typeof unidade === 'number')
    unidade = unidade.toString();

  if(unidade.indexOf(',') !== -1)
    return unidade;

  return '1,' + unidade;
}

/* test only */
Browser._fixUnidade = fixUnidade;
/* end test only */

/**
 * Retorna o primeiro response (cookie)
 */
Browser.getFirstResponse = function(responses){
  return responses[0];
};

/**
 * Faz o processo de login do usuário e retorna o Cookie
 * @param  username Usuário do Portal
 * @param  password Senha do Portal
 * @param  unidade  Unidade do aluno
 * @return Promise  Retorna a String do Cookie ou Reject
 */
Browser.login = function(username, password, unidade){
  return new Promise(function(resolve, reject){
    if(username == undefined || password == undefined || unidade == undefined){
      return reject('All the parameters must be fullfilled');
    }
    else{
      unidade = fixUnidade(unidade);
      vo([
        runLogin(username, password, unidade)
      ], Browser.getFirstResponse)
        .then((result) => {
          return (result) ? resolve(result) : reject('Login failed');
        })
        .catch((err) => reject(err));
    }

  });
};

Browser.getNotas = function(cookie, aluno){
  return new Promise(function(resolve, reject){
      vo([
        runNotas(cookie, aluno)
      ], Browser.getFirstResponse)
        .then((result) => {
          return (result) ? resolve(result) : reject('Params missing');
        })
        .catch((err) => reject(err));
    });
};

Browser.mapCookies = (cookies) => {
  let mCookies = cookies
        .filter((cookie) => {
          if(cookie.name === 'PHPSESSID')
            return cookie;
        })
        .map((cookie) => {
          return cookie.value;
        });

  if(mCookies.length === 0)
    return false;

  return mCookies.reduce((total, cur) => total+= cur);
};

function *runLogin(username, password, unidade) {
  let nightmare = Nightmare({
    show: false,
    webPreferences: {
      images: false
    }
  });

  // Efetua o Login
  yield nightmare
    .useragent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36')
    .goto('http://apsweb.senacrs.com.br/modulos/aluno')
    .wait('a')
    .click('a')
    .wait(100)
    .wait('body')
    .evaluate(function(){
      oAjax.requester.map(function(el){ el.abort() });
    })
    .inject('js', __dirname + '/evil.js')
    .select('#lstUnidades', unidade)
    .type('#usr', username)
    .type('[name=passwd]', password)
    .click('#btnEntrar')
    .wait(function(){
      var textFailed = document.querySelector('span[style="color:red"]');
      var loginFailed   = textFailed ? textFailed.innerHTML.trim() !== '': false;
      var loginSuccess  = document.querySelectorAll('iframe').length;
      return loginFailed || loginSuccess;
    });



  let isLoggedIn = yield nightmare
    .evaluate(function(){
      return document.querySelectorAll('iframe').length;
    });

  let cookies = yield nightmare
    .cookies.get()
    .then(function(cookies){
      return cookies;
    });

  yield nightmare.end();

  if(!isLoggedIn)
    return false;

  return Browser.mapCookies(cookies);
}

function *runNotas(cookie, aluno) {
  if(!cookie || !aluno) return;
  let nightmare = Nightmare({
    show: false,
    webPreferences: {
      images: false
    }
  });

  yield nightmare
    .useragent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36')
    .cookies.set({
      'url': 'http://apsweb.senacrs.com.br/modulos/aluno/boletim.php5?aluno=' + aluno,
      name: 'PHPSESSID',
      value: cookie,
      domain: 'apsweb.senacrs.com.br',
      hostOnly: true,
      path: '/',
      secure: false,
      httpOnly: false,
      session: true
    })
    .goto('http://apsweb.senacrs.com.br/modulos/aluno/boletim.php5?aluno=' + aluno)

  yield nightmare.end();

  return true;
}


module.exports = Browser;
