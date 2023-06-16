import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { useTenantKy } from '../useTenantKy';

const DEFAULT_DATA = [];

export const useTenantPermissions = (params = {}, options = {}) => {
  const { tenantId, searchParams: _searchParams = {} } = params;

  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'tenant-permissions' });

  const searchParams = {
    length: 10_000,
    ..._searchParams,
  };

  const {
    isFetching,
    isLoading,
    data = {},
  } = useQuery(
    [namespace, tenantId],
    ({ signal }) => ky.get('perms/permissions', { searchParams, signal }).json(),
    {
      enabled: Boolean(tenantId),
      ...options,
    },
  );

  return ({
    isFetching,
    isLoading,
    permissions: data.permissions || DEFAULT_DATA,
    totalRecords: data.totalRecords,
  });
};
