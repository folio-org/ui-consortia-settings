import { cleanup, renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { get } from 'lodash';

import { useTenantKy } from '../../../../../../../hooks';
import { usePermissionSet } from './usePermissionSet';

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  get: jest.fn((data) => (data.length ? data[0] : {})),
}));

jest.mock('../../../../../../../hooks', () => ({
  ...jest.requireActual('../../../../../../../hooks'),
  useTenantKy: jest.fn(),
}));

const mockPermission = { id: 'perm-id' };

const permissions = [mockPermission];

const kyMock = {
  get: jest.fn(() => ({
    json: () => ({ permissions, isLoading: false }),
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
          json: () => ({ permissions: [], isLoading: false }),
        })),
      });

    const { result } = renderHook(() => usePermissionSet({
      permissionSetId: 'wrong-perm-id',
      tenantId: 'diku',
    }), { wrapper });

    expect(result.current.permissionsSet).toEqual({});
  });

  it('should return selected permission set', () => {
    get.mockClear().mockReturnValue(mockPermission);
    useTenantKy
      .mockClear()
      .mockReturnValue(kyMock);

    const { result } = renderHook(() => usePermissionSet({
      permissionSetId: 'perm-id',
      tenantId: 'diku',
    }), { wrapper });

    expect(result.current.permissionsSet).toEqual(mockPermission);
  });
});
