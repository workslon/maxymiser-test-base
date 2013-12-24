(function (global) {
  'use strict';
  global.define([
    'test-base'
  ], function () {
    global.describe("Core", function () {
      var testBase = new TestBase();

      /**
       * mock mmcore
       */
      global.mmcore = {
        "AddDocLoadHandler": function (callback) {},
        "EH": function (exception) {},
        "SetAction": function () {},
        "SetPageID": function () {},
        "CGRequest": function () {},
        "$Action": function () {},
        "HideMaxyboxes": function () {},
        "GenInfo": {},
        "RenderMaxyboxes": function () {}
      };

      it("trackActionImmediate (params as string)", function() {
        spyOn(global.mmcore, 'SetAction');
        spyOn(global.mmcore, 'SetPageID');
        spyOn(global.mmcore, 'CGRequest');

        testBase.core.trackActionImmediate('testAction');

        expect(global.mmcore._async).toBe(true);
        expect(global.mmcore.SetAction).toHaveBeenCalledWith('testAction', 1, '');
        expect(global.mmcore.SetPageID).toHaveBeenCalledWith('mmevents');
        expect(global.mmcore.CGRequest).toHaveBeenCalled();
      });

      it("trackActionImmediate (params as object)", function() {
        spyOn(global.mmcore, 'SetAction');
        spyOn(global.mmcore, 'SetPageID');
        spyOn(global.mmcore, 'CGRequest');

        var cb = function () {};
        testBase.core.trackActionImmediate({
          "name": 'testAction2',
          "value": 2,
          "attr": 'attribute name',
          "pageId": 'customPageId'
        }, cb);

        expect(global.mmcore._async).toBe(true);
        expect(global.mmcore.SetAction).toHaveBeenCalledWith('testAction2', 2, 'attribute name');
        expect(global.mmcore.SetPageID).toHaveBeenCalledWith('customPageId');
        expect(global.mmcore.CGRequest).toHaveBeenCalledWith(cb);
      });

      it("trackActionDeferred (params as string)", function() {
        spyOn(global.mmcore, '$Action');

        testBase.core.trackActionDeferred('defAction');

        expect(global.mmcore.$Action).toHaveBeenCalledWith('defAction', 1, '');
      });

      it("trackActionDeferred (params as object)", function() {
        spyOn(global.mmcore, '$Action');

        testBase.core.trackActionDeferred({
          "name": 'defAction2',
          "value": 2,
          "attr": 'attribute name'
        });

        expect(global.mmcore.$Action).toHaveBeenCalledWith('defAction2', 2, 'attribute name');
      });

      it("checker", function() {
        //TODO: I don't have any idea
        expect(true).toBe(true);

      });

      it("renderer", function() {
        //TODO: I don't have any idea
        expect(true).toBe(true);
      });

    });
  });
} ((function () { return this;}())));