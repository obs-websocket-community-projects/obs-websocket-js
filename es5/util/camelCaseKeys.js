"use strict";

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