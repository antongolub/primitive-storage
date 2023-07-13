import {IAny, ICachedStorage, IStorageOpts} from '../interface'
import AbstractPersistentStorage from './abstractPersistentStorage'
export const PREFIX = '__@@ps__'
export const DEFAULT_PATH = 'default.json'

export default class PersistentLocalStorage extends AbstractPersistentStorage
  implements ICachedStorage {

  constructor(opts: IStorageOpts = {}) {
    const path = PREFIX + (opts.path || DEFAULT_PATH)
    const _opts = {...opts, path}
    super(_opts)
  }
}

const g = global || window

PersistentLocalStorage.prototype.io = {
  write: (path: string, data: string): void => {
    g.localStorage.setItem(path, data)
  },

  read: (path: string): IAny => {
    return g.localStorage.getItem(path)
  },
}
