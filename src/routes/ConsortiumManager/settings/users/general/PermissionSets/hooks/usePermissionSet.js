import { useQuery } from 'react-query';
import { get } from 'lodash';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from '../../../../../../../hooks';

const DEFAULT_DATA = {};

export const usePermissionSet = ({ permissionSetId, tenantId, options = {} }) => {
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'view-permission-set' });

  const searchParams = {
    length: 10_000,
    query: `mutable==true and id==${permissionSetId}`,
    expandSubs: true,
  };

  const {
    isLoading,
    data = {},
  } = useQuery(
    [namespace],
    ({ signal }) => ky.get('perms/permissions', { searchParams, signal }).json(),
    {
      enabled: Boolean(tenantId && permissionSetId),
      ...options,
    },
  );

  const permissionsSet = get(data, 'permissions[0]', DEFAULT_DATA);

  return ({
    isLoading,
    permissionsSet,
  });
};
