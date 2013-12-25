(function (global) {
  'use strict';
  global.define([
    'test-base'
  ], function () {
    global.describe("Underscore", function () {
      var testBase = new TestBase();

      it("map (object)", function() {
        var result = testBase._.map({"key1": 1, "key2": 2}, function (value, key) {
          expect(value).toEqual(jasmine.any(Number));
          expect(key).toEqual(jasmine.any(String));
          return value * 5;
        });
        expect(result).toEqual([5, 10]);
      });

      it("map (array)", function() {
        var result = testBase._.map([{"key": 1}, {"key": 2}], function (item, num) {
          expect(item).toEqual(jasmine.any(Object));
          expect(num).toEqual(jasmine.any(Number));
          item.key = item.key * 5;
          return item;
        });
        expect(result).toEqual([{"key": 5}, {"key": 10}]);
      });

      it("each (object)", function() {
        testBase._.each({"key1": 1, "key2": 2}, function (value, key) {
          expect(value).toEqual(jasmine.any(Number));
          expect(key).toEqual(jasmine.any(String));
          return value * 5;
        });
      });

      it("each (array)", function() {
        testBase._.each([{"key": 1}, {"key": 2}], function (item, num) {
          expect(item).toEqual(jasmine.any(Object));
          expect(num).toEqual(jasmine.any(Number));
          item.key = item.key * 5;
          return item;
        });
      });

      it("has", function() {
        var obj = {"own": true};
        expect(testBase._.has(obj, '__proto__')).toEqual(false);
        expect(testBase._.has(obj, 'own')).toEqual(true);
      });

    });
  });
} ((function () { return this;}())));
