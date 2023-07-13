# @qiwi/primitive-storage

[![CI](https://github.com/qiwi/primitive-storage/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/qiwi/primitive-storage/actions/workflows/ci.yaml)
[![Maintainability](https://api.codeclimate.com/v1/badges/b2f9b667caf025244af1/maintainability)](https://codeclimate.com/github/qiwi/primitive-storage/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/b2f9b667caf025244af1/test_coverage)](https://codeclimate.com/github/qiwi/primitive-storage/test_coverage)
[![npm (tag)](https://img.shields.io/npm/v/@qiwi/primitive-storage/latest.svg)](https://www.npmjs.com/package/@qiwi/primitive-storage)

> kv storage for basic purposes 

## Motivation
In ~~2018~~ 2023 it's easier to write own storage implementation than to find a suitable one.
* [memory-cache](https://www.npmjs.com/package/memory-cache) is good enough, but `setTimeout` for each entry set looks redundant (0.2.0)
* [data-store](https://www.npmjs.com/package/data-store) — very nice, but only synchronous saving is supported, no debouncing, no ttl (2.0.1)
* [node-cache](https://www.npmjs.com/package/node-cache) — pretty OK. Callbacks and events are supported. But no JSON.stringify handling, no persistency out of box (4.2.0)
* [CacheFactory](https://github.com/jmdobry/CacheFactory) — brilliant. localStorage, api, docs — everything is ok, but there's no file saving mechanism.

#### What's needed
* Key-Value scheme
* Optional TTL with scheduled compaction
* Optional value cloning
* Cycled refs handling (`JSON.safeStringify`, you know)
* Sync throttling
* Both browser and server runtimes support

## Install
```bash
    npm i @qiwi/primitive-storage
    yarn add @qiwi/primitive-storage
```

### JS/TS API
```ts
interface IStorage {
  get(key: string): any,
  set(key: string, value: any, ttl?: number): void,
  remove(key: string): void,
  reset(): void
}
```
```ts
import factory from '@antongolub/primitive-storage'

const storage = factory({defaultTtl: 60000})

storage.set('foo', 'bar')
storage.get('foo')  // 'bar'

// A minute later
storage.get('foo')  // undefined
```

Common aliases were also added for convenience:
* `put` = `set`
* `del` = `remove`
* `clear` = `reset`


### Configuration
| Option         | Type    | Def     | Description                                            |
|----------------|---------|---------|--------------------------------------------------------|
| `defaultTtl`   | number  | -       | If defined, the value would be applied as default ttl<br/>for every `set()` call |
| `debounce`     | Object  | -       | Options for persistent storage sync debounce.<br/> If empty no delay processed. IDebounceOpts:<br/>{<br/>   delay: number,<br/>   maxDelay?: number,<br/>   leading?: boolean<br/>   trailing?: boolean<br/>}|
| `path`         | string  | -       | Filepath (NodeJS) or localStorage scope (Browser)      |
| `compactTimer` | number  | -       | Period (ms) of automated `compact` method invocation<br/>If undefined, no periodic task is running |
| `clone`        | bool/fn | false   | `true` means that values are copied to storage on set.<br/>Default copier (JSON.parse(JSON.str(...))) may be replaced <br/>with custom. |


#### Persistent data
It's very simple: if `path` property declared in opts, the data is being persisted: 
* In case of NodeJS runtime, the data would be saved as json file. 
* Browser relies on `localStorage` API.
```javascript
    const storage = factory({path: './data.json'})
```

#### Compaction
Current impl is dumb: every `n` milliseconds the job filters out expired entries from the storage.
You're able to set `compactTimer` in storage opts, or just trigger `compact` method by hand.

## License
[MIT](./LICENSE)
