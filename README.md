#connect-cleaner
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

connect()
  .use(connect.responseTime())
  .use(cleaner(302)) // ideally, put cleaner as earlier as possible
  .use(someMiddleware(302))
  .listen(8080);
```
Optionaly `clear` takes one argument which is object (`options`).

##Options
- `add <false>` - determines if `cleaner` should add trailing slash, if `true` sets `clean` to `false`.
- `clean <true>` - determines if `cleaner` should clean trailing slash(es). Can be overrided by `add` and `sanitize` options.
- `code <301>` - determines redirect code.
- `normilize <false>` - determines if `cleaner` should normilize differences in letter cases in `pathname`. It's important to note that `cleaner` only fixes letter casing on `pathname`, `querystring` not affected.
- `sanitize <false>` - determines if `claener` should clean (sanitize) garbage in url (includes `[/?&=]`, also sets `clean` to `false`).

##Examples
Setting|Input|Redirect|Code
:-:|:-:|:-:|:-:
(default)|`/Users//?foo=Bar&age=21&`|`/Users?foo=Bar&age=21&`|`301`
`code: 302`|`/Users//?foo=Bar&age=21&`|`/Users?foo=Bar&age=21&`|`302`
`normalize, code: 302`|`/Users//?foo=Bar&age=21&`|`/users?foo=Bar&age=21&`|`302`
`sanitize, code: 302`|`/Users//?foo=Bar&age=21&`|`/Users?foo=Bar&age=21`|`302`
`normalize`, `sanitize, code: 302`|`/Users//?foo=Bar&age=21&`|`/users?foo=Bar&age=21`|`302`
(default)|`/users?foo=Bar&age=21`|-| Pass thrue, url is fine
`add`|`/users?foo=Bar&age=21`|`/users/?foo=Bar&age=21`|`301`

##License
MIT
