# connect-cleaner
# THIS PLUGIN IS BROKEN, REWRITE IS COMING
Simple url sanitizer for [connect](https://github.com/senchalabs/connect) and [express](https://github.com/visionmedia/express).

Redirects trailing slash urls, normalizes letter case differences and cleans garbage from your URLs.

Inspired by [connect-slashes](https://github.com/avinoamr/connect-slashes).

##Installation

```
$ npm install connect-cleaner
```

##Usage
```javascript
var connect = require('connect');
var cleaner = require('connect-cleaner');
var config  = require('config');

connect()
  .use(connect.responseTime())
  .use(cleaner(302)) // ideally, put cleaner as earlier as possible
  .use(yourApp(config))
  .listen(8080);
```
By default, `cleaner` responses with "fast 400"* on requests like `//?/?///`. Optionaly `clear` takes one argument which can be an `Object` (options) or `Number` (redirect code).

\* By "fast 400" I mean that cleaner responses with unstyled 400 without body as soon as possible

##Options
- `add <false>` - determines if `cleaner` should add trailing slash. If `true` sets `clean` to `false`.
- `clean <true>` - determines if `cleaner` should clean trailing slash(es). Can be overrided by `add` and `sanitize` options.
- `code <301>` - determines redirect code.
- `normilize <false>` - determines if `cleaner` should normilize differences in letter cases in `pathname`. It's important to note that `cleaner` only fixes letter casing on `pathname`- `querystring` not affected.
- `sanitize <false>` - determines if `claener` should clean (sanitize) garbage in url (includes `[/?&=]`, also sets `clean` to `false`).

##Post-initialization mutablity
```javascript
var instance = cleaner(); // We need access to middleware for later configuring
app.use(instance());
  
// Later...
instance.set(code, 302);
// or
insatnce.set({ add: true, sanitize: true });

// Also we have more generic acces to `_options` object
instance.get('code'); // => 302
// or
instance.get();
/* =>
{
  add: true,
  clean: false,
  code: 302,
  sanitize: true,
  normalize: false
}
*/
```

##Examples
Options|Request|Response|Code
:-:|:-:|:-:|:-:
(default)|`///?/?/?`|-|`400`
(default)|`/Users//?foo=Bar&age=21&`|`/Users?foo=Bar&age=21&`|`301`
`code: 302`|`/Users//?foo=Bar&age=21&`|`/Users?foo=Bar&age=21&`|`302`
`normalize, code: 302`|`/Users//?foo=Bar&age=21&`|`/users?foo=Bar&age=21&`|`302`
`sanitize, code: 302`|`/Users//?foo=Bar&age=21&`|`/Users?foo=Bar&age=21`|`302`
`normalize`, `sanitize, code: 302`|`/Users//?foo=Bar&age=21&`|`/users?foo=Bar&age=21`|`302`
(default)|`/users?foo=Bar&age=21`|-| Pass thrue, url is fine
`add`|`/users?foo=Bar&age=21`|`/users/?foo=Bar&age=21`|`301`

##TODO
- [WIP] add option to pass Error's through connect stack (next(err))
- [WIP] performance optimizition
- [WIP] refactoring
- write benchamrk

##License
MIT
