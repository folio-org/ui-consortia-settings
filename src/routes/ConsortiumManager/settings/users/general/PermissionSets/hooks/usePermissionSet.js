import { useTenantPermissions } from '../../../../../../../hooks';

export const usePermissionSet = ({ permissionSetId, tenantId }) => {
  const { permissions, isLoading } = useTenantPermissions({
    tenantId,
    searchParams: {
      query: `mutable==true and id==${permissionSetId}`,
      expandSubs: true,
    },
    permissionId: permissionSetId,
  });

  return ({
    isLoading,
    permissionsSet: permissions[0] || {},
  });
};
