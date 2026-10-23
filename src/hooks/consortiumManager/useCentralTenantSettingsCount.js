import { useQuery } from 'react-query';
import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { getConsortiumCentralTenantId } from '@folio/stripes-acq-components';

const searchParams = { limit: 0 };

export const useCentralTenantSettingsCount = (path, options = {}) => {
  const stripes = useStripes();
  const centralTenantId = getConsortiumCentralTenantId(stripes);
  const ky = useOkapiKy({ tenant: centralTenantId });

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery(
    ['central-tenant-settings-count', path, centralTenantId],
    ({ signal }) => ky.get(path, { signal, searchParams }).json(),
    {
      enabled: Boolean(path && centralTenantId),
      ...options,
    },
  );

  return {
    count: data?.totalRecords ?? 0,
    isFetching,
    isLoading,
    refetch,
  };
};
