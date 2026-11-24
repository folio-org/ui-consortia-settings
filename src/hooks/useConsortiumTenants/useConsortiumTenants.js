import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

const DEFAULT_DATA = [];
const TENANTS_LIMIT = 1000;

// Consortium-wide tenants (id, code, name, isCentral), not limited to the user's affiliations.
export const useConsortiumTenants = (options = {}) => {
  const [namespace] = useNamespace({ key: 'consortium-tenants' });
  const stripes = useStripes();
  const ky = useOkapiKy();

  const consortiumId = stripes.user?.user?.consortium?.id;

  const {
    isLoading,
    data: tenants = DEFAULT_DATA,
  } = useQuery(
    [namespace, consortiumId],
    async ({ signal }) => {
      const { tenants: result = DEFAULT_DATA } = await ky
        .get(`consortia/${consortiumId}/tenants`, {
          searchParams: { limit: TENANTS_LIMIT },
          signal,
        })
        .json();

      return result;
    },
    {
      enabled: Boolean(consortiumId),
      staleTime: Infinity,
      ...options,
    },
  );

  return {
    tenants,
    isLoading,
  };
};
