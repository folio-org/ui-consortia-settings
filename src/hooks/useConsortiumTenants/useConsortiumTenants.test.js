import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { useConsortiumTenants } from './useConsortiumTenants';

const consortiumId = 'consortium-id';
const tenants = [
  { id: 'consortium', code: 'MSU', name: 'Consortium', isCentral: true },
  { id: 'college', code: 'COL', name: 'College', isCentral: false },
];

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  get: jest.fn(() => ({
    json: async () => Promise.resolve({ tenants }),
  })),
};

describe('useConsortiumTenants', () => {
  beforeEach(() => {
    queryClient.clear();
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    useStripes.mockClear().mockReturnValue({ user: { user: { consortium: { id: consortiumId } } } });
  });

  it('should fetch all consortium tenants', async () => {
    const { result } = renderHook(() => useConsortiumTenants(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(
      `consortia/${consortiumId}/tenants`,
      expect.objectContaining({ searchParams: { limit: 1000 } }),
    );
    expect(result.current.tenants).toEqual(tenants);
  });

  it('should not fetch when user has no consortium', async () => {
    useStripes.mockReturnValue({ user: { user: {} } });

    const { result } = renderHook(() => useConsortiumTenants(), { wrapper });

    expect(kyMock.get).not.toHaveBeenCalled();
    expect(result.current.tenants).toEqual([]);
  });
});
