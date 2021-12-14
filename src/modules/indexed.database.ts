import { ID } from '..'
import { IndexedDatabaseError } from '../classes/indexed.database.error'
import { ModuleLogger } from '../loggers/module.logger'
import { IndexedDatabaseTable } from './indexed.database.table'

/**
 * A module to safely handle the Indexed Database.
 *
 * @category Module
 */
export class IndexedDatabase {
  /**
   * An {@link IDBDatabase} instance.
   */
  instance: IDBDatabase
  /**
   * A string which determines the name of the database.
   */
  name: string
  /**
   * An array of {@link DatabaseTable} instances.
   */
  tables: IndexedDatabaseTable<any>[]
  /**
   * A number which determines the version of the database.
   */
  version: number

  constructor(name: string, onUpgradeNeeded: (instance: IDBDatabase) => any, tables: IndexedDatabaseTable<any>[], version: number) {
    this.instance = {} as any
    this.name = name
    this.onUpgradeNeeded = onUpgradeNeeded
    this.tables = tables
    this.version = version
  }

  onUpgradeNeeded(instance: IDBDatabase): void {}

  open(): Promise<Event | Error> {
    return new Promise((resolve) => {
      let request: IDBOpenDBRequest

      request = window.indexedDB.open(this.name, this.version)
      request.onerror = (event: Event) => {
        ModuleLogger.error(this.id, 'open', `Failed to open the database.`, request)
        resolve(IndexedDatabaseError.from(event, request))
      }
      request.onsuccess = (event: Event) => {
        // @ts-ignore
        this.instance = event.target.result
        ModuleLogger.debug(this.id, 'open', `The instance of the database has been set.`, this.instance)

        this.instance.onversionchange = () => {
          this.instance.close()
          ModuleLogger.warn(this.id, 'open', `The database has closed because a new version is available, please reload or close this tab.`)
        }

        this.tables.forEach((v: IndexedDatabaseTable<any>) => {
          v.database = this.instance
          ModuleLogger.debug(this.id, 'open', `The database has been set for the table ${v.name}.`, v)
        })

        resolve(event)
      }
      request.onupgradeneeded = (event: Event) => {
        // @ts-ignore
        this.onUpgradeNeeded(event.target.result)
      }
    })
  }

  get id(): ID {
    return 'INDEXED_DATABASE_' + this.name
  }
}
