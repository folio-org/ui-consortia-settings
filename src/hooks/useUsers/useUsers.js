import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { USERS_LIMIT } from '../../constants';

export const useUsers = ({ tenant = '' }) => {
  const [namespaceKey] = useNamespace({ key: 'relatedUsers' });
  const ky = useOkapiKy({ tenant });

  const { data, isFetching } = useQuery(
    {
      queryKey: [namespaceKey, tenant],
      queryFn: () => ky.get('users',
        {
          searchParams: {
            limit: USERS_LIMIT,
          },
        }).json(),
    },
  );

  return {
    users: data?.users || [],
    isFetching,
  };
};
