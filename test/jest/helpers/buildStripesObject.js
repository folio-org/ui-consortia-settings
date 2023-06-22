export const buildStripesObject = (otherProperties = {}) => {
  const stripes = {
    hasPerm: jest.fn(() => true),
    hasInterface: jest.fn(() => true),
    clone: jest.fn(() => stripes),
    logger: { log: jest.fn() },
    config: {},
    okapi: {
      url: '',
      tenant: '',
    },
    locale: 'en-US',
    withOkapi: true,
    setToken: jest.fn(),
    actionNames: [],
    setLocale: jest.fn(),
    setTimezone: jest.fn(),
    setCurrency: jest.fn(),
    setSinglePlugin: jest.fn(),
    setBindings: jest.fn(),
    connect: jest.fn(v => v),
    ...otherProperties,
  };

  return stripes;
};
