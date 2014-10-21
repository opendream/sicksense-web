var runOnce = (function () {
  var tasks = {};

  return function(taskName, period, that, func, args) {
    args = args || [];

    var task = tasks[taskName] = tasks[taskName] || {
      period: period || 100
    };

    task.task = function() {
      setTimeout(function() {
        func.apply(that, args);
      }, 0);
    };

    task.timer = task.timer || setTimeout(function() {
      // Clear timer itself after expired.
      task.timer = null;
      // Run the last task.
      task.task();
    }, task.period);
  };
})();

if ((typeof(describe) !== "undefined") && (typeof(require) !== "undefined")) {
  var assert = require('assert');

  describe('RunOnce', function() {
    it('should run the only last task within defined period', function(done) {
      var who = [];

      var func = function(w) {
        who.push(w);
      };

      runOnce('run', 100, this, func, [ "Noomz" ]);
      runOnce('run', 100, this, func, [ "Siriwat" ]);

      setTimeout(function() {
        assert.equal(who.length, 1);
        assert.equal(who[0], "Siriwat");

        runOnce('run', 100, this, func, [ "Uamngamsup" ]);

        setTimeout(function() {
          assert.equal(who.length, 2);
          assert.equal(who[1], "Uamngamsup");

          done();
        }, 150);
      }, 150);
    });
  });
}
