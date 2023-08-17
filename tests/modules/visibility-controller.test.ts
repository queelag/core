import { sleep } from '@aracna/core'
import { beforeEach, describe, expect, it } from 'vitest'
import { VisibilityController } from '../../src'

describe('VisibilityController', () => {
  let controller: VisibilityController, name: string

  beforeEach(() => {
    controller = new VisibilityController()
    name = 'dialog'
  })

  it('shows and hides', async () => {
    expect(controller.isHidden(name)).toBeTruthy()
    expect(controller.hasHidden).toBeFalsy()
    expect(controller.hasHiding).toBeFalsy()
    expect(controller.hasShowing).toBeFalsy()
    expect(controller.hasVisible).toBeFalsy()

    controller.show(name, 100)
    expect(controller.isShowing(name)).toBeTruthy()
    expect(controller.hasHidden).toBeFalsy()
    expect(controller.hasHiding).toBeFalsy()
    expect(controller.hasShowing).toBeTruthy()
    expect(controller.hasVisible).toBeFalsy()

    await sleep(200)
    expect(controller.isVisible(name)).toBeTruthy()
    expect(controller.hasHidden).toBeFalsy()
    expect(controller.hasHiding).toBeFalsy()
    expect(controller.hasShowing).toBeFalsy()
    expect(controller.hasVisible).toBeTruthy()

    controller.hide(name, 100)
    expect(controller.isHiding(name)).toBeTruthy()
    expect(controller.hasHidden).toBeFalsy()
    expect(controller.hasHiding).toBeTruthy()
    expect(controller.hasShowing).toBeFalsy()
    expect(controller.hasVisible).toBeFalsy()

    await sleep(200)
    expect(controller.isHidden(name)).toBeTruthy()
    expect(controller.hasHidden).toBeTruthy()
    expect(controller.hasHiding).toBeFalsy()
    expect(controller.hasShowing).toBeFalsy()
    expect(controller.hasVisible).toBeFalsy()
  })

  it('toggles visibility', async () => {
    expect(controller.isHidden(name)).toBeTruthy()
    controller.toggle(name, 100)
    expect(controller.isShowing(name)).toBeTruthy()
    await sleep(200)
    expect(controller.isVisible(name)).toBeTruthy()
    controller.toggle(name, 100)
    expect(controller.isHiding(name)).toBeTruthy()
    await sleep(200)
    expect(controller.isHidden(name)).toBeTruthy()
  })
})
