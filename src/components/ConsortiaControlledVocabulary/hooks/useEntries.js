import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  LIMIT_PARAMETER,
  OFFSET_PARAMETER,
  SEARCH_PARAMETER,
} from '@folio/stripes-acq-components';

import { CONTROLLED_VOCAB_LIMIT } from '../../../constants';
import { throwErrorResponse } from '../../../utils';

const DEFAULT_DATA = [];

export const useEntries = (params = {}, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const {
    path,
    records,
    sortby,
  } = params;

  const queryKey = [namespace, path, records];
  const searchParams = {
    [SEARCH_PARAMETER]: `cql.allRecords=1 sortby ${sortby || 'name'}`,
    [LIMIT_PARAMETER]: CONTROLLED_VOCAB_LIMIT,
    [OFFSET_PARAMETER]: 0,
  };

  const {
    data = {},
    isFetching,
    refetch,
  } = useQuery(
    queryKey,
    async () => ky.get(path, { searchParams }).json().catch(throwErrorResponse),
    {
      enabled: Boolean(path && records),
      keepPreviousData: true,
      ...options,
    },
  );

  return {
    isFetching,
    entries: data[records] || DEFAULT_DATA,
    refetch,
    totalRecords: data.totalRecords,
  };
};
