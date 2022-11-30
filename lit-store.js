import { EventEmitter } from 'events';
const propSymbols = new Map();
class Store extends EventEmitter {
    constructor(initialState) {
        super();
        this.state = initialState ?? Object.create(null);
    }
    setState(name, value) {
        const symbol = propSymbols.get(name);
        if(symbol == null) return;
        if(this.state[name] === value) return;
        this.state[name] = value;
        this.emit('stateChange', symbol);
    }
    getState(name) {
        return this.state[name];
    }
}
function select(storeStateName) {
    return function (element, name) {
        let symbol;
        if (propSymbols.has(storeStateName)) {
            symbol = propSymbols.get(storeStateName);
        }
        else {
            symbol = Symbol(storeStateName);
            propSymbols.set(storeStateName, symbol);
        }
        Object.defineProperty(element, symbol, {
            set(value) {
                if (this.store.state[storeStateName] !== value) {
                    this.store.setState(storeStateName, value);
                }
            },
            get() {
                return this.store.state[storeStateName];
            }
        });
        Object.defineProperty(element, name, {
            set(value) {
                this[symbol] = value;
            },
            get() {
                return this[symbol];
            }
        });
    };
}
function connect(store) {
    return function (superClass) {
        return class extends superClass {
            get store() {
                return store;
            }
            connectedCallback() {
                super.connectedCallback();
                this.store.on('stateChange', (name) => {
                    this.requestUpdate(name);
                });
            }
        };
    };
}
function createStore(initialState) {
    const store = new Store(initialState);
    return store;
}
export { Store, connect, select, createStore };
