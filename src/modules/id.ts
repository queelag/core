import { customRandom, random } from 'nanoid'
import { ID_ALPHABET_ALPHANUMERIC } from '../definitions/constants.js'
import { IDGenerateOptions } from '../definitions/interfaces.js'

/**
 * @category Module
 */
export class ID {
  static readonly alphabet: string = ID_ALPHABET_ALPHANUMERIC
  static readonly random: (bytes: number) => Uint8Array = random
  static readonly separator: string = '_'
  static readonly size: number = 32

  static generate(options: IDGenerateOptions = {}): string {
    let alphabet: string, blacklist: string[], random: (bytes: number) => Uint8Array, separator: string, size: number, id: string

    alphabet = options.alphabet || ID.alphabet
    blacklist = options.blacklist || []
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
