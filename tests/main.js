(function (global) {
  'use strict';
  global.requirejs.config({
    "baseUrl": '../',
    "paths": {
      "test-base": 'Base',
      "jasmine": 'tests/components/jasmine/jasmine',
      "jasmine_html": 'tests/components/jasmine/jasmine-html',
      "jasmine_async": 'tests/components/jasmine/async',
      "test": 'tests/spec'
    },
    "shim": {
      "jasmine_html": {
        "deps": ['jasmine'],
        "exports": 'jasmine_html'
      },
      "jasmine_async": {
        "deps": ['jasmine'],
        "exports": 'jasmine_async'
      },
      "test": {
        "deps": ['jasmine', 'jasmine_async', 'jasmine_html'],
        "exports": 'test'
      }
    }
  });
  global.require([
    'jasmine',
    'jasmine_html',

    'test/async-test',
    'test/document-test',
    'test/events-test',
    'test/template-test',
    'test/underscore-test',
    'test/base-test',
    'test/core-test'
  ], function (jasmine) {
    var jasmineEnv = jasmine.getEnv(),
      htmlReporter = new jasmine.HtmlReporter();
    jasmineEnv.updateInterval = 1000;
    jasmineEnv.defaultTimeoutInterval = 20000;
    jasmineEnv.addReporter(htmlReporter);
    jasmineEnv.specFilter = function (spec) {
      return htmlReporter.specFilter(spec);
    };
    jasmineEnv.execute();
  });
} ((function () { return this;}())));


