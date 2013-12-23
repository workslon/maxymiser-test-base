(function (global) {
  'use strict';
  global.define([
    'jasmine_async',
    'test-base'
  ], function (AsyncSpec) {
    global.describe("Events", function () {
      var async = new AsyncSpec(this),
        testBase = new TestBase();

      async.beforeEach(function (done) {
        done();
      });

      async.afterEach(function (done) {
        done();
      });

      async.it("unbind", function(done) {
        //TODO: call testBase methods
        expect(true).toBe(true);
        done();
      });

      async.it("on", function(done) {
        //TODO: call testBase methods
        expect(true).toBe(true);
        done();
      });

      async.it("fire", function(done) {
        //TODO: call testBase methods
        expect(true).toBe(true);
        done();
      });

    });
  });
}(function () { return this;}()))();
