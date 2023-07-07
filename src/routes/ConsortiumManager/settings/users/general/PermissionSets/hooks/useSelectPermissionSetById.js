import { useTenantPermissions } from '../../../../../../../hooks';

export const useSelectPermissionSetById = ({ permissionSetId, tenantId }) => {
  const { permissions, isLoading } = useTenantPermissions({
    tenantId,
    searchParams: {
      query: 'mutable==true',
      expandSubs: true,
    },
  });

  const selectedPermissionSet = permissions.find(({ id }) => id === permissionSetId);

  return ({
    isLoading,
    selectedPermissionSet: selectedPermissionSet || {},
  });
};
