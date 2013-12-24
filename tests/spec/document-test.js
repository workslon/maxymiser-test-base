(function (global) {
  'use strict';
  global.define([
    'jasmine_async',
    'jquery',
    'test-base'
  ], function (AsyncSpec, $) {
    global.describe("Document", function () {
      var async = new AsyncSpec(this),
        testBase = new TestBase();

      async.beforeEach(function (done) {
        done();
      });

      async.afterEach(function (done) {
        done();
      });

      async.it("showElement", function(done) {
        testBase.document.showElement('#new-page-element-1');

        setTimeout(function () {
          $('body').append($('<div />')
            .attr('id', 'new-page-element-1')
            .css('display', 'none')
          );
        }, 10);

        setTimeout(function () {
          expect($('#new-page-element-1').css('display')).toBe('block');
          done();
        }, 200);

      });

      async.it("hideElement", function(done) {
        testBase.document.hideElement('#new-page-element-2');

        setTimeout(function () {
          $('body').append($('<div />')
            .attr('id', 'new-page-element-2')
            .css('display', 'block')
          );
        }, 10);

        setTimeout(function () {
          expect($('#new-page-element-2').css('display')).toBe('none');
          done();
        }, 200);
      });

      async.it("oneOfElementsArrived", function(done) {
        testBase.document.oneOfElementsArrived([
          '#some-element-1',
          '#some-element-2',
          '#some-element-3',
          '#some-element-4',
          '#new-page-element-3'
        ], function (element) {
          expect(element.attr('id')).toBe('new-page-element-3');
          done();
        });

        setTimeout(function () {
          $('body').append($('<div />').attr('id', 'new-page-element-3'));
        }, 10);
      });

      async.it("waitForElementArrived", function(done) {
        testBase.document.waitForElementArrived('#new-page-element-4', function (element) {
          expect(element.attr('id')).toBe('new-page-element-4');
          done();
        });

        setTimeout(function () {
          $('body').append($('<div />')
            .attr('id', 'new-page-element-4')
          );
        }, 10);
      });

      async.it("onDefined (function)", function(done) {
        testBase.document.onDefined('someNewName', function (object) {
          expect(typeof object).toBe('function');
          done();
        });

        setTimeout(function () {
          global.someNewName = function () {};
        }, 10);
      });

      async.it("onDefined (null)", function(done) {
        testBase.document.onDefined('someNewName2', function (object) {
          expect(object).toBe(null);
          done();
        });

        setTimeout(function () {
          global.someNewName2 = null;
        }, 10);
      });

      /**
       * mock mmcore
       */
      global.mmcore = global.mmcore || {};
      global.mmcore.AddDocLoadHandler = function (callback) {};

      async.it("ready (document)", function(done) {
        spyOn(global.mmcore, 'AddDocLoadHandler');
        var cb = function () {};
        testBase.document.ready(cb);
        expect(global.mmcore.AddDocLoadHandler).toHaveBeenCalledWith(cb);
        done();
      });

      async.it("ready (element)", function(done) {
        testBase.document.ready('#new-page-element-5', function (isArrived, elements) {
          expect(elements['#new-page-element-5'].attr('id')).toBe('new-page-element-5');
          done();
        });

        setTimeout(function () {
          $('body').append($('<div />').attr('id', 'new-page-element-5'));
        }, 10);
      });

      async.it("ready (elements list)", function(done) {
        testBase.document.ready([
          '#new-page-element-6',
          '#new-page-element-7'
        ], function (isArrived, elements) {
          expect(elements['#new-page-element-6'].attr('id')).toBe('new-page-element-6');
          expect(elements['#new-page-element-7'].attr('id')).toBe('new-page-element-7');
          done();
        });

        setTimeout(function () {
          $('body').append(
            $('<div />').attr('id', 'new-page-element-6'),
            $('<div />').attr('id', 'new-page-element-7')
          );
        }, 10);
      });

    });
  });
} ((function () { return this;}())));