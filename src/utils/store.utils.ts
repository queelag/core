export class StoreUtils {
  static updateKeys<T extends object, U extends object>(store: T, props: U, whitelist: (keyof T & keyof U)[], onUpdate: () => any = () => {}): void {
    let updated: boolean | undefined

    // @ts-ignore
    Object.entries(props).forEach(([k, v]: [keyof T & keyof U, any]) => {
      if (whitelist.includes(k) && this.shouldUpdateKey(store, k, v)) {
        // @ts-ignore
        store[k] = v
        updated = true
      }
    })

    updated && onUpdate()
  }

  static shouldUpdateKeys<T extends object, U extends object>(store: T, props: U, whitelist: (keyof T & keyof U)[]): boolean {
    return whitelist.some((k: keyof T & keyof U) => this.shouldUpdateKey(store, k, props[k]))
  }

  static shouldUpdateKey<T extends object>(store: T, key: keyof T, prop: any): prop is T {
    return prop !== undefined && store[key] !== prop
  }
}
