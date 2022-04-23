import { useStore, pipeline } from '../../helpers/index.js';

const store = useStore();

export default class ComponentHandler extends HTMLElement {
  constructor() {
    super();
    this.store = store;
  }

  process(execute, params) {
    return pipeline(execute, params);
  }

  bindHandler(events) {
    events.forEach(({ type, callback }) => this.addEventListener(type, callback));
    return () => {
      events.forEach(({ type, callback }) => this.removeEventListener(type, callback));
    };
  }

  dispatch(type, detail) {
    this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true }));
    return this;
  }
}
