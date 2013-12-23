function TXXActions() {}

TXXActions.prototype = new TestBase();

/**
 * TXX_Action1
 * action 1 description
 */
TXXActions.prototype.action1 = function () {
  //TODO:
};

/**
 * TXX_Action2
 * action 2 description
 */
TXXActions.prototype.action2 = function () {
  //TODO:
};

/**
 * TXX_Action3
 * action 3 description
 */
TXXActions.prototype.action3 = function () {
  //TODO:
};

TXXActions.prototype.workflow = function () {
  this.action1();
  this.action2();
  this.action3();
};

(new TXXActions()).workflow();
