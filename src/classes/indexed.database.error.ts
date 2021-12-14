export class IndexedDatabaseError extends Error {
  event: Event
  request: IDBOpenDBRequest

  constructor(event?: Event, request?: IDBOpenDBRequest) {
    super(request?.error?.message)

    this.event = event || new Event('')
    this.name = request?.error?.name || ''
    this.request = request || ({} as any)
    this.stack = ''
  }

  static from(event: Event): IndexedDatabaseError
  static from(event: Event, request: IDBOpenDBRequest): IndexedDatabaseError
  static from(request: IDBOpenDBRequest): IndexedDatabaseError
  static from(...args: any[]): IndexedDatabaseError {
    switch (true) {
      case args[0] instanceof Event && args[1] instanceof IDBOpenDBRequest:
        return new IndexedDatabaseError(args[0], args[1])
      case args[0] instanceof Event:
        return new IndexedDatabaseError(args[0])
      case args[0] instanceof IDBOpenDBRequest:
        return new IndexedDatabaseError(undefined, args[0])
      default:
        return new IndexedDatabaseError()
    }
  }
}
