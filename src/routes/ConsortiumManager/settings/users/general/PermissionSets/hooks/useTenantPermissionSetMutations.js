import { useMutation } from 'react-query';
import { omit } from 'lodash';

import { useTenantKy } from '../../../../../../../hooks';

const getNormalizedPermissionSet = (values) => {
  const filtered = omit(values, ['childOf', 'grantedTo', 'dummy', 'deprecated']);
  const permSet = {
    ...filtered,
    mutable: true,
    subPermissions: (values.subPermissions || []).map(p => p.permissionName),
  };

  return permSet;
};

export const useTenantPermissionSetMutations = (tenantId, options = {}) => {
  const ky = useTenantKy({ tenantId });

  const createMutationFn = (permissions = {}) => {
    return ky.post('perms/permissions', {
      json: {
        ...getNormalizedPermissionSet(permissions),
        mutable: true,
      },
    }).json();
  };

  const updateMutationFn = (permissions = {}) => {
    return ky.put(`perms/permissions/${permissions.id}`, {
      json: {
        ...getNormalizedPermissionSet(permissions),
        mutable: true,
      },
    }).json();
  };

  const removeMutationFn = (permissionSetId) => {
    return ky.delete(`perms/permissions/${permissionSetId}`);
  };

  const {
    mutateAsync: createPermissionSet,
  } = useMutation({ mutationFn: createMutationFn, ...options });

  const {
    mutateAsync: removePermissionSet,
  } = useMutation({ mutationFn: removeMutationFn, ...options });

  const {
    mutateAsync: updatePermissionSet,
  } = useMutation({ mutationFn: updateMutationFn, ...options });

  return ({
    createPermissionSet,
    removePermissionSet,
    updatePermissionSet,
  });
};
