var through2 = require('through2');
var esprima = require('esprima');
var path = require('path');
var fs = require('fs');
var merge = require('merge');
var Set = require('Set');
var gutil = require('gulp-util');

var TRANSLATION_FUNCTION = 't';

function concat(a, b) {
  return a.concat(b);
}

function truthy(a) {
  return !!a;
}

function isTranslationFunctionCall(code) {
  //code && code.callee && code.callee.name && console.log(code.callee.name);
  code = code.code;
  return code.type &&
         code.type === 'CallExpression' &&
         code.callee.type === 'Identifier' &&
         code.callee.name === TRANSLATION_FUNCTION;
}

function textUnpacker(code) {
  if (code.type &&
      code.type === 'CallExpression' &&
      code.callee.type === 'MemberExpression' &&
      code.callee.object.name === 'React' &&
      code.callee.property.name === 'createElement') {
    return code.arguments.slice(2);
  } else {
    return defaultUnpacker(code);
  }
}

function extractText(code) {
  code = code.code;
  return traverse(textUnpacker, 0, code.arguments).filter(function(code) {
    code = code.code;
    return code && code.type && code.type === 'Literal';
  }).reduce(function(acc, code) {
    var marker = acc.text ? (acc.depth > code.depth ? ']' : '[') : '';
    return {
      text: acc.text + marker + (code.code.value || ''),
      depth: code.depth
    };
  }, {text: '', depth: 0}).text;
}

function defaultUnpacker(code) {
  if (Array.isArray(code)) {
    return code;
  } else if (typeof code === 'object') {
    return Object.keys(code).map(function(key) {
      return code[key];
    });
  } else {
    return [];
  }
}

function traverse(unpacker, depth, code) {
  if (!code) return [];
  return unpacker(code).map(traverse.bind(null, unpacker, depth+1)).reduce(concat, [{code: code, depth: depth}]);
}

function extractStrings(code) {
  return traverse(defaultUnpacker, 0, code).filter(isTranslationFunctionCall).map(extractText);
}

function toXliff(strings) {
  return [
      "<xliff xmlns='urn:oasis:names:tc:xliff:document:2.0' version='2.0' srcLang='en'>",
      "<file id='1'>",
      "<unit id='1'>",
    ].concat(strings.toArray().map(function(string) {
      return [
        "<segment>",
        "<source>"+string+"</source>",
        "</segment>"
      ].join('\n');
    })).concat([
      "</unit>",
      "</file>",
      "</xliff>"
    ]).join('\n');
}

module.exports = function(output, languages) {
  var strings = new Set();
  return through2.obj(function(file, enc, next) {
    var parsed = esprima.parse(file.contents);
    extractStrings(parsed).forEach(function(s) {
      strings.add(s);
    });
    next();
  }, function(cb) {
    var out = this;
    languages.forEach(function(language) {
      var enStrings = strings.toArray().reduce(function(obj, s) {
        obj[s] = "";
        return obj;
      }, {});
      fs.readFile(path.join(output, language + '.json'), function(err, data) {
        if (err) {
          data = '{}';
        }
        var langStrings = merge(enStrings, JSON.parse(data));
        out.push(new gutil.File({
          base: output,
          path: path.join(output, language + '.json'),
          contents: new Buffer(JSON.stringify(langStrings, null, 2))
        }));
      });
    });
  });
};
