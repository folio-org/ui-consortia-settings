import { useQuery } from 'react-query';

import { fetchConsortiumMembers } from '../../services';

const DEFAULT_DATA = [];

export const useConsortiumMembers = ({ stripes }, options = {}) => {
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
