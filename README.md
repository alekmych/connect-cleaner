#connect-cleaner
Simple url sanitizer for [connect](https://github.com/senchalabs/connect) and [express](https://github.com/visionmedia/express).

Redirects trailing slash urls, normalizes letter case difference and cleans some garbage from your URLs. (Hello SEO)

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
  .use(cleaner(302)) // idealy put cleaner as earlier as possible
  .use(someMiddleware(302))
  .listen(8080);
```
Optionaly `clear` takes one argument which can be an integer (`redirect code`) or object (`options`).

##Options
###If `Nuber`:
- sets redirect code (defaults to 301)

###If `Object`:
- `add <false>` - determines if `cleaner` should add trailing slash, if `true` sets another option `clean` to `false`
- `clean <true>` - determines if `cleaner` should clean trailing slash(es), defaults to `true`. Can be overrided by `add` and `sanitize` options
- `code <301>` - determines redirect code
- `normilize <false>` - determines if `cleaner` should normilize difference in letter cases of `pathname`. It's important to note that `cleaner` only fixes letter casing on `pathname`, `querystring` not affected
- `snitize <false>` - determines if `claener` should clean (sanitize) some garbage in url (includes clearing triling slashes, so `clean` option is automaticaly sets to `false`)

##Examples
Setting|Input|Redirect|Code
:-:|:-:|:-:|:-:
(default)|`/Users//?foo=Bar&age=21&`|`/Users?foo=Bar&age=21&`|`301`
`code: 302`|`/Users//?foo=Bar&age=21&`|`/Users?foo=Bar&age=21&`|`302`
`normalize, code: 302`|`/Users//?foo=Bar&age=21&`|`/users?foo=Bar&age=21&`|`302`
`sanitize, code: 302`|`/Users//?foo=Bar&age=21&`|`/users?foo=Bar&age=21`|`302`
(default)|`/users?foo=Bar&age=21`|-| No redirect, url is fine
`add`|`/users?foo=Bar&age=21`|`/users/?foo=Bar&age=21`|`301`

##License
MIT