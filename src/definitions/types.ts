export type ArrayIncludes<T> = (array: T[], item: T) => boolean
export type ArrayRemoves<T> = (array: T[], item: T) => boolean

export type DebounceMapKey = Function | string
export type DebounceMapValue = NodeJS.Timeout | number

export type IntervalMapKey = Function | string
export type IntervalMapValue = NodeJS.Timeout | number

export type IsEqual<T1, T2> = (a: T1, b: T2) => boolean

export type FetchRequestInfo = Request | string

export namespace KeyOf {
  // export type Deep<T, D extends number = 16> = keyof T | Path<T, D>
  export type Deep<T> = keyof T
  // export type DeepArray<T, D extends number = 16> = ArrayPath<T, D>
  export type DeepArray<T> = keyof T extends number ? keyof T : never
  export type Shallow<T> = keyof T
}

export type LoggerLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error'
export type LoggerStatus = 'off' | 'on'

export type Primitive = bigint | boolean | null | number | string | symbol | undefined

export type ProcessEnvValue = string | undefined

export type RequestMethod = 'CONNECT' | 'DELETE' | 'GET' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'POST' | 'PUT' | 'TRACE'

export type StatusTransformer = (keys: string[]) => string

export type Theme = 'dark' | 'light' | 'system'

export type ThrottleMapKey = Function | string

export type TimeoutMapKey = Function | string
export type TimeoutMapValue = NodeJS.Timeout | number

export type TypeaheadOnMatch<T> = (item: T) => any
export type TypeaheadPredicate<T> = (item: T, value: string, index: number, items: T[]) => unknown

export type WriteMode = 'create' | 'update'
