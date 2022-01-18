import { StringUtils } from './string.utils'

/**
 * Utils for anything related to FormData objects.
 *
 * @category Utility
 */
export class FormDataUtils {
  static toObject<T extends object>(data: FormData): T {
    return [...data.entries()].reduce((r: T, [k, v]: [string, File | string]) => {
      switch (typeof v) {
        case 'string':
          if (StringUtils.isJSON(v)) {
            return { ...r, [k]: JSON.parse(v) }
          }

          return { ...r, [k]: v }
        case 'object':
          return { ...r, [k]: v }
        default:
          return r
      }
    }, {} as T)
  }
}
