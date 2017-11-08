"use strict";

/**
 * Converts kebab-case to camelCase.
 * Retains the original kebab-case entries.
 *
 * @param {Object} [obj={}] Keyed object.
 */
module.exports = function (obj) {
  obj = obj || {};
  for (var key in obj) {
    if (!{}.hasOwnProperty.call(obj, key)) {
      continue;
    }

    var camelCasedKey = key.replace(/-([a-z])/gi, function ($0, $1) {
      return $1.toUpperCase();
    });
    obj[camelCasedKey] = obj[key];
  }

  return obj;
};