'use strict';

var assert    = require('assert');
const Browser = require(__dirname + '/../lib/browser');


describe('Browser', function() {
  describe('.mapCookie', function() {
    it('should return cookie.value for PHPSESSID', function() {
      let cookies = [
        {
          name: "teste",
          value: "teste"
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
          name: "teste",
          value: "teste"
        }
      ];

      assert.equal(false, Browser.mapCookies(cookies));
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
});
