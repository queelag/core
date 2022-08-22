/**
 * Returns the symmetric difference between the T arrays.
 */
export function getArraysDifference<T>(arrays: T[][]): T[] {
  return arrays.reduce((r: T[], v: T[]) => [...r, ...v.filter((v: T) => !r.includes(v) && arrays.filter((w: T[]) => w.includes(v)).length <= 1)], [])
}

/**
 * Returns the intersection between the T arrays.
 */
export function getArraysIntersection<T>(arrays: T[][]): T[] {
  return arrays.reduce((r: T[], v: T[]) => [...r, ...v.filter((v: T) => !r.includes(v) && arrays.every((w: T[]) => w.includes(v)))], [])
}

/**
 * Gets the last T item, falls back to fallback if defined and if not returns undefined.
 */
export function getArrayLastItem<T>(array: T[]): T | undefined
export function getArrayLastItem<T>(array: T[], fallback: T): T
export function getArrayLastItem<T>(array: T[], fallback?: T): T | undefined {
  return array[array.length - 1] || fallback
}

/**
 * Removes every T item matching the callbackfn result.
 */
export function removeArrayItems<T>(array: T[], callbackfn: (v: T) => boolean): T[] {
  return array.reduce((r: T[], v: T) => {
    let removable: boolean

    removable = callbackfn(v)
    if (removable) return r

    r.push(v)

    return r
  }, [])
}

/**
 * Removes every duplicate using Set if no callbackfn is defined.
 */
export function removeArrayDuplicates<T>(array: T[], callbackfn?: (r: T[], v: T) => boolean): T[] {
  return callbackfn
    ? array.reduce((r: T[], v: T) => {
        let pushed: boolean

        pushed = callbackfn(r, v)
        if (pushed) return r

        r.push(v)

        return r
      }, [])
    : [...new Set(array)]
}
