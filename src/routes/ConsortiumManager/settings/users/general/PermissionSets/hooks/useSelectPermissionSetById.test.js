import { renderHook } from '@testing-library/react-hooks';

import { useTenantPermissions } from '../../../../../../../hooks';
import { useSelectPermissionSetById } from './useSelectPermissionSetById';

jest.mock('../../../../../../../hooks', () => ({
  useTenantPermissions: jest.fn(),
}));

describe('useSelectPermissionSetById', () => {
  it('should return selected permission set', () => {
    const permissions = [
      { id: 'perm-id' },
    ];

    useTenantPermissions
      .mockClear()
      .mockReturnValue({ permissions, isLoading: false });

    const { result } = renderHook(() => useSelectPermissionSetById({
      permissionSetId: 'perm-id',
      tenantId: 'diku',
    }));

    expect(result.current.selectedPermissionSet).toEqual(permissions[0]);
  });

  it('should return empty permission set', () => {
    const permissions = [
      { id: 'perm-id' },
    ];

    useTenantPermissions
      .mockClear()
      .mockReturnValue({ permissions, isLoading: false });

    const { result } = renderHook(() => useSelectPermissionSetById({
      permissionSetId: 'wrong-perm-id',
      tenantId: 'diku',
    }));

    expect(result.current.selectedPermissionSet).toEqual({});
  });
});
