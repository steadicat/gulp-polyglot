# gulp-polyglot

A gulp plugin to extract strings marked for translation from a JS (or JSX) codebase. JSON is currently the only supported output format.

### Usage:

  .pipe(gulpPolyglot('src/translate', ['en', 'it'], options))

#### options

- **functionOrMethodName** The function or method name to search for. Default is `'t'`.

- **onlyFunctionCall** Only search for function calls, ignore method calls. Default is `false`.

- **onlyMethodCall** Only search for method calls, ignore function calls. Default is `false`.

- **objectName** Only accepts methods on objects by this name. If not set accept any object.
