import { EventEmitter } from './EventEmitter';

const EVENT_TYPE = 'test-event-type';
const callback = jest.fn();
const payload = 'Test payload';

describe('EventEmitter', () => {
  let emitter;

  beforeEach(() => {
    emitter = new EventEmitter();
    callback.mockClear();
  });

  it('should add and invoke event listeners', () => {
    emitter.on(EVENT_TYPE, callback);
    emitter.emit(EVENT_TYPE, payload);

    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ detail: payload }));
  });

  it('should remove event listeners', () => {
    emitter.on(EVENT_TYPE, callback);
    emitter.off(EVENT_TYPE, callback);
    emitter.emit(EVENT_TYPE, payload);

    expect(callback).not.toHaveBeenCalled();
  });

  it('should emit events with the correct data', () => {
    emitter.on(EVENT_TYPE, callback);
    emitter.emit(EVENT_TYPE, payload);

    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ detail: payload }));
  });
});
