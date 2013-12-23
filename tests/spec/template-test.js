(function (global) {
  'use strict';
  global.define([
    'jasmine_async',
    'test-base'
  ], function (AsyncSpec) {
    global.describe("Templates", function () {
      var async = new AsyncSpec(this),
        testBase = new TestBase();

      async.beforeEach(function (done) {
        done();
      });

      async.afterEach(function (done) {
        done();
      });

      async.it("setHTML", function(done) {
        var mm_inner_HTML = 'some text with {{var1}} and {{var2}} and {{var1}} again :)';
        mm_inner_HTML = testBase.template.setHTML('htmlSnippet1', mm_inner_HTML);
        expect(mm_inner_HTML).toBe('');
        done();
      });

      async.it("getHTML", function(done) {
        var resultText = testBase.template.getHTML('htmlSnippet1', {
          "var1": '(this is a replaced variable 1)',
          "var2": '(this is a replaced variable 2)'
        });
        expect(resultText).toBe('some text with (this is a replaced variable 1) and (this is a replaced variable 2) and (this is a replaced variable 1) again :)');
        done();
      });

    });
  });
}(function () { return this;}()))();
