import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

export const useUsers = ({tenant = ''}) => {
  const [namespaceKey] = useNamespace({ key: 'relatedUsers' });
  const ky = useOkapiKy({ tenant });
  const [users, setUsers] = useState([]);

  const { data, isFetching, isSuccess } = useQuery({
      queryKey: [namespaceKey, tenant],
      queryFn: () => ky.get('users').json(),
    });

  useEffect(() => {
    if (isSuccess && data?.users) {
      setUsers(data.users);
    }
  }, [data, isSuccess]);

  return {
    users,
    isFetching,
  };
};
