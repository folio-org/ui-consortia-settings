import { renderHook } from '@testing-library/react-hooks';

import { useTenantPermissions } from '../../../../../../../hooks';
import { usePermissionSet } from './usePermissionSet';

jest.mock('../../../../../../../hooks', () => ({
  useTenantPermissions: jest.fn(),
}));

const mockPermission = { id: 'perm-id' };

describe('usePermissionSet', () => {
  beforeEach(() => {
    useTenantPermissions
      .mockClear()
      .mockReturnValue({ permissions: [mockPermission], isLoading: false });
  });

  it('should return selected permission set', () => {
    const { result } = renderHook(() => usePermissionSet({
      permissionSetId: 'perm-id',
      tenantId: 'diku',
    }));

    expect(result.current.selectedPermissionSet).toEqual(mockPermission);
  });

  it('should return empty permission set', () => {
    useTenantPermissions.mockReturnValue({ permissions: [], isLoading: false });

    const { result } = renderHook(() => usePermissionSet({
      permissionSetId: 'wrong-perm-id',
      tenantId: 'diku',
    }));

    expect(result.current.selectedPermissionSet).toEqual({});
  });
});
