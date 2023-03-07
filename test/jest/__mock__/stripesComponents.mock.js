jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  CommandList: jest.fn(({ children }) => <>{children}</>),
}));
