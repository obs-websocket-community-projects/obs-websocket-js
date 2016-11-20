/**
 * @class OBSScene
 * @param name {string} - Source name.
 * @param sources {Array.<OBSSource>} - Array of {@link OBSSource}s.
 */
(function() {
  function OBSScene(name, sources) {
    this.name = name || '';
    this.sources = sources || [];

    var self = this;

    if (sources.length > 0 && !(sources[0] instanceof OBSSource)) {
      self.sources = [];
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

function marshalOBSScene(scene) {
  return new OBSScene(scene.name, scene.sources);
}
