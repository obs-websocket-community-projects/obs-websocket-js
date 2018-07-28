/**
 * Converts kebab-case to camelCase.
 * Retains the original kebab-case entries.
 *
 * @param {Object} [obj={}] Keyed object.
 * @return {Object} Keyed object with added camelCased keys.
 */
module.exports = function (obj) {
  obj = obj || {};
  for (const key in obj) {
    if (!{}.hasOwnProperty.call(obj, key)) {
      continue;
    }

    const camelCasedKey = key.replace(/-([a-z])/gi, ($0, $1) => {
      return $1.toUpperCase();
    });
    obj[camelCasedKey] = obj[key];
  }

  return obj;
};
