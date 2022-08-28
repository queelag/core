import { CACHE_IMAGES } from '../definitions/constants'
import { UtilLogger } from '../loggers/util.logger'

/**
 * Draws an already loaded image element to a canvas and exports it as a base64 data URL.
 */
// istanbul ignore next
export function getImageElementBase64(image: HTMLImageElement, alpha: boolean = false, quality: number = 0.8): string {
  let canvas: HTMLCanvasElement, context: CanvasRenderingContext2D

  canvas = document.createElement('canvas')
  context = canvas.getContext('2d') || new CanvasRenderingContext2D()

  canvas.height = image.naturalHeight
  canvas.width = image.naturalWidth
  context.drawImage(image, 0, 0)

  return canvas.toDataURL(alpha ? 'image/png' : 'image/jpeg', quality)
}

/**
 * Preloads a set of image sources and caches them as base64 data URLs.
 */
// istanbul ignore next
export async function preloadImages(sources: string[]): Promise<boolean> {
  let loads: boolean[]

  loads = await Promise.all(
    sources
      .filter((v: string) => !CACHE_IMAGES.has(v))
      .map(
        (v: string) =>
          new Promise<boolean>((resolve) => {
            let element: HTMLImageElement

            element = document.createElement('img')
            element.crossOrigin = 'anonymous'
            element.src = v
            element.style.opacity = '0'
            element.style.pointerEvents = 'none'
            element.style.position = 'absolute'

            element.onerror = (event: string | Event) => {
              element.remove()
              UtilLogger.error('ImageUtils', 'preload', `The image with source ${v} failed to load.`, event)

              resolve(false)
            }
            element.onload = () => {
              CACHE_IMAGES.set(v, getImageElementBase64(element))

              element.remove()
              UtilLogger.debug('ImageUtils', 'preload', `The image with source ${v} has been cached and loaded.`)

              resolve(true)
            }

            document.body.appendChild(element)
          })
      )
  )

  return loads.every((v: boolean) => v)
}
