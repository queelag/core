import { Polyfill } from '../src'

export default async () => {
  await Polyfill.blob()
  await Polyfill.fetch()
  await Polyfill.file()
  await Polyfill.formData()
}
