Loader JS
=========

Simple, lightweight javascript library for
loading files.

Can work with plugins.
Now include two plugins for loading files:
  js - load js-files. Uses as default
  css - load css files

## Examples ##

Loading only one file.
Javascript:
```javascript
Loader.get( 'test.js', function(){ alert("Hi!"); } );
```

CSS:
```javascript
Loader.get( 'css!test.css', function(){ alert("Hi!"); } );
```

Loading several files.
```javascript
Loader.Manager( 
  ['/testlib.js','css!/test.css'], 
  function(){ alert("Everything has loaded!"); } 
); 
```
