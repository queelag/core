import { concatURL } from '../../src'

describe('URLUtils', () => {
  it('concates urls', () => {
    expect(concatURL('http://localhost:3000', 'route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000', '/route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000/', 'route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000/', '/route')).toBe('http://localhost:3000/route')
    expect(concatURL('http://localhost:3000', '')).toBe('http://localhost:3000')
    expect(concatURL('file:///route', 'index.html')).toBe('file:///route/index.html')
  })
})
