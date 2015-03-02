var gutil = require('gulp-util');
var assert = require('assert');
var polyglot = require('./index');

describe('gulp-polyglot', function() {

  describe('when given a identifier function', function() {
    var contents = "t('five');";
    var stream, fakeFile;

    beforeEach(function() {
      stream = polyglot('./', ['en']);
      fakeFile = new gutil.File({
        contents: new Buffer(contents)
      });
    });

    it('should return the JSON string', function(done) {
      stream.on('data', function(file){
        var obj = JSON.parse(file.contents.toString());
        assert.deepEqual(obj, {'five': ''});
      });
      stream.write(fakeFile);
      stream.end(done);
    });

  });

  describe('when given a MemberExpression function', function() {
    var contents = "res.t('five');";
    var stream, fakeFile;

    beforeEach(function() {
      stream = polyglot('./', ['en']);
      fakeFile = new gutil.File({
        contents: new Buffer(contents)
      });
    });

    it('should return the JSON string', function(done) {
      stream.on('data', function(file){
        var obj = JSON.parse(file.contents.toString());
        assert.deepEqual(obj, {'five': ''});
      });
      stream.write(fakeFile);
      stream.end(done);
    });

  });

  describe('when given a wrongly named MemberExpression function', function() {
    var contents = "res.get('five');";
    var stream, fakeFile;

    beforeEach(function() {
      stream = polyglot('./', ['en']);
      fakeFile = new gutil.File({
        contents: new Buffer(contents)
      });
    });

    it('should return empty JSON string', function(done) {
      stream.on('data', function(file){
        var obj = JSON.parse(file.contents.toString());
        assert.deepEqual(obj, {});
      });
      stream.write(fakeFile);
      stream.end(done);
    });

  });

  describe('when given a differently named function', function() {
    var contents = "req.locale('five');";
    var stream, fakeFile;

    beforeEach(function() {
      stream = polyglot('./', ['it', 'en'], {functionName: 'locale'});
      fakeFile = new gutil.File({
        contents: new Buffer(contents)
      });
    });

    it('should return a JSON string', function(done) {
      stream.on('data', function(file){
        var obj = JSON.parse(file.contents.toString());
        assert.deepEqual(obj, {'five': ''});
      });
      stream.write(fakeFile);
      stream.end(done);
    });

  });

});
