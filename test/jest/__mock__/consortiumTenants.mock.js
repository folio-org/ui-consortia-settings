jest.mock('../../../src/hooks/useConsortiumTenants', () => ({
  useConsortiumTenants: jest.fn().mockReturnValue({ tenants: [], isLoading: false }),
}));
