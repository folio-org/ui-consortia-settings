import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { USERS_LIMIT } from '../../constants';

export const useUsers = ({ tenant = '' }, options = {}) => {
  const [namespaceKey] = useNamespace({ key: 'relatedUsers' });
  const ky = useOkapiKy({ tenant });

  const { data, isFetching } = useQuery(
    {
      queryKey: [namespaceKey, tenant],
      queryFn: ({ signal }) => ky.get('users',
        {
          searchParams: {
            limit: USERS_LIMIT,
          },
          signal,
        }).json(),
      ...options,
    },
  );

  return {
    users: data?.users || [],
    isFetching,
  };
};
