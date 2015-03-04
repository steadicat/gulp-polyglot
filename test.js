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
      stream = polyglot('./', ['it', 'en'], {functionOrMethodName: 'locale'});
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

  describe('when given a function call when only a method call is allowed', function() {
    var contents = "t('five');";
    var stream, fakeFile;

    beforeEach(function() {
      stream = polyglot('./', ['it', 'en'], {onlyMethodCall: true});
      fakeFile = new gutil.File({
        contents: new Buffer(contents)
      });
    });

    it('should return an empty JSON string', function(done) {
      stream.on('data', function(file){
        var obj = JSON.parse(file.contents.toString());
        assert.deepEqual(obj, {});
      });
      stream.write(fakeFile);
      stream.end(done);
    });

  });

  describe('when given a method call when only a function call is allowed', function() {
    var contents = "req.t('five');";
    var stream, fakeFile;

    beforeEach(function() {
      stream = polyglot('./', ['it'], {onlyFunctionCall: true});
      fakeFile = new gutil.File({
        contents: new Buffer(contents)
      });
    });

    it('should return an empty JSON string', function(done) {
      stream.on('data', function(file){
        var obj = JSON.parse(file.contents.toString());
        assert.deepEqual(obj, {});
      });
      stream.write(fakeFile);
      stream.end(done);
    });

  });

  describe('when given a method call and the object name', function() {
    var contents = "req.t('five');";
    var stream, fakeFile;

    beforeEach(function() {
      stream = polyglot('./', ['it'], {onlyMethodCall: true, objectName: 'req'});
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

  describe('when given a method call and the wrong object name', function() {
    var contents = "req.t('five');";
    var stream, fakeFile;

    beforeEach(function() {
      stream = polyglot('./', ['it'], {onlyMethodCall: true, objectName: 'foo'});
      fakeFile = new gutil.File({
        contents: new Buffer(contents)
      });
    });

    it('should return an empty JSON string', function(done) {
      stream.on('data', function(file){
        var obj = JSON.parse(file.contents.toString());
        assert.deepEqual(obj, {});
      });
      stream.write(fakeFile);
      stream.end(done);
    });

  });

});
