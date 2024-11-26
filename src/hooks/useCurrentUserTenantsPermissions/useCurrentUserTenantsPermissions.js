import { useQuery } from 'react-query';

import { useNamespace, useStripes } from '@folio/stripes/core';

import { BL_USERS_API, USERS_KEYCLOAK_API } from '../../constants';
import { usePublishCoordinator } from '../usePublishCoordinator';

const DEFAULT_DATA = {};

export const useCurrentUserTenantsPermissions = (params = {}, options = {}) => {
  const [namespace] = useNamespace('current-user-tenants-permissions');
  const { initPublicationRequest } = usePublishCoordinator();

  const {
    expandPermissions = false,
    tenants,
  } = params;

  const stripes = useStripes();

  const {
    isFetching,
    data = DEFAULT_DATA,
  } = useQuery(
    [namespace, expandPermissions, tenants],
    async () => {
      const searchParams = new URLSearchParams({
        expandPermissions,
      });

      const apiURL = stripes.hasInterface('users-keycloak') ? USERS_KEYCLOAK_API : BL_USERS_API;

      const { publicationResults } = await initPublicationRequest({
        url: `${apiURL}/_self?${searchParams.toString()}`,
        method: 'GET',
        tenants,
      });

      return publicationResults.reduce((acc, { response, tenantId }) => {
        acc[tenantId] = response.permissions?.permissions || [];

        return acc;
      }, {});
    },
    {
      enabled: Boolean(tenants?.length) && !!stripes.user?.user?.consortium,
      keepPreviousData: true,
      ...options,
    },
  );

  return ({
    tenantsPermissions: data,
    isFetching,
  });
};
