/**
 * Converts kebab-case to camelCase.
 * Retains the original kebab-case entries.
 *
 * @param {Object} [obj={}] Keyed object.
 * @return {Object} Keyed object with added camelCased keys.
 */
export default function (obj: Object = {}): Object {
  for (const key in obj) {
    if (!{}.hasOwnProperty.call(obj, key)) {
      continue;
    }

    // eslint-disable-next-line prefer-named-capture-group
    const camelCasedKey: string = key.replace(/-([a-z])/gi, ($0, $1) => $1.toUpperCase());

    obj[camelCasedKey] = obj[key];
  }

  return obj;
}
