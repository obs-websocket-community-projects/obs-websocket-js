var debugEnabled = true;

var Logger = function(prefix) {
  this.info = console.log.bind(window.console, prefix);
  this.error = console.error.bind(window.console, prefix);
  this.warn = console.warn.bind(window.console, prefix);

  this.withDebug = function(debug) {
    debugEnabled = debug;

    if (debug) {
      this.debug = console.log.bind(window.console, prefix);
    } else {
      this.debug = function() {};
    }
  };

  this.withDebug(debugEnabled);

  return this;
};

module.exports = exports = Logger;
