(function (global) {
  'use strict';
  global.define([
    'jasmine_async',
    'test-base'
  ], function (AsyncSpec) {
    global.describe("Events", function () {
      var async = new AsyncSpec(this),
        testBase = new TestBase();

      var handleResult = {},
        mockHandlers = {
          "handler1": function () {
            handleResult.handler1 = arguments;
          },
          "handler2": function () {
            handleResult.handler2 = arguments;
          },
          "handler3": function () {
            handleResult.handler3 = arguments;
          }
        };

      async.it("on", function(done) {
        testBase.events.on('myCustomEvent', mockHandlers.handler1, mockHandlers);
        done();
      });

      async.it("add", function(done) {
        testBase.events.add('myCustomEvent', mockHandlers.handler2, mockHandlers);
        done();
      });

      async.it("fire", function(done) {
        testBase.events.fire('myCustomEvent', ['arg1', 'arg2']);
        expect(handleResult.handler1[0]).toBe('arg1');
        expect(handleResult.handler1[1]).toBe('arg2');
        expect(handleResult.handler2[0]).toBe('arg1');
        expect(handleResult.handler2[1]).toBe('arg2');
        done();
      });

      async.it("unbind", function(done) {
        testBase.events.add('myCustomEvent', mockHandlers.handler3, mockHandlers);
        testBase.events.unbind('myCustomEvent1');
        testBase.events.fire('myCustomEvent');
        expect(handleResult.handler3).toBeUndefined();
        done();
      });

    });
  });
} ((function () { return this;}())));