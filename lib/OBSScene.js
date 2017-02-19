var OBSSource = require('./OBSSource.js');

/**
 * @class OBSScene
 * @param name {string} - Source name.
 * @param sources {Array.<OBSSource>} - Array of {@link OBSSource}s.
 */
module.exports = function(name, sources) {
    this.name = (typeof name === 'undefined') ? '' : name;
    sources = (typeof sources === 'undefined') ? [] : sources;

    this.sources = sources;
    var self = this;

    if (sources.length > 0 && !(sources[0] instanceof OBSSource)) {
      this.sources = [];
      sources.forEach(function(source) {
        self.sources.push(new OBSScene().marshal(source));
      });
    }

    this.marshal = function(scene) {
      return this(scene.name, scene.sources);
    };
  };
