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

    it('should have properties', function(done) {
      instance._options.should.have.property('add');
      instance._options.should.have.property('clean');
      instance._options.should.have.property('code');
      instance._options.should.have.property('normalize');
      instance._options.should.have.property('sanitize');
      done();
    });

    describe('custom options', function() {
      it('should be `clean: true` and `code: 302` by default', function(done) {
        instance = cleaner();

        instance._options.clean.should.be.true;
        instance._options.code.should.equal(301);
        done();
      });

      it('`code` should be set to 302', function(done) {
        instance = cleaner({ 'code': 302 });

        instance._options.code.should.equal(302);
        done();
      });

      it('`clean` should be false when `add` is true', function(done) {
        instance = cleaner({ 'add': true });

        instance._options.add.should.be.true;
        instance._options.clean.should.be.false;
        done();
      });

      it('`clean` should be false when `add` is true, even if explicit', function(done) {
        instance = cleaner({
          'add': true,
          'clean': true
        });

        instance._options.add.should.be.true;
        instance._options.clean.should.be.false;
        done();
      });

      it('`clean` should be false when `sanitize` is true', function(done) {
        instance = cleaner({ 'sanitize': true });

        instance._options.sanitize.should.be.true;
        instance._options.clean.should.be.false;
        done();
      });
    });
  });

  describe('processing', function() {
    describe('default options', function() {
      it('should pass `/Users`', function(done) {
        var app = connect({ 'url': '/Users' });
        var instance = cleaner();

        app
          .use(instance)
          .handle(function(data) {
            data._next.should.be.true;
            done();
          });
      });

      it('should redirect from `/Users/` to `/Users` with code `301`', function(done) {
        var app = connect({ 'url': '/Users/' });
        var instance = cleaner();

        app
          .use(instance)
          .handle(function(data) {
            data._code.should.equal(301);
            data._url.should.equal('/Users');
            done();
          });
      });
    });

    describe('custom options', function() {
      describe('add', function() {
        it('should pass `/users/`', function(done) {
          var app = connect({ 'url': '/users/' });
          var instance = cleaner({ 'add': true });

          app
            .use(instance)
            .handle(function(data) {
              data._next.should.be.true;
              done();
            });
        });

        it('should redirect from `/users` to `/users/`', function(done) {
          var app = connect({ 'url': '/users' });
          var instance = cleaner({ 'add': true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users/');
              done();
            });
        });

        it('should redirect from `/users?foo=bar` to `/users/?foo=bar`', function(done) {
          var app = connect({ 'url': '/users?foo=bar' });
          var instance = cleaner({ 'add': true });

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
          var app = connect({ 'url': '/users' });
          var instance = cleaner({ 'clean': true });

          app
            .use(instance)
            .handle(function(data) {
              data._next.should.be.true;
              done();
            });
        });

        it('should redirect from `/users/` to `/users`', function(done) {
          var app = connect({ 'url': '/users/' });
          var instance = cleaner({ 'clean': true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users');
              done();
            });
        });

        it('should redirect from `/users/?foo=bar` to `/users?foo=bar`', function(done) {
          var app = connect({ 'url': '/users/?foo=bar' });
          var instance = cleaner({ 'clean': true });

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
          var app = connect({ 'url': '/users' });
          var instance = cleaner({ 'sanitize': true });

          app
            .use(instance)
            .handle(function(data) {
              data._next.should.be.true;
              done();
            });
        });

        it('should redirect from `/users//` to `/users`', function(done) {
          var app = connect({ 'url': '/users//' });
          var instance = cleaner({ 'sanitize': true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users');
              done();
            });
        });

        it('should redirect from `/users/?foo=Bar&color=black&` to `/users?foo=Bar&color=black`', function(done) {
          var app = connect({ 'url': '/users/?foo=Bar&color=black&' });
          var instance = cleaner({ 'sanitize': true });

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
          var app = connect({ 'url': '/users' });
          var instance = cleaner({ 'normalize': true });

          app
            .use(instance)
            .handle(function(data) {
              data._next.should.be.true;
              done();
            });
        });

        it('should redirect from `/Users` to `/users`', function(done) {
          var app = connect({ 'url': '/Users' });
          var instance = cleaner({ 'normalize': true });

          app
            .use(instance)
            .handle(function(data) {
              data._url.should.equal('/users');
              done();
            });
        });

        it('should redirect from `/Users?foo=Bar` to `/users?foo=Bar`', function(done) {
          var app = connect({ 'url': '/Users?foo=Bar' });
          var instance = cleaner({ 'normalize': true });

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
