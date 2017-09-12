function avaTimeout(t, timeout) {
  setTimeout(() => {
    t.fail(`The test timed out after ${timeout} milliseconds.`);
    t.end();
  }, timeout);
}

module.exports = {
  avaTimeout
};
