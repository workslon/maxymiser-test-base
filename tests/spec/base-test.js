(function (global) {
  'use strict';
  global.define([
    'test-base'
  ], function () {
    global.describe("Base", function () {
      var testBase = new TestBase();

      it("bind", function() {
        var module = {
            "variable": 'module variable',
            "method": function() { return this.variable; }
          },
          boundMethod = testBase.bind(module, module.method);
        expect(boundMethod()).toBe('module variable');
      });

      it("trim", function() {
        expect(testBase.trim('  some text   ')).toBe('some text');
      });

      it("decorate", function() {
        var mockMethods = {
          "decorator": function () {},
          "native": function () {return 'throw origin method';}
        };
        spyOn(mockMethods, 'decorator');

        testBase.decorate(mockMethods, 'native', mockMethods.decorator);

        expect(mockMethods.native('argument1', 'argument2', 'argument3')).toBe('throw origin method');
        expect(mockMethods.decorator).toHaveBeenCalledWith('argument1', 'argument2', 'argument3');
      });

    });
  });
} ((function () { return this;}())));