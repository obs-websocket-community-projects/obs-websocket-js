/**
 * Converts kebab-case to camelCase.
 * Retains the original kebab-case entries.
 *
 * @param {Object} [obj={}] Keyed object.
 * @return {Object} Keyed object with added camelCased keys.
 */
export default function (obj: Record<string, any> = {}): Record<string, any> {
  for (const key in obj) {
    if (!{}.hasOwnProperty.call(obj, key)) {
      continue;
    }

    const camelCasedKey: string = key.replace(/-([a-z])/gi, ($0: string, $1: string) => $1.toUpperCase());

    obj[camelCasedKey] = obj[key];
  }

  return obj;
}
