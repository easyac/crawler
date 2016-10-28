/* globals describe, it */
'use strict';

var assert    = require('assert');
const Browser = require(__dirname + '/../lib/browser');


describe('Browser', function() {

  it('should not show the window frame ', function (){

  })

  describe('.mapCookie', function() {
    it('should return cookie.value for PHPSESSID', function() {
      let cookies = [
        {
          name: 'teste',
          value: 'teste'
        },
        {
          name: 'PHPSESSID',
          value: 'n81jm6g314vgno6kqj8oe96rb4',
          domain: 'apsweb.senacrs.com.br',
          hostOnly: true,
          path: '/',
          secure: false,
          httpOnly: false,
          session: true
        }
      ];

      assert.equal('n81jm6g314vgno6kqj8oe96rb4', Browser.mapCookies(cookies));
    });

    it('should return false if doen\'t have cookie PHPSESSID', function() {
      let cookies = [
        {
          name: 'teste',
          value: 'teste'
        }
      ];

      assert.equal(false, Browser.mapCookies(cookies));
    });
  });

  describe('.fixUnidade', function() {
    it('should add \'1,\' before unidade if passed a number', function() {
      let unidade = Browser._fixUnidade(63);
      assert.equal('1,63', unidade);
    });

    it('should add \'1,\' before unidade if passed a String', function() {
      let unidade = Browser._fixUnidade('63');
      assert.equal('1,63', unidade);
    });

    it('should return unidade as is', function() {
      let unidade = Browser._fixUnidade('1,63');
      assert.equal('1,63',unidade);
    });

    it('should return null', function() {
      let unidade = Browser._fixUnidade();
      assert.equal(null,unidade);
    });
  });

  describe('.getFirstResponse', function() {
    it('should return the only cookie with name equals PHPSESSID', function() {
      let cookies = [
        {
          name: 'PHPSESSID',
          value: 'n81jm6g314vgno6kqj8oe96rb4',
          domain: 'apsweb.senacrs.com.br',
          hostOnly: true,
          path: '/',
          secure: false,
          httpOnly: false,
          session: true
        }
      ];

      let response = {
        name: 'PHPSESSID',
        value: 'n81jm6g314vgno6kqj8oe96rb4',
        domain: 'apsweb.senacrs.com.br',
        hostOnly: true,
        path: '/',
        secure: false,
        httpOnly: false,
        session: true
      };

      assert.deepEqual(response, Browser.getFirstResponse(cookies));
    });
  });

  describe('.login', function(){

    it('should reject if not all parameters filled', function(done){
      Browser
        .login()
        .catch((err) => {
          assert.equal(err, 'All the parameters must be fullfilled');
          done();
        });
    });

    xit('should reject if login fail', function(done){
      this.timeout(0);
      Browser
        .login('1234', '1234', 63)
        .catch((err) => {
          assert.equal(err, 'Login failed');
          done();
        });
    });
  });

  describe('.getNotas', function(){

    it('should call url ', function(done){
      Browser
        .getNotas('asdiuasoid', 12898)
        .then((value) => {
          assert.equal(value, true);
          done();
        });
    });

    it('should not call url ', function(done){
      Browser
        .getNotas()
        .catch((value) => {
          assert.equal(value, 'Params missing');
          done();
        });
    });

  });
});
