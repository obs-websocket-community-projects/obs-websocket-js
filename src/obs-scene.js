/**
 * @class OBSScene
 * @param name {string} - Source name.
 * @param sources {Array.<OBSSource>} - Array of {@link OBSSource}s.
 */
(function() {
  function OBSScene(name, sources) {
    this.name = (typeof name === 'undefined') ? '' : name;
    sources = (typeof sources === 'undefined') ? [] : sources;

    var self = this;

    if (sources.length > 0 && !(sources[0] instanceof OBSSource)) {
      this.sources = [];
      sources.forEach(function(source) {
        self.sources.push(marshalOBSSource(source));
      });
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports.OBSScene = OBSScene;
  } else {
    window.OBSScene = OBSScene;
  }
})();

function marshalOBSScene(scene) { // jshint ignore:line
  return new OBSScene(scene.name, scene.sources);
}
