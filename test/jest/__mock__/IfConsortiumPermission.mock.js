jest.mock('../../../src/components/IfConsortiumPermission', () => ({
  IfConsortiumPermission: jest.fn(({ children }) => <>{children}</>),
}));
