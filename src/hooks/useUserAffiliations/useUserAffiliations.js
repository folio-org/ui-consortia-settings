import orderBy from 'lodash/orderBy';
import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

const DEFAULT_DATA = [];

export const useUserAffiliations = ({ userId } = {}, options = {}) => {
  const ky = useOkapiKy();
  const { consortium } = useStripes();

  const api = ky.extend({
    hooks: {
      beforeRequest: [(req) => req.headers.set('X-Okapi-Tenant', consortium.centralTenant)],
    },
  });

  const searchParams = {
    userId,
    limit: LIMIT_MAX,
  };

  const {
    isFetching,
    isLoading,
    data = {},
    refetch,
  } = useQuery(
    [userId, consortium?.id],
    async () => {
      const { userTenants, totalRecords } = await api.get(
        `consortia/${consortium.id}/user-tenants`,
        { searchParams },
      ).json();

      return {
        userTenants: orderBy(userTenants, 'tenantName'),
        totalRecords,
      };
    },
    {
      enabled: Boolean(consortium?.id && userId),
      ...options,
    },
  );

  return ({
    affiliations: data.userTenants || DEFAULT_DATA,
    totalRecords: data.totalRecords,
    isFetching,
    isLoading,
    refetch,
  });
};

export default useUserAffiliations;
