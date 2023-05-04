// import { ArrayPath, Path } from './path.js'

export type ArrayIncludes<T> = (array: T[], item: T) => boolean
export type ArrayRemoves<T> = (array: T[], item: T) => boolean

export type { CamelCase, DelimiterCase, KebabCase, PascalCase, ScreamingSnakeCase, SnakeCase } from './cases.js'

export type DebounceMapKey = Function | string
export type DebounceMapValue = NodeJS.Timeout | number

export type IntervalMapKey = Function | string
export type IntervalMapValue = NodeJS.Timer | number

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

export type StatusTransformer = (keys: string[]) => string

export type ThrottleMapKey = Function | string
export type ThrottleMapValue = number

export type TimeoutMapKey = Function | string
export type TimeoutMapValue = NodeJS.Timeout | number
