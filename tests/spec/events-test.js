(function (global) {
  'use strict';
  global.define([
    'jasmine_async',
    'test-base'
  ], function (AsyncSpec) {
    global.describe("Events", function () {
      var async = new AsyncSpec(this),
        testBase = new TestBase();

      async.it("on + fire", function(done) {
        testBase.events.on('myCustomEvent', function (event) {
          expect(event.target).toBe(global.document);
          done();
        });
        testBase.events.fire('myCustomEvent');
      });

      async.it("unbind", function(done) {
        testBase.events.on('myCustomEvent1', function (event) {
          console.log('shouldn\'t triggered');
        });
        testBase.events.unbind('myCustomEvent1');
        testBase.events.fire('myCustomEvent1');
        done();
      });

    });
  });
} ((function () { return this;}())));