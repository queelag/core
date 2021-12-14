import { StructError } from 'superstruct'

export class IndexedDatabaseTableError extends Error {
  event: Event
  request: IDBRequest
  struct: StructError

  constructor(event?: Event, request?: IDBRequest, struct?: StructError) {
    super(request?.error?.message || struct?.message)

    this.event = event || new Event('')
    this.name = request?.error?.name || struct?.name || ''
    this.request = request || ({} as any)
    this.stack = struct?.stack || ''
    this.struct = struct || ({} as any)
  }

  static from(event: Event): IndexedDatabaseTableError
  static from(event: Event, request: IDBRequest): IndexedDatabaseTableError
  static from(request: IDBRequest): IndexedDatabaseTableError
  static from(validation: StructError): IndexedDatabaseTableError
  static from(...args: any[]): IndexedDatabaseTableError {
    switch (true) {
      case args[0] instanceof Event && args[1] instanceof IDBRequest:
        return new IndexedDatabaseTableError(args[0], args[1])
      case args[0] instanceof Event:
        return new IndexedDatabaseTableError(args[0])
      case args[0] instanceof IDBRequest:
        return new IndexedDatabaseTableError(undefined, args[0])
      case args[0] instanceof StructError:
        return new IndexedDatabaseTableError(undefined, undefined, args[0])
      default:
        return new IndexedDatabaseTableError()
    }
  }
}
