import { sleep } from '../functions/sleep.js'
import { ClassLogger } from '../loggers/class-logger.js'

export class VisibilityController {
  private data: Map<string, string> = new Map()

  async hide(name: string, delay: number = 0): Promise<void> {
    if (this.isHidden(name)) {
      return ClassLogger.warn('VisibilityController', 'hide', `The key ${name} is already hidden.`)
    }

    this.data.set(name, VisibilityController.HIDING)
    ClassLogger.verbose('VisibilityController', 'hide', `The key ${name} is hiding.`)

    await sleep(delay)

    this.data.set(name, VisibilityController.HIDDEN)
    ClassLogger.verbose('VisibilityController', 'hide', `The key ${name} is hidden.`)
  }

  async show(name: string, delay: number = 0): Promise<void> {
    if (this.isVisible(name)) {
      return ClassLogger.warn('VisibilityController', 'show', `The key ${name} is already visible.`)
    }

    this.data.set(name, VisibilityController.SHOWING)
    ClassLogger.verbose('VisibilityController', 'hide', `The key ${name} is showing.`)

    await sleep(delay)

    this.data.set(name, VisibilityController.VISIBLE)
    ClassLogger.verbose('VisibilityController', 'hide', `The key ${name} is visible.`)
  }

  async toggle(name: string, delay: number = 0): Promise<void> {
    if (this.isHidden(name)) {
      return this.show(name, delay)
    }

    return this.hide(name, delay)
  }

  clear(): void {
    this.data.clear()
    ClassLogger.verbose('VisibilityController', 'clear', `The data has been cleared.`)
  }

  private get(name: string): string {
    return this.data.get(name) ?? VisibilityController.HIDDEN
  }

  isHidden(name: string): boolean {
    return this.get(name) === VisibilityController.HIDDEN
  }

  isHiding(name: string): boolean {
    return this.get(name) === VisibilityController.HIDING
  }

  isShowing(name: string): boolean {
    return this.get(name) === VisibilityController.SHOWING
  }

  isVisible(name: string): boolean {
    return this.get(name) === VisibilityController.VISIBLE
  }

  get hasHidden(): boolean {
    return [...this.data.values()].includes(VisibilityController.HIDDEN)
  }

  get hasHiding(): boolean {
    return [...this.data.values()].includes(VisibilityController.HIDING)
  }

  get hasShowing(): boolean {
    return [...this.data.values()].includes(VisibilityController.SHOWING)
  }

  get hasVisible(): boolean {
    return [...this.data.values()].includes(VisibilityController.VISIBLE)
  }

  private static get HIDDEN(): string {
    return 'HIDDEN'
  }

  private static get HIDING(): string {
    return 'HIDING'
  }

  private static get SHOWING(): string {
    return 'SHOWING'
  }

  private static get VISIBLE(): string {
    return 'VISIBLE'
  }
}
