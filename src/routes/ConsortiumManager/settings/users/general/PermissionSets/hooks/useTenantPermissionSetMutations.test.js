import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useTenantPermissionSetMutations } from './useTenantPermissionSetMutations';
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

describe('useTenantPermissionSetMutations', () => {
  beforeEach(() => {
    useTenantKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should have createPermission, removePermission, updatePermission mutations', async () => {
    const tenantId = 'diku';
    const { result } = renderHook(() => useTenantPermissionSetMutations(tenantId, {}), { wrapper });

    expect(result.current).toHaveProperty('createPermissionSet');
    expect(result.current).toHaveProperty('removePermissionSet');
    expect(result.current).toHaveProperty('updatePermissionSet');
  });

  it('should call createPermissionSet, removePermissionSet, updatePermissionSet mutations', async () => {
    const tenantId = 'diku';
    const { result } = renderHook(() => useTenantPermissionSetMutations(tenantId, {}), { wrapper });

    const createPermissionSet = await result.current.createPermissionSet();
    const updatePermissionSet = await result.current.updatePermissionSet();
    const removePermissionSet = await result.current.removePermissionSet();

    expect(createPermissionSet).toEqual({ permissions, totalRecords: permissions.length });
    expect(updatePermissionSet).toEqual({ permissions, totalRecords: permissions.length });
    expect(removePermissionSet).toEqual('ok');
  });
});
