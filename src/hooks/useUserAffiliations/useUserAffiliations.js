import orderBy from 'lodash/orderBy';
import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  CONSORTIA_API,
  CONSORTIA_USER_TENANTS_API,
  OKAPI_TENANT_HEADER,
} from '../../constants';

const DEFAULT_DATA = [];

export const useUserAffiliations = ({ userId } = {}, options = {}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const consortium = stripes.user?.user?.consortium;

  const api = ky.extend({
    hooks: {
      beforeRequest: [(req) => req.headers.set(OKAPI_TENANT_HEADER, consortium?.centralTenantId)],
    },
  });

  const searchParams = {
    userId,
    limit: LIMIT_MAX,
  };

  const enabled = Boolean(
    consortium?.centralTenantId
    && userId,
  );

  const {
    isFetching,
    isLoading: isAffiliationsLoading,
    data = {},
    refetch,
  } = useQuery(
    ['user-tenants', userId, consortium?.id],
    async () => {
      const { userTenants, totalRecords } = await api.get(
        `${CONSORTIA_API}/${consortium.id}/${CONSORTIA_USER_TENANTS_API}`,
        { searchParams },
      ).json();

      return {
        userTenants: orderBy(userTenants, 'tenantName'),
        totalRecords,
      };
    },
    {
      enabled,
      ...options,
    },
  );

  return ({
    affiliations: data.userTenants || DEFAULT_DATA,
    totalRecords: data.totalRecords,
    isFetching,
    isLoading: isAffiliationsLoading,
    refetch,
  });
};
