import { LitElement } from 'lit'
import { EventEmitter } from 'events'

const propSymbols = new Map<string, symbol>()

class Store<State extends object> extends EventEmitter {
  private state: State

  constructor (initialState: State) {
    super()
    this.state = initialState ?? Object.create(null)
  }

  setState (name: keyof State, value: any): void {
    this.state[name] = value
    const symbol = propSymbols.get(name as string)
    if (symbol != null) {
      this.emit('stateChange', symbol)
    }
  }

  getState (name: keyof State): any {
    return this.state[name]
  }
}

function select (storeStateName: string) {
  return function (element: Element, name: string) {
    let symbol: symbol

    if (propSymbols.has(storeStateName)) {
      symbol = propSymbols.get(storeStateName) as symbol
    } else {
      symbol = Symbol(storeStateName)
      propSymbols.set(storeStateName, symbol)
    }

    Object.defineProperty(element, symbol, {
      set (value) {
        if (this.store.state[storeStateName] !== value) {
          this.store.setState(storeStateName, value)
        }
      },

      get () {
        return this.store.state[storeStateName]
      }
    })

    Object.defineProperty(element, name, {
      set (value) {
        this[symbol] = value
      },

      get () {
        return this[symbol]
      }
    })
  }
}

function connect<State extends object> (store: Store<State>) {
  return function (superClass: typeof LitElement) {
    return class extends superClass {
      get store (): Store<State> {
        return store
      }

      connectedCallback (): void {
        super.connectedCallback()
        this.store.on('stateChange', (name) => {
          this.requestUpdate(name)
        })
      }
    }
  }
}

function createStore<State extends object> (initialState: State): Store<State> {
  const store = new Store(initialState)
  return store
}

export {
  connect,
  select,
  createStore
}
