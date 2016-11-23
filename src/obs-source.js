/**
 * @class OBSSource
 * @param name {string} - Source name.
 * @param type {string} - Type.
 * @param x {double} - X position.
 * @param y {double} - Y position.
 * @param boundsX {double} - BoundsX.
 * @param boundsY {double} - BoundsY.
 * @param volume {double} - Source Volume.
 * @param visible {bool} - Scene visibility.
 */
(function() {
  function OBSSource(name, type, x, y, boundsX, boundsY, volume, visible) {
    this.name = (typeof name === 'undefined') ? '' : name;
    this.type = (typeof type === 'undefined') ? '' : type;
    this.x = x || 0;
    this.y = y || 0;
    this.boundsX = boundsX || 0;
    this.boundsY = boundsY || 0;
    this.volume = volume || 0;
    this.visible = visible || false;
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports.OBSSource = OBSSource;
  } else {
    window.OBSSource = OBSSource;
  }
})();

function marshalOBSSource(source) { // jshint ignore:line
  return new OBSSource(source.name, source.type, source.x, source.y, source.cx, source.cy, source.volume, source.render);
}
