export class EventEmitter {
  constructor() {
    this.eventTarget = new EventTarget();
  }

  on(eventName, callback) {
    this.eventTarget.addEventListener(eventName, callback);
  }

  off(eventName, callback) {
    this.eventTarget.removeEventListener(eventName, callback);
  }

  emit(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });

    this.eventTarget.dispatchEvent(event);
  }
}
