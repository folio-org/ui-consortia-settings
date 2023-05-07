import orderBy from 'lodash/orderBy';
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import {
  CONSORTIA_API,
  CONSORTIA_USER_TENANTS_API,
  OKAPI_TENANT_HEADER,
} from '../../constants';
import { useCurrentConsortium } from '../useCurrentConsortium';

const DEFAULT_DATA = [];

export const useUserAffiliations = ({ userId } = {}, options = {}) => {
  const ky = useOkapiKy();

  const {
    consortium,
    isLoading: isConsortiumLoading,
  } = useCurrentConsortium();

  const api = ky.extend({
    hooks: {
      beforeRequest: [
        request => {
          request.headers.set(OKAPI_TENANT_HEADER, consortium.centralTenant);
        },
      ],
    },
  });

  const searchParams = {
    userId,
    limit: LIMIT_MAX,
  };

  const enabled = Boolean(
    consortium?.centralTenant
    && consortium?.id
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

  const isLoading = isAffiliationsLoading || isConsortiumLoading;

  return ({
    affiliations: data.userTenants || DEFAULT_DATA,
    totalRecords: data.totalRecords,
    isFetching,
    isLoading,
    refetch,
  });
};
