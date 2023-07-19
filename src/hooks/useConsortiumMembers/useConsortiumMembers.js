import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import {
  LIMIT_MAX,
  LIMIT_PARAMETER,
} from '@folio/stripes-acq-components';

import {
  CONSORTIA_API,
  CONSORTIA_TENANTS_API,
} from '../../constants';

const DEFAULT_DATA = [];

export const useConsortiumMembers = (options = {}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'consortium-members' });

  const consortium = stripes.user?.user?.consortium;
  const searchParams = {
    [LIMIT_PARAMETER]: LIMIT_MAX,
  };

  const {
    isFetching,
    isLoading,
    data = {},
  } = useQuery(
    [namespace, consortium?.id],
    async () => {
      return ky.get(
        `${CONSORTIA_API}/${consortium.id}/${CONSORTIA_TENANTS_API}`,
        { searchParams },
      ).json();
    },
    {
      enabled: Boolean(consortium?.id),
      ...options,
    },
  );

  return {
    isFetching,
    isLoading,
    members: data.tenants || DEFAULT_DATA,
    totalRecords: data.totalRecords,
  };
};
