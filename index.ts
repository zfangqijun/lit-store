import { connect as connectStore, createStore, select } from './lit-store'

const initState = {
  'project.name': '',
  'modal.home.visible': false,
  'blockly.workspace.canUndo': true,
  'blockly.workspace.canRedo': false
}

const store = createStore(initState);

(window as any).store = store

const connect = connectStore(store)

export {
  connect,
  select
}
