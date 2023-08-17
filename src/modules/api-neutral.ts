import { APIConfig } from '../index.js'
import { API as _ } from './api.js'
import { Polyfill } from './polyfill.js'

export class API<T extends APIConfig = APIConfig, U = undefined> extends _<T, U> {
  protected async onHandleStart(): Promise<void> {
    await Polyfill.blob()
    await Polyfill.fetch()
    await Polyfill.file()
    await Polyfill.formData()
  }
}
