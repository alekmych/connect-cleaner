#connect-cleaner
Simple url cleaner and normalizer for [connect](https://github.com/senchalabs/connect).

Redirects trailing slash urls, normalizes case difference and cleans some garbage from your sweet URL. Viva SEO!

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
  .use(cleaner(302))
  .use(someConnectMiddleWare())
  .listen(8080);

// /vehicles/Sedans/?color=Black,Dark%20Blue&milage=lt10&
// becomes…
// /vehicles/sedans?color=black,dark_blue&milage=lt10
```

Also, `cleaner` function can take optional integer argument, which will be used as an HTTP code.

##Notes
Connect-cleaner pritty opinionated:

* currently, middleware only cuts trailing slashes, there is no adding functionality
* case normalization is permanent and would not be changed in future, diffenerent cases in URL kinda stupid
