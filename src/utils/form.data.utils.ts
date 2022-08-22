import { isStringJSON } from './string.utils'

export function convertFormDataToObject<T extends object>(data: FormData): T {
  return [...data.entries()].reduce((r: T, [k, v]: [string, File | string]) => {
    switch (typeof v) {
      case 'string':
        if (isStringJSON(v)) {
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
