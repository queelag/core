import { appendSearchParamsToURL, concatURL, removeSearchParamsFromURL } from '../../src'

describe('URLUtils', () => {
  it('concatenates an URL', () => {
    expect(concatURL('http://localhost:3000', 'route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000', '/route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000/', 'route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000/', '/route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000', '')).toBe('http://localhost:3000')
    expect(concatURL('file:///route', 'index.html')).toBe('file:///route/index.html')
  })

  it('appends search params', () => {
    expect(appendSearchParamsToURL('http://localhost:3000', 'a=0')).toBe('http://localhost:3000?a=0')
    expect(appendSearchParamsToURL('http://localhost:3000', '?a=0')).toBe('http://localhost:3000?a=0')
    expect(appendSearchParamsToURL('http://localhost:3000?', 'a=0')).toBe('http://localhost:3000?a=0')
    expect(appendSearchParamsToURL('http://localhost:3000?', '?a=0')).toBe('http://localhost:3000?a=0')
    expect(appendSearchParamsToURL('http://localhost:3000?a=0', 'b=0')).toBe('http://localhost:3000?a=0&b=0')
    expect(appendSearchParamsToURL('http://localhost:3000?a=0&', '?b=0')).toBe('http://localhost:3000?a=0&b=0')
    expect(appendSearchParamsToURL('http://localhost:3000?a=0&', '&b=0')).toBe('http://localhost:3000?a=0&b=0')
  })

  it('removes search params', () => {
    expect(removeSearchParamsFromURL('http://localhost:3000?')).toBe('http://localhost:3000')
    expect(removeSearchParamsFromURL('http://localhost:3000?a')).toBe('http://localhost:3000')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=')).toBe('http://localhost:3000')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=0')).toBe('http://localhost:3000')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=0&')).toBe('http://localhost:3000')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=0&b')).toBe('http://localhost:3000')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=0&b=')).toBe('http://localhost:3000')
    expect(removeSearchParamsFromURL('http://localhost:3000?a=0&b=0')).toBe('http://localhost:3000')
  })
})
