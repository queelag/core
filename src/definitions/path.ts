import { Primitive } from './types.js'

/**
 * Implementation taken from https://github.com/react-hook-form/react-hook-form, thanks to the following authors.
 *
 * bluebill1049: https://github.com/bluebill1049
 * carvalheiro: https://github.com/carvalheiro
 * felixschorer: https://github.com/felixschorer
 * ronny1020: https://github.com/ronny1020
 */
/** */

type ArrayKey = number

export type ArrayPath<T, D extends number, CD extends number[] = []> = D extends CD['length']
  ? never
  : T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: ArrayPathImpl<K & string, T[K], D, Increment<CD>>
      }[TupleKeys<T>]
    : ArrayPathImpl<ArrayKey, V, D, Increment<CD>>
  : {
      [K in keyof T]-?: ArrayPathImpl<K & string, T[K], D, Increment<CD>>
    }[keyof T]

type ArrayPathImpl<K extends string | number, V, D extends number, CD extends number[]> = V extends Primitive | BrowserNativeObject
  ? never
  : V extends ReadonlyArray<infer U>
  ? U extends Primitive | BrowserNativeObject
    ? never
    : `${K}` | `${K}.${ArrayPath<V, D, CD>}`
  : `${K}.${ArrayPath<V, D, CD>}`

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

type Increment<T extends number[]> = [...T, 0]

type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true

export type Path<T, D extends number, CD extends number[] = []> = D extends CD['length']
  ? never
  : T extends ReadonlyArray<infer V>
  ? IsTuple<T> extends true
    ? {
        [K in TupleKeys<T>]-?: PathImpl<K & string, T[K], D, Increment<CD>>
      }[TupleKeys<T>]
    : PathImpl<ArrayKey, V, D, Increment<CD>>
  : {
      [K in keyof T]-?: PathImpl<K & string, T[K], D, Increment<CD>>
    }[keyof T]

type PathImpl<K extends number | string, V, D extends number, CD extends number[]> = V extends Primitive | BrowserNativeObject
  ? `${K}`
  : `${K}` | `${K}.${Path<V, D, CD>}`

type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>
