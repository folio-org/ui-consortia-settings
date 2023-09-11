import { EventEmitter } from '../../utils';

const eventEmitter = new EventEmitter();

export const useEventEmitter = () => {
  return eventEmitter;
};
