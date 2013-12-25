(function (global) {
  'use strict';
  global.define([
    'jasmine_async',
    'test-base'
  ], function (AsyncSpec) {
    global.describe("Async", function () {
      var async = new AsyncSpec(this),
        testBase = new TestBase();

      async.beforeEach(function (done) {
        done();
      });

      async.afterEach(function (done) {
        done();
      });

      async.it("parallel", function (done) {
        testBase.async.parallel([
          function(done){
            setTimeout(function () {
              done(null);
            }, 200);
          },
          function(done){
            setTimeout(function(){
              done(null);
            }, 100);
          }
        ],
        function(err){
          expect(err).toBe(null);
          done();
        });
      });

      async.it("waterfall", function(done) {
        var exampleVar = 1;
        testBase.async.waterfall([
          function(done){
            setTimeout(function () {
              expect(exampleVar).toBe(1);
              exampleVar += 1;
              done(null);
            }, 200);
          },
          function(done){
            setTimeout(function(){
              expect(exampleVar).toBe(2);
              exampleVar += 1;
              done(null);
            }, 100);
          },
          function(done){
            setTimeout(function(){
              expect(exampleVar).toBe(3);
              done(null);
            }, 100);
          }
        ],
        function(err){
          expect(err).toBe(null);
          done();
        });
      });

    });
  });
} ((function () { return this;}())));