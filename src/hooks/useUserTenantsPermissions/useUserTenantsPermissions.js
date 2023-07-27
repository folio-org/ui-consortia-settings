import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { usePublishCoordinator } from '../usePublishCoordinator';
import { PERMISSIONS_USERS_API } from '../../constants';

const DEFAULT_DATA = {};

export const useUserTenantsPermissions = (params = {}, options = {}) => {
  const [namespace] = useNamespace('user-tenants-permissions');
  const { initPublicationRequest } = usePublishCoordinator();

  const {
    userId,
    expanded = true,
    full = false,
    indexField = 'userId',
    tenants = [],
  } = params;

  const {
    isFetching,
    data = DEFAULT_DATA,
  } = useQuery(
    [namespace, userId, expanded, full, indexField, tenants],
    async () => {
      const searchParams = new URLSearchParams({
        expanded,
        full,
        indexField,
      });

      const { publicationResults } = await initPublicationRequest({
        url: `${PERMISSIONS_USERS_API}/${userId}/permissions?${searchParams.toString()}`,
        method: 'GET',
        tenants,
      });

      return publicationResults.reduce((acc, { response, tenantId }) => {
        acc[tenantId] = response.permissionNames;

        return acc;
      }, {});
    },
    {
      enabled: Boolean(tenants?.length && userId),
      keepPreviousData: true,
      ...options,
    },
  );

  return ({
    permissionNames: data,
    isFetching,
  });
};
