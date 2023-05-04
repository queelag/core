import { customRandom, random } from 'nanoid'
import { ID_ALPHABET_ALPHANUMERIC } from '../definitions/constants.js'
import { IDGenerateOptions } from '../definitions/interfaces.js'

export class ID {
  static alphabet: string = ID_ALPHABET_ALPHANUMERIC
  static random: (bytes: number) => Uint8Array = random
  static separator: string = '_'
  static size: number = 32

  static generate(options: IDGenerateOptions = {}): string {
    let alphabet: string, blacklist: string[], random: (bytes: number) => Uint8Array, separator: string, size: number, id: string

    blacklist = options.blacklist || []
    alphabet = options.alphabet || ID.alphabet
    random = options.random || ID.random
    separator = options.separator || ID.separator
    size = options.size || ID.size

    while (true) {
      id = [options.prefix, customRandom(alphabet, size, random)(), options.suffix].filter(Boolean).join(options.separator || '_')
      if (!blacklist.includes(id)) break
    }

    return id
  }
}
