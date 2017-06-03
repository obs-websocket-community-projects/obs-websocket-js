function avaTimeout(t, timeout) {
  setTimeout(() => {
    t.fail();
    t.end();
  }, timeout);
}

module.exports = {
  avaTimeout
};
