import { useQuery } from 'react-query';

import { useStripes } from '@folio/stripes/core';

import { fetchConsortiumUserTenants } from '../../services';

const DEFAULT_DATA = [];

export const useUserAffiliations = ({ userId } = {}, options = {}) => {
  const stripes = useStripes();
  const consortium = stripes.user?.user?.consortium;

  const enabled = Boolean(
    consortium?.centralTenantId
    && userId,
  );

  const {
    isFetching,
    isLoading: isAffiliationsLoading,
    data: userTenants = DEFAULT_DATA,
    refetch,
  } = useQuery(
    ['consortium', 'self', userId],
    ({ signal }) => {
      return fetchConsortiumUserTenants(
        stripes,
        consortium?.centralTenantId,
        { id: consortium.id },
        { signal },
      );
    },
    {
      enabled,
      ...options,
    },
  );

  return ({
    affiliations: userTenants,
    totalRecords: userTenants.length,
    isFetching,
    isLoading: isAffiliationsLoading,
    refetch,
  });
};
