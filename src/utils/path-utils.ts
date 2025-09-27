// Copyright 2018-2024 the Deno authors. All rights reserved. MIT license.
// Copyright the Browserify authors. MIT License.

import {
  CHAR_BACKWARD_SLASH,
  CHAR_COLON,
  CHAR_DOT,
  CHAR_FORWARD_SLASH,
  CHAR_LOWERCASE_A,
  CHAR_LOWERCASE_Z,
  CHAR_UPPERCASE_A,
  CHAR_UPPERCASE_Z
} from '../definitions/constants.js'
import type { JoinPathsOptions } from '../definitions/interfaces.js'

function assertArg(path: string) {
  assertPath(path)
  if (path.length === 0) return '.'
}

function assertPath(path: string) {
  if (typeof path !== 'string') {
    throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`)
  }
}

/**
 * Joins a sequence of paths together.
 * Optionally uses the Windows standard.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/path)
 */
export function joinPaths(paths: string[], options?: JoinPathsOptions): string
export function joinPaths(...paths: string[]): string
export function joinPaths(...args: any[]): string {
  let paths: string[], options: JoinPathsOptions | undefined, joined: string | undefined

  paths = typeof args[0] === 'string' ? args : args[0]
  options = typeof args[1] === 'object' ? args[1] : undefined

  if (paths.length === 0) {
    return '.'
  }

  for (let i = 0, len = paths.length; i < len; ++i) {
    let path: string

    path = paths[i]
    assertPath(path)

    if (path.length > 0) {
      if (!joined) {
        joined = path
        continue
      }

      joined += `/${path}`
    }
  }

  if (!joined) {
    return '.'
  }

  return options?.windows ? normalizeWindows(joined) : normalizePosix(joined)
}

/**
 * Joins a sequence of paths together using the Windows standard.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/utils/path)
 */
export function joinWindowsPaths(...paths: string[]): string {
  return joinPaths(paths, { windows: true })
}

function normalizePosix(path: string): string {
  assertArg(path)

  const isAbsolute = isPosixPathSeparator(path.charCodeAt(0))
  const trailingSeparator = isPosixPathSeparator(path.charCodeAt(path.length - 1))

  // Normalize the path
  path = normalizeString(path, !isAbsolute, '/', isPosixPathSeparator)

  if (path.length === 0 && !isAbsolute) path = '.'
  if (path.length > 0 && trailingSeparator) path += '/'

  if (isAbsolute) return `/${path}`
  return path
}

function normalizeWindows(path: string): string {
  assertArg(path)

  const len = path.length
  let rootEnd = 0
  let device: string | undefined
  let isAbsolute = false
  const code = path.charCodeAt(0)

  // Try to match a root
  if (len > 1) {
    if (isWindowsPathSeparator(code)) {
      // Possible UNC root

      // If we started with a separator, we know we at least have an absolute
      // path of some kind (UNC or otherwise)
      isAbsolute = true

      if (isWindowsPathSeparator(path.charCodeAt(1))) {
        // Matched double path separator at beginning
        let j = 2
        let last = j
        // Match 1 or more non-path separators
        for (; j < len; ++j) {
          if (isWindowsPathSeparator(path.charCodeAt(j))) break
        }
        if (j < len && j !== last) {
          const firstPart = path.slice(last, j)
          // Matched!
          last = j
          // Match 1 or more path separators
          for (; j < len; ++j) {
            if (!isWindowsPathSeparator(path.charCodeAt(j))) break
          }
          if (j < len && j !== last) {
            // Matched!
            last = j
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (isWindowsPathSeparator(path.charCodeAt(j))) break
            }
            if (j === len) {
              // We matched a UNC root only
              // Return the normalized version of the UNC root since there
              // is nothing left to process

              return `\\\\${firstPart}\\${path.slice(last)}\\`
            } else if (j !== last) {
              // We matched a UNC root with leftovers

              device = `\\\\${firstPart}\\${path.slice(last, j)}`
              rootEnd = j
            }
          }
        }
      } else {
        rootEnd = 1
      }
    } else if (isWindowsDeviceRoot(code)) {
      // Possible device root

      if (path.charCodeAt(1) === CHAR_COLON) {
        device = path.slice(0, 2)
        rootEnd = 2
        if (len > 2) {
          if (isWindowsPathSeparator(path.charCodeAt(2))) {
            // Treat separator following drive name as an absolute path
            // indicator
            isAbsolute = true
            rootEnd = 3
          }
        }
      }
    }
  } else if (isWindowsPathSeparator(code)) {
    // `path` contains just a path separator, exit early to avoid unnecessary
    // work
    return '\\'
  }

  let tail: string
  if (rootEnd < len) {
    tail = normalizeString(path.slice(rootEnd), !isAbsolute, '\\', isWindowsPathSeparator)
  } else {
    tail = ''
  }
  if (tail.length === 0 && !isAbsolute) tail = '.'
  if (tail.length > 0 && isWindowsPathSeparator(path.charCodeAt(len - 1))) {
    tail += '\\'
  }
  if (device === undefined) {
    if (isAbsolute) {
      if (tail.length > 0) return `\\${tail}`
      else return '\\'
    } else if (tail.length > 0) {
      return tail
    } else {
      return ''
    }
  } else if (isAbsolute) {
    if (tail.length > 0) return `${device}\\${tail}`
    else return `${device}\\`
  } else if (tail.length > 0) {
    return device + tail
  } else {
    return device
  }
}

function normalizeString(path: string, allowAboveRoot: boolean, separator: string, isPathSeparator: (code: number) => boolean): string {
  let res = ''
  let lastSegmentLength = 0
  let lastSlash = -1
  let dots = 0
  let code: number | undefined
  for (let i = 0, len = path.length; i <= len; ++i) {
    if (i < len) code = path.charCodeAt(i)
    else if (isPathSeparator(code!)) break
    else code = CHAR_FORWARD_SLASH

    if (isPathSeparator(code!)) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== CHAR_DOT || res.charCodeAt(res.length - 2) !== CHAR_DOT) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf(separator)
            if (lastSlashIndex === -1) {
              res = ''
              lastSegmentLength = 0
            } else {
              res = res.slice(0, lastSlashIndex)
              lastSegmentLength = res.length - 1 - res.lastIndexOf(separator)
            }
            lastSlash = i
            dots = 0
            continue
          } else if (res.length === 2 || res.length === 1) {
            res = ''
            lastSegmentLength = 0
            lastSlash = i
            dots = 0
            continue
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) res += `${separator}..`
          else res = '..'
          lastSegmentLength = 2
        }
      } else {
        if (res.length > 0) res += separator + path.slice(lastSlash + 1, i)
        else res = path.slice(lastSlash + 1, i)
        lastSegmentLength = i - lastSlash - 1
      }
      lastSlash = i
      dots = 0
    } else if (code === CHAR_DOT && dots !== -1) {
      ++dots
    } else {
      dots = -1
    }
  }
  return res
}

function isPosixPathSeparator(code: number): boolean {
  return code === CHAR_FORWARD_SLASH
}

function isWindowsPathSeparator(code: number): boolean {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH
}

function isWindowsDeviceRoot(code: number): boolean {
  return (code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z) || (code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z)
}
