import { useQuery } from 'react-query';

import {
  useNamespace,
  useStripes,
} from '@folio/stripes/core';

import { useTenantKy } from '../useTenantKy';

const MAX_RECORDS = 10_000;

export const useConsortiumPermissions = () => {
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'consortium-permissions' });

  const user = stripes?.user?.user;
  const consortium = user?.consortium;

  const enabled = Boolean(user?.id && consortium?.id);

  const ky = useTenantKy({ tenantId: consortium?.centralTenantId });

  const {
    isLoading,
    data = {},
  } = useQuery(
    [namespace, user?.id],
    async () => {
      try {
        const { id } = await ky.get(
          `perms/users/${user.id}`,
          { searchParams: { indexField: 'userId' } },
        ).json();
        const { permissions } = await ky.get(
          'perms/permissions',
          { searchParams: { limit: MAX_RECORDS, query: `(grantedTo=${id})`, expanded: true } },
        ).json();

        return permissions
          .map(({ subPermissions = [] }) => subPermissions)
          .flat()
          .filter(permission => permission.includes('consortia'))
          .reduce((acc, permission) => {
            acc[permission] = true;

            return acc;
          }, {});
      } catch {
        return {};
      }
    },
    {
      enabled,
      staleTime: 10 * (60 * 1000),
      cacheTime: 15 * (60 * 1000),
    },
  );

  return { isLoading, permissions: data };
};
