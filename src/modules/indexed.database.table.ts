import type { Struct, StructError } from 'superstruct'
import { IndexedDatabaseTableError } from '../classes/indexed.database.table.error'
import { WriteMode } from '../definitions/enums'
import { IndexedDatabaseTableIndex } from '../definitions/types'
import { ModuleLogger } from '../loggers/module.logger'
import { ErrorUtils } from '../utils/error.utils'

/**
 * A module to safely handle an Indexed Database table.
 *
 * @category Module
 */
export class IndexedDatabaseTable<T extends object> {
  /**
   * An {@link IDBDatabase} instance.
   */
  database: IDBDatabase
  /**
   * A string which determines the name of the table.
   */
  name: string
  /**
   * A {@link Struct} superstruct schema.
   */
  schema: Struct<T>

  constructor(name: string, schema: Struct<T>) {
    this.database = {} as any
    this.name = name
    this.schema = schema
  }

  create(database: IDBDatabase, indexes: IndexedDatabaseTableIndex[] = []): void {
    let store: IDBObjectStore, index: IDBIndex

    store = database.createObjectStore(this.name, { keyPath: 'id' })
    ModuleLogger.debug(this.id, 'create', `The table has been created.`, store)

    indexes.forEach((v: IndexedDatabaseTableIndex) => {
      index = store.createIndex(typeof v[0] === 'string' ? v[0] : (v[0] as string[]).join('.'), v[0], v[1])
      ModuleLogger.debug(this.id, 'create', `The index ${v[0]} has been created.`, v, index)
    })
  }

  delete(database: IDBDatabase): void {
    database.deleteObjectStore(this.name)
    ModuleLogger.debug(this.id, 'delete', `The table has been deleted.`)
  }

  async createRecord(record: T): Promise<Event | IndexedDatabaseTableError> {
    return this.writeRecord(WriteMode.CREATE, record)
  }

  async deleteRecord(query: IDBValidKey | IDBKeyRange, indexn?: string): Promise<Event | IndexedDatabaseTableError> {
    return new Promise((resolve) => {
      let transaction: IDBTransaction, store: IDBObjectStore, index: IDBIndex, request: IDBRequest

      transaction = this.database.transaction([this.name], 'readwrite')
      store = transaction.objectStore(this.name)

      if (indexn) {
        index = store.index(indexn)
        request = index.get(query)
      } else {
        request = store.delete(query)
      }

      request.onerror = (event: Event) => {
        ModuleLogger.error(this.id, 'deleteRecord', `Failed to delete the record.`, query, request.error)
        resolve(IndexedDatabaseTableError.from(event, request))
      }
      request.onsuccess = (event: Event) => {
        ModuleLogger.debug(this.id, 'deleteRecord', `The record has been deleted.`, query, request.result)
        resolve(event)
      }
    })
  }

  async readRecord(query: IDBValidKey | IDBKeyRange, indexn?: string): Promise<T | IndexedDatabaseTableError> {
    return new Promise((resolve) => {
      let transaction: IDBTransaction, store: IDBObjectStore, index: IDBIndex, request: IDBRequest

      transaction = this.database.transaction([this.name], 'readonly')
      store = transaction.objectStore(this.name)

      if (indexn) {
        index = store.index(indexn)
        request = index.get(query)
      } else {
        request = store.get(query)
      }

      request.onerror = (event: Event) => {
        ModuleLogger.error(this.id, 'readRecord', `Failed to read the record.`, query, request.error)
        resolve(IndexedDatabaseTableError.from(event, request))
      }
      request.onsuccess = (event: Event) => {
        if (request.result) {
          ModuleLogger.debug(this.id, 'readRecord', `The record has been read.`, query, request.result)
          return resolve(request.result)
        }

        ModuleLogger.debug(this.id, 'readRecord', `Failed to read the record.`, query, request.result)
        resolve(IndexedDatabaseTableError.from(event, request))
      }
    })
  }

  async updateRecord(record: T): Promise<Event | IndexedDatabaseTableError> {
    return this.writeRecord(WriteMode.UPDATE, record)
  }

  async writeRecord(mode: WriteMode, record: T): Promise<Event | IndexedDatabaseTableError> {
    return new Promise((resolve) => {
      let validation: [StructError | undefined, T | undefined], transaction: IDBTransaction, store: IDBObjectStore, request: IDBRequest

      validation = this.schema.validate(record)
      if (validation[0]) {
        ModuleLogger.error(this.id, 'writeRecord', `Failed to validate the record against its schema.`, record, this.schema, validation)
        resolve(IndexedDatabaseTableError.from(validation[0]))
      }

      transaction = this.database.transaction([this.name], 'readwrite')
      store = transaction.objectStore(this.name)

      switch (mode) {
        case WriteMode.CREATE:
          request = store.add(record)
          request.onerror = (event: Event) => {
            ModuleLogger.error(this.id, 'writeRecord', `Failed to add the record.`, record, request.error)
            resolve(IndexedDatabaseTableError.from(event, request))
          }
          request.onsuccess = (event: Event) => {
            ModuleLogger.debug(this.id, 'writeRecord', `The record has been added.`, record, request.result)
            resolve(event)
          }

          break
        case WriteMode.UPDATE:
          request = store.put(record)
          request.onerror = (event: Event) => {
            ModuleLogger.error(this.id, 'writeRecord', `Failed to update the record.`, record, request.error)
            resolve(IndexedDatabaseTableError.from(event, request))
          }
          request.onsuccess = (event: Event) => {
            ModuleLogger.debug(this.id, 'writeRecord', `The record has been updated.`, record, request.result)
            resolve(event)
          }

          break
      }
    })
  }

  async hasRecord(query: IDBValidKey | IDBKeyRange, indexn?: string): Promise<boolean> {
    return ErrorUtils.isNot(await this.readRecord(query, indexn))
  }

  get id(): string {
    return 'INDEXED_DATABASE_TABLE_' + this.name
  }
}
