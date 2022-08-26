import { Cookie } from './cookie'

/**
 * A module to handle document.cookie CRUD operations.
 *
 * @category Module
 */
export const DocumentCookie: Cookie = new Cookie(
  'DocumentCookie',
  async () => {
    if (typeof window !== 'object') {
      return ''
    }

    return document.cookie
  },
  async (cookie: string) => {
    if (typeof window !== 'object') {
      return
    }

    document.cookie = cookie
  }
)
