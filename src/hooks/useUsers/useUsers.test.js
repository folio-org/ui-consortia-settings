import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  act,
  renderHook,
  waitFor
} from '@folio/jest-config-stripes/testing-library/react';

import { useUsers } from './useUsers';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
  useNamespace: jest.fn().mockReturnValue(['1', '2', '3']),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = {
  users: [
    { id: '1', username: 'admin' },
  ]
};

describe('useTenantPermissions', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(data),
  }));
  beforeEach(() => {
    queryClient.clear();
    useOkapiKy.mockClear().mockReturnValue(
      {
        get: mockGet
      }
    );
  });

  it('should fetch tenant-related permissions', async () => {
    const tenantId = 'diku';
    const { result } = renderHook(() => useUsers(tenantId), { wrapper });
    await act(() => !result.current.isLoading);

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.users).toEqual(data.users);
  });
});
