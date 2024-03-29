import { QueryClient, QueryClientProvider } from 'react-query';

import { cleanup, renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { useTenantKy } from '../../../../../../../hooks';
import { usePermissionSet } from './usePermissionSet';

jest.mock('../../../../../../../hooks', () => ({
  ...jest.requireActual('../../../../../../../hooks'),
  useTenantKy: jest.fn(),
}));

const mockPermission = { id: 'perm-id' };

const permissions = [mockPermission];

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({ permissions, isLoading: false }),
  })),
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('usePermissionSet', () => {
  afterEach(cleanup);

  it('should return empty permission set', async () => {
    useTenantKy
      .mockClear()
      .mockReturnValue({
        get: jest.fn(() => ({
          json: () => Promise.resolve({ permissions: [], isLoading: false }),
        })),
      });

    const { result } = renderHook(() => usePermissionSet({
      permissionSetId: 'wrong-perm-id',
      tenantId: 'diku',
    }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.permissionsSet).toEqual({});
  });

  it('should return selected permission set', async () => {
    useTenantKy
      .mockClear()
      .mockReturnValue(kyMock);

    const { result } = renderHook(() => usePermissionSet({
      permissionSetId: 'perm-id',
      tenantId: 'diku',
    }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current.permissionsSet).toEqual(mockPermission);
  });
});
