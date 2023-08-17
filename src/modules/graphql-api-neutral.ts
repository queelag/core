import { GraphQLAPIConfig } from '../index.js'
import { GraphQLAPI as _ } from './graphql-api.js'
import { Polyfill } from './polyfill.js'

export class GraphQLAPI<T extends GraphQLAPIConfig = GraphQLAPIConfig, U = undefined> extends _<T, U> {
  protected async onHandleStart(): Promise<void> {
    await Polyfill.blob()
    await Polyfill.fetch()
    await Polyfill.file()
    await Polyfill.formData()
  }
}
