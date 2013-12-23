(function (global) {
  'use strict';
  global.define([
    'jasmine_async',
    'test-base'
  ], function (AsyncSpec) {
    global.describe("Core", function () {
      var async = new AsyncSpec(this),
        testBase = new TestBase();

      async.beforeEach(function (done) {
        done();
      });

      async.afterEach(function (done) {
        done();
      });

      async.it("trackActionImmediate", function(done) {
        //TODO: call testBase methods
        expect(true).toBe(true);
        done();
      });

      async.it("trackActionDeferred", function(done) {
        //TODO: call testBase methods
        expect(true).toBe(true);
        done();
      });

      async.it("checker", function(done) {
        //TODO: call testBase methods
        expect(true).toBe(true);
        done();
      });

      async.it("renderer", function(done) {
        //TODO: call testBase methods
        expect(true).toBe(true);
        done();
      });

    });
  });
}(function () { return this;}()))();
