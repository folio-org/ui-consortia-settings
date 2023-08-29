import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { BL_USERS_API } from '../../constants';
import { usePublishCoordinator } from '../usePublishCoordinator';

const DEFAULT_DATA = {};

export const useCurrentUserTenantsPermissions = (params = {}, options = {}) => {
  const [namespace] = useNamespace('current-user-tenants-permissions');
  const { initPublicationRequest } = usePublishCoordinator();

  const {
    expandPermissions = false,
    tenants,
  } = params;

  const {
    isFetching,
    data = DEFAULT_DATA,
  } = useQuery(
    [namespace, expandPermissions, tenants],
    async () => {
      const searchParams = new URLSearchParams({
        expandPermissions,
      });

      const { publicationResults } = await initPublicationRequest({
        url: `${BL_USERS_API}/_self?${searchParams.toString()}`,
        method: 'GET',
        tenants,
      });

      return publicationResults.reduce((acc, { response, tenantId }) => {
        acc[tenantId] = response.permissions?.permissions || [];

        return acc;
      }, {});
    },
    {
      enabled: Boolean(tenants?.length),
      keepPreviousData: true,
      ...options,
    },
  );

  return ({
    tenantsPermissions: data,
    isFetching,
  });
};
