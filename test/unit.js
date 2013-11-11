var should  = require('should');
var cleaner = require('..');

var utils = require('./utils');
var connect = utils.connect;

describe('cleaner', function() {
  describe('options', function() {
    var instance;

    before(function() {
      instance = cleaner();
    });

    it('should be exposed', function(done) {
      should.exist(instance._options);
      done();
    });

    it('should have attributes', function(done) {
      instance._options.should.have.property('add');
      instance._options.should.have.property('clean');
      instance._options.should.have.property('code');
      instance._options.should.have.property('normalize');
      instance._options.should.have.property('sanitize');
      done();
    });

    describe('custom options', function() {
      it('should have defaulting `clean: true, code: 302`', function(done) {
        instance = cleaner();

        instance._options.clean.should.be.true;
        instance._options.code.should.equal(301);
        done();
      });

      it('should set `code: 302`, using `Number`', function(done) {
        instance = cleaner(302);

        instance._options.code.should.equal(302);
        done();
      });

      it('should set `code: 302`, using `Object`', function(done) {
        instance = cleaner({ code: 302 });

        instance._options.code.should.equal(302);
        done();
      });

      it('should be `clean: false` when `add: true`', function(done) {
        instance = cleaner({ add: true });

        instance._options.add.should.be.true;
        instance._options.clean.should.be.false;
        done();
      });

      it('should be `clean: false` when `add, true`, even if explicit', function(done) {
        instance = cleaner({
          add: true,
          clean: true
        });

        instance._options.add.should.be.true;
        instance._options.clean.should.be.false;
        done();
      });

      it('should be `clean: false` when `sanitize: true`', function(done) {
        instance = cleaner({ sanitize: true });

        instance._options.sanitize.should.be.true;
        instance._options.clean.should.be.false;
        done();
      });

      describe('getter/setter system', function() {
        var instance;

        before(function() {
          instance = cleaner();
        });

        it('should return `options` copy', function(done) {
          instance.get().should.be.an.Object;
          instance.get().should.have.keys(['add', 'clean', 'code', 'immediate', 'normalize', 'pass', 'sanitize']);
          done();
        });

        it('should return `code, 301` (default)', function(done) {
          instance.get('code').should.equal(301);
          done();
        });

        it('should set `code, 302`', function(done) {
          instance.set('code', 302).get().should.include({ code: 302 });
          done();
        });

        it('should set `add: true, clean: false`', function(done) {
          instance.set('add', true).get().should.include({ add: true, clean: false });
          done();
        });

        it('should set `sanitize: true, add: true` withing settings object', function(done) {
          instance.set({ sanitize: true, add: true }).get().should.include({ sanitize: true, add: true });
          done();
        });
      });
    });
  });

  describe('processing', function() {
    describe('default options', function() {
      var instance;

      before(function() {
        instance = cleaner();
      });

      it('should pass `/Users`', function(done) {
        var app = connect({ url: '/Users' });

        app
          .use(instance)
          .handle(function(data) {
            data._next.should.be.true;
            done();
          });
      });

      it('should redirect `/Users/` to `/Users` with code `301`', function(done) {
        var app = connect({ url: '/Users/' });

        app
          .use(instance)
          .handle(function(data) {
            data._code.should.equal(301);
            data._url.should.equal('/Users');
            done();
          });
      });

      it('should response `///?/?/?` with 404', function(done) {
        var app = connect({ url: '///?/?/?' });

        app
          .use(instance)
          .handle(function(data) {
            data._code.should.equal(400);
            done();
          });
      });
    });

    describe('custom options', function() {
      describe('add', function() {
        it('should pass `/users/`', function(done) {
          var app = connect({ url: '/users/' });
          var instance = cleaner({ add: true });

          app
            .use(instance)
            .handle(function(data) {
              data._next.should.be.true;
              done();
            });
        });

        it('should redirect `/users` to `/users/`', function(done) {
          var app = connect({ url: '/users' });
          var instance = cleaner({ add: true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users/');
              done();
            });
        });

        it('should redirect `/users?foo=bar` to `/users/?foo=bar`', function(done) {
          var app = connect({ url: '/users?foo=bar' });
          var instance = cleaner({ add: true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users/?foo=bar');
              done();
            });
        });
      });

      describe('clean', function() {
        it('should pass `/users`', function(done) {
          var app = connect({ url: '/users' });
          var instance = cleaner({ clean: true });

          app
            .use(instance)
            .handle(function(data) {
              data._next.should.be.true;
              done();
            });
        });

        it('should redirect `/users/` to `/users`', function(done) {
          var app = connect({ url: '/users/' });
          var instance = cleaner({ clean: true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users');
              done();
            });
        });

        it('should redirect `/users/?foo=bar` to `/users?foo=bar`', function(done) {
          var app = connect({ url: '/users/?foo=bar' });
          var instance = cleaner({ clean: true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users?foo=bar');
              done();
            });
        });
      });

      describe('sanitize', function() {
        it('should pass `/users`', function(done) {
          var app = connect({ url: '/users' });
          var instance = cleaner({ 'sanitize': true });

          app
            .use(instance)
            .handle(function(data) {
              data._next.should.be.true;
              done();
            });
        });

        it('should redirect `/users//` to `/users`', function(done) {
          var app = connect({ url: '/users//' });
          var instance = cleaner({ sanitize: true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users');
              done();
            });
        });

        it('should redirect `/users/?foo=Bar&color=black&` to `/users?foo=Bar&color=black`', function(done) {
          var app = connect({ url: '/users/?foo=Bar&color=black&' });
          var instance = cleaner({ sanitize: true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users?foo=Bar&color=black');
              done();
            });
        });
      });

      describe('normalize', function() {
        it('should pass `/users`', function(done) {
          var app = connect({ url: '/users' });
          var instance = cleaner({ normalize: true });

          app
            .use(instance)
            .handle(function(data) {
              data._next.should.be.true;
              done();
            });
        });

        it('should redirect `/Users` to `/users`', function(done) {
          var app = connect({ url: '/Users' });
          var instance = cleaner({ normalize: true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users');
              done();
            });
        });

        it('should redirect `/Users?foo=Bar` to `/users?foo=Bar`', function(done) {
          var app = connect({ url: '/Users?foo=Bar' });
          var instance = cleaner({ normalize: true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users?foo=Bar');
              done();
            });
        });
      });
    });
  });
});
