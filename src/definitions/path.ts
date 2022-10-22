import { Primitive } from './types'

/**
 * Implementation taken from https://github.com/react-hook-form/react-hook-form, thanks to the following authors.
 *
 * bluebill1049: https://github.com/bluebill1049
 * carvalheiro: https://github.com/carvalheiro
 * felixschorer: https://github.com/felixschorer
 * ronny1020: https://github.com/ronny1020
 */

type ArrayKey = number

type BrowserNativeObject =
  | Blob
  | Date
  | File
  | FileList
  | Function
  | Map<any, any>
  | RegExp
  | Promise<any>
  | Set<any>
  | SharedArrayBuffer
  | WeakMap<any, any>
  | WeakSet<any>

type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true

type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>

export type Path<T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: PathImpl<K & string, T[K]>
      }[TupleKeys<T>]
    : PathImpl<ArrayKey, V>
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K]>
    }[keyof T]

type PathImpl<K extends number | string, V> = V extends Primitive | BrowserNativeObject ? `${K}` : `${K}` | `${K}.${Path<V>}`

type ArrayPathImpl<K extends string | number, V> = V extends Primitive | BrowserNativeObject
  ? never
  : V extends ReadonlyArray<infer U>
  ? U extends Primitive | BrowserNativeObject
    ? never
    : `${K}` | `${K}.${ArrayPath<V>}`
  : `${K}.${ArrayPath<V>}`

export type ArrayPath<T> = T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: ArrayPathImpl<K & string, T[K]>
      }[TupleKeys<T>]
    : ArrayPathImpl<ArrayKey, V>
  : {
      [K in keyof T]-?: ArrayPathImpl<K & string, T[K]>
    }[keyof T]
