import { DEFAULT_FUNCTIONS_CONFIGURATION } from '../definitions/constants.js'
import { ConfigurationFunctions } from '../definitions/interfaces.js'

/**
 * The Configuration class is used to configure the library.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/classes/configuration)
 */
export class Configuration {
  /**
   * The functions configuration.
   */
  static functions: ConfigurationFunctions = DEFAULT_FUNCTIONS_CONFIGURATION()
}
