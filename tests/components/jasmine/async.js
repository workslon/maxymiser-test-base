(function (global) {
  'use strict';
  // Private Methods
  // ---------------
  function runAsync(block) {
    return function () {
      var done = false,
        complete = function () {
          done = true;
        };
      global.runs(function(){
        block(complete);
      });
      global.waitsFor(function(){
        return done;
      });
    };
  }
  // Constructor Function
  // --------------------
  function AsyncSpec(spec) {
    this.spec = spec;
  }

  // Public API
  // ----------
  AsyncSpec.prototype.beforeEach = function (block) {
    this.spec.beforeEach(runAsync(block));
  };

  AsyncSpec.prototype.afterEach = function (block) {
    this.spec.afterEach(runAsync(block));
  };

  AsyncSpec.prototype.it = function (description, block) {
    // For some reason, `it` is not attached to the current
    // test suite, so it has to be called from the global
    // context.
    global.it(description, runAsync(block));
  };

  // AMD / RequireJS
  if (typeof global.define !== 'undefined' && global.define.amd) {
    global.define([], function () {
      return AsyncSpec;
    });
  } else {
    global.AsyncSpec = AsyncSpec;
  }
})((function () {return this;}).call());