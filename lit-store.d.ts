import { EventEmitter } from 'events';

declare class Store<State extends object> extends EventEmitter {
    private state;
    constructor(initialState: State);
    setState(name: keyof State, value: any): void;
    getState(name: keyof State): any;
}

declare function select(storeStateName: string): (element: Element, name: string) => void;

declare function connect<State extends object>(store: Store<State>): <T extends new (...a: any[]) => any>(superClass: T) => {
  new (...a: any[]): {
      [x: string]: any;
      readonly store: Store<State>;
      connectedCallback(): void;
  };
} & T;

declare function createStore<State extends object>(initialState: State): Store<State>;

export { Store, connect, select, createStore };
