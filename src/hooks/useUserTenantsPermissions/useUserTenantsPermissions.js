import { useQuery } from 'react-query';

import { usePublishCoordinator } from '../usePublishCoordinator';
import { PERMISSIONS_USERS_API } from '../../constants';

const DEFAULT_DATA = {};

export const useUserTenantsPermissions = ({ tenants = [], userId }, options = {}) => {
  const { initPublicationRequest } = usePublishCoordinator();

  const {
    isFetching,
    data = DEFAULT_DATA,
  } = useQuery(
    [userId, tenants],
    async () => {
      const searchParams = new URLSearchParams({
        full: true,
        indexField: 'userId',
      });

      const res = await initPublicationRequest({
        url: `${PERMISSIONS_USERS_API}/${userId}/permissions?${searchParams.toString()}`,
        method: 'GET',
        tenants,
      });

      return res;
    },
    {
      enabled: Boolean(tenants?.length && userId),
      keepPreviousData: true,
      ...options,
    },
  );

  return ({
    perms: data,
    totalRecords: data?.length,
    isFetching,
  });
};
