import { useMutation } from 'react-query';

import { useTenantKy } from '../../../../../../../hooks';

export const useTenantPermissionMutations = (tenantId, options = {}) => {
  const ky = useTenantKy({ tenantId });

  const createMutationFn = (permissions = {}) => {
    return ky.post('perms/permissions', {
      json: {
        ...permissions,
        mutable: true,
      },
    }).json();
  };

  const updateMutationFn = (permissions = {}) => {
    return ky.put(`perms/permissions/${permissions.id}`, {
      json: {
        ...permissions,
        mutable: true,
      },
    }).json();
  };

  const removeMutationFn = (permissionSetId) => {
    return ky.delete(`perms/permissions/${permissionSetId}`);
  };

  const {
    mutateAsync: createPermission,
  } = useMutation({ mutationFn: createMutationFn, ...options });

  const {
    mutateAsync: removePermission,
  } = useMutation({ mutationFn: removeMutationFn, ...options });

  const {
    mutateAsync: updatePermission,
  } = useMutation({ mutationFn: updateMutationFn, ...options });

  return ({
    createPermission,
    removePermission,
    updatePermission,
  });
};
