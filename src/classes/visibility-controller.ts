import { VisibilityControllerToggleDelay } from '../definitions/types.js'
import { sleep } from '../functions/sleep.js'
import { ClassLogger } from '../loggers/class-logger.js'

/**
 * The VisibilityController class is used to control the visibility of anything that can be hidden or shown.
 */
export class VisibilityController {
  protected readonly data: Map<string, string> = new Map()

  /**
   * Hides the entity with the given name.
   * Optionally a delay can be set.
   */
  async hide(name: string, delay: number = 0): Promise<void> {
    if (this.isHidden(name)) {
      return ClassLogger.warn('VisibilityController', 'hide', `The key ${name} is already hidden.`)
    }

    if (delay > 0) {
      this.data.set(name, VisibilityController.HIDING)
      ClassLogger.verbose('VisibilityController', 'hide', `The key ${name} is hiding.`)

      await sleep(delay)
    }

    this.data.set(name, VisibilityController.HIDDEN)
    ClassLogger.verbose('VisibilityController', 'hide', `The key ${name} is hidden.`)
  }

  /**
   * Shows the entity with the given name.
   * Optionally a delay can be set.
   */
  async show(name: string, delay: number = 0): Promise<void> {
    if (this.isVisible(name)) {
      return ClassLogger.warn('VisibilityController', 'show', `The key ${name} is already visible.`)
    }

    if (delay > 0) {
      this.data.set(name, VisibilityController.SHOWING)
      ClassLogger.verbose('VisibilityController', 'hide', `The key ${name} is showing.`)

      await sleep(delay)
    }

    this.data.set(name, VisibilityController.VISIBLE)
    ClassLogger.verbose('VisibilityController', 'hide', `The key ${name} is visible.`)
  }

  /**
   * Toggles the entity with the given name.
   * Optionally a delay can be set, which can be different for hiding and showing.
   */
  async toggle(name: string, delay: VisibilityControllerToggleDelay = 0): Promise<void> {
    if (this.isHidden(name)) {
      return this.show(name, typeof delay === 'number' ? delay : delay.show)
    }

    if (this.isVisible(name)) {
      return this.hide(name, typeof delay === 'number' ? delay : delay.hide)
    }
  }

  /**
   * Clears the visibility of all entities.
   */
  clear(): void {
    this.data.clear()
    ClassLogger.verbose('VisibilityController', 'clear', `The data has been cleared.`)
  }

  protected get(name: string): string {
    return this.data.get(name) ?? VisibilityController.HIDDEN
  }

  /**
   * Checks if the entity with the given name is hidden.
   */
  isHidden(name: string): boolean {
    return this.get(name) === VisibilityController.HIDDEN
  }

  /**
   * Checks if the entity with the given name is hiding.
   */
  isHiding(name: string): boolean {
    return this.get(name) === VisibilityController.HIDING
  }

  /**
   * Checks if the entity with the given name is showing.
   */
  isShowing(name: string): boolean {
    return this.get(name) === VisibilityController.SHOWING
  }

  /**
   * Checks if the entity with the given name is visible.
   */
  isVisible(name: string): boolean {
    return this.get(name) === VisibilityController.VISIBLE
  }

  /**
   * Checks if any entity is hidden.
   */
  get hasHidden(): boolean {
    return [...this.data.values()].includes(VisibilityController.HIDDEN)
  }

  /**
   * Checks if any entity is hiding.
   */
  get hasHiding(): boolean {
    return [...this.data.values()].includes(VisibilityController.HIDING)
  }

  /**
   * Checks if any entity is showing.
   */
  get hasShowing(): boolean {
    return [...this.data.values()].includes(VisibilityController.SHOWING)
  }

  /**
   * Checks if any entity is visible.
   */
  get hasVisible(): boolean {
    return [...this.data.values()].includes(VisibilityController.VISIBLE)
  }

  protected static get HIDDEN(): string {
    return 'HIDDEN'
  }

  protected static get HIDING(): string {
    return 'HIDING'
  }

  protected static get SHOWING(): string {
    return 'SHOWING'
  }

  protected static get VISIBLE(): string {
    return 'VISIBLE'
  }
}
