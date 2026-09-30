import { stringify } from 'query-string';
import { useQuery } from 'react-query';
import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { OKAPI_TENANT_HEADER } from '../../constants';

const searchParams = { limit: 0 };

export const useCentralTenantSettingsCount = (path, options = {}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const centralTenantId = stripes.user?.user?.consortium?.centralTenantId;

  const { data, isFetching, isLoading } = useQuery(
    ['central-tenant-settings-count', path, centralTenantId],
    ({ signal }) => ky.extend({
      hooks: {
        beforeRequest: [(r) => r.headers.set(OKAPI_TENANT_HEADER, centralTenantId)],
      },
    }).get(`${path}?${stringify(searchParams)}`, { signal }).json(),
    {
      enabled: Boolean(path && centralTenantId),
      ...options,
    },
  );

  return {
    count: data?.totalRecords ?? 0,
    isFetching,
    isLoading,
  };
};
