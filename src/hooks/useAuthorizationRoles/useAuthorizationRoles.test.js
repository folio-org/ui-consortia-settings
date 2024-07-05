import { QueryClient, QueryClientProvider } from 'react-query';
import { act, renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useOkapiKy } from '@folio/stripes/core';

import { useAuthorizationRoles } from './useAuthorizationRoles';

const queryClient = new QueryClient();

const reqMock = {
  headers: {
    set: jest.fn(),
  },
};

const kyMock = {
  extend: jest.fn(({ hooks: { beforeRequest } }) => {
    beforeRequest[0](reqMock);

    return kyMock;
  }),
  get: jest.fn(() => ({
    json: async () => Promise.resolve(data),
  })),
};

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = { roles: [{ id: '1', name: 'role-1' }, { id: '2', name: 'role-2' }, { id: '3', name: 'role-3' }] };
describe('useRoleById', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('fetches authorization roles', async () => {
    const { result } = renderHook(() => useAuthorizationRoles(1), { wrapper });
    await act(() => !result.current.isLoading);

    expect(result.current.roles).toEqual(data.roles);
    expect(result.current.isLoading).toBe(false);

    const spy = jest.spyOn(result.current, 'onSubmitSearch');
    await act(async () => { result.current.onSubmitSearch('role'); });

    expect(spy).toHaveBeenCalled();
  });
});
