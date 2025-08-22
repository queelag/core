/**
 * Checks if the given value is an array buffer view and its buffer is an instance of ArrayBuffer or SharedArrayBuffer.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/array-buffer)
 */
export function isArrayBufferView<T extends ArrayBufferLike = ArrayBufferLike>(
  value: unknown,
  instance: typeof ArrayBuffer | typeof SharedArrayBuffer
): value is ArrayBufferView<T> {
  return ArrayBuffer.isView(value) && value.buffer instanceof instance
}
