import { EventEmitter } from './EventEmitter';

describe('EventEmitter', () => {
  let emitter;
  let callback;

  beforeEach(() => {
    emitter = new EventEmitter();
    callback = jest.fn();
  });

  afterEach(() => {
    callback.mockReset();
  });

  it('should add and invoke event listeners', () => {
    emitter.on('customEvent', callback);
    emitter.emit('customEvent', 'test data');

    expect(callback).toHaveBeenCalledWith('test data');
  });

  it('should remove event listeners', () => {
    emitter.on('customEvent', callback);
    emitter.off('customEvent', callback);
    emitter.emit('customEvent', 'test data');

    expect(callback).not.toHaveBeenCalled();
  });

  it('should emit events with the correct data', () => {
    emitter.on('customEvent', callback);
    emitter.emit('customEvent', 'test data');

    expect(callback).toHaveBeenCalledWith('test data');
  });
});
