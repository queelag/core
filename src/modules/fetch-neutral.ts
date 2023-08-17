import { Fetch as _ } from './fetch.js'
import { Polyfill } from './polyfill.js'

export class Fetch extends _ {
  protected static async onHandleStart() {
    await Polyfill.blob()
    await Polyfill.fetch()
    await Polyfill.file()
    await Polyfill.formData()
  }
}
