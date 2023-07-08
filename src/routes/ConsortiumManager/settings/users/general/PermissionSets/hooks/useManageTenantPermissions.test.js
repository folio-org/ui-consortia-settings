import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useManageTenantPermissions } from './useManageTenantPermissions';
import { useTenantKy } from '../../../../../../../hooks';

jest.mock('../../../../../../../hooks', () => ({
  ...jest.requireActual('../../../../../../../hooks'),
  useTenantKy: jest.fn(),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const permissions = [
  { id: 'perm-id' },
];

const kyMock = {
  post: jest.fn(() => ({
    json: () => ({ permissions, totalRecords: permissions.length }),
  })),
  delete: jest.fn(() => 'ok'),
  put: jest.fn(() => ({
    json: () => ({ permissions, totalRecords: permissions.length }),
  })),
};

describe('useManageTenantPermission', () => {
  beforeEach(() => {
    useTenantKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should have createPermission, removePermission, updatePermission mutations', async () => {
    const tenantId = 'diku';
    const { result } = renderHook(() => useManageTenantPermissions(tenantId, {}), { wrapper });

    expect(result.current).toHaveProperty('createPermission');
    expect(result.current).toHaveProperty('removePermission');
    expect(result.current).toHaveProperty('updatePermission');
  });

  it('should call createPermission, removePermission, updatePermission mutations', async () => {
    const tenantId = 'diku';
    const { result } = renderHook(() => useManageTenantPermissions(tenantId, {}), { wrapper });

    const createPermission = await result.current.createPermission();
    const updatePermission = await result.current.updatePermission();
    const removePermission = await result.current.removePermission();

    expect(createPermission).toEqual({ permissions, totalRecords: permissions.length });
    expect(updatePermission).toEqual({ permissions, totalRecords: permissions.length });
    expect(removePermission).toEqual('ok');
  });
});
