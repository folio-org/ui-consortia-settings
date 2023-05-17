import { useQuery } from 'react-query';

import { useStripes } from '@folio/stripes/core';

import { fetchConsortiumMembers } from '../../services';

const DEFAULT_DATA = [];

export const useConsortiumMembers = (options = {}) => {
  const stripes = useStripes();

  const {
    data = DEFAULT_DATA,
    isFetching,
    isLoading,
  } = useQuery(
    ['consortium-members'],
    () => fetchConsortiumMembers(stripes),
    {
      ...options,
    },
  );

  return ({
    isFetching,
    isLoading,
    tenants: data,
  });
};
