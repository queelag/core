export type ID = string

export type IndexedDatabaseTableIndex = [string | string[]] | [string | string[], IDBIndexParameters]
export type IndexedDatabaseTableQuery = IDBValidKey | IDBKeyRange

// export namespace KeyOf {
//   type DeepJoin<K, P> = K extends string | number ? (P extends string | number ? `${K}${'' extends P ? '' : '.'}${P}` : never) : never
//   type DeepPrev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]]

//   export type Deep<T, D extends number = 10> = [D] extends [never]
//     ? never
//     : T extends object
//     ? {
//         [K in keyof T]-?: K extends string | number ? `${K}` | DeepJoin<K, Deep<T[K], DeepPrev[D]>> : never
//       }[keyof T]
//     : ''

//   export type Shallow<T> = keyof T
// }

export type FetchRequestInfo = Request | string

export type StatusTransformer = (keys: string[]) => string
