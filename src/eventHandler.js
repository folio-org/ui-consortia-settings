import { HANDLERS } from './handlers';

export const eventHandler = (event, stripes) => {
  const handler = HANDLERS[event];

  if (handler) {
    return handler(stripes);
  }

  return null;
};
