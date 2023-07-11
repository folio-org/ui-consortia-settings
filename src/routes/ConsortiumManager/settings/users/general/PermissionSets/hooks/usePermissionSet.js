import { useTenantPermissions } from '../../../../../../../hooks';

export const usePermissionSet = ({ permissionSetId, tenantId }) => {
  const { permissions, isLoading } = useTenantPermissions({
    tenantId,
    searchParams: {
      query: `mutable==true and id==${permissionSetId}`,
      expandSubs: true,
    },
  });

  return ({
    isLoading,
    selectedPermissionSet: permissions[0] || {},
  });
};
