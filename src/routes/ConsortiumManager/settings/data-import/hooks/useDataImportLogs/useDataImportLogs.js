import queryString from 'query-string';
import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { METADATA_PROVIDER_API } from '../../../../../../constants';
import { useTenantKy } from '../../../../../../hooks';
import {
  DEFAULT_PAGINATION,
  DEFAULT_SORTING,
  IMPORT_JOB_LOG_SORT_MAP,
} from '../../constants';
import { getSortingParams } from '../../utils';

const DEFAULT_DATA = [];

export const useDataImportLogs = (params = {}, options = {}) => {
  const {
    pagination = DEFAULT_PAGINATION,
    sorting = DEFAULT_SORTING,
    tenantId,
  } = params;

  const [namespace] = useNamespace({ key: 'data-import-logs' });
  const ky = useTenantKy({ tenantId });

  const searchParams = queryString.stringify({
    limit: pagination.limit || DEFAULT_PAGINATION.limit,
    offset: pagination.offset || DEFAULT_PAGINATION.offset,
    ...getSortingParams(sorting, IMPORT_JOB_LOG_SORT_MAP),
  });

  const {
    isFetching,
    isLoading,
    data,
  } = useQuery(
    [
      namespace,
      tenantId,
      pagination.limit,
      pagination.offset,
      sorting.sortingField,
      sorting.sortingDirection,
    ],
    ({ signal }) => ky.get(`${METADATA_PROVIDER_API}/jobExecutions`, { searchParams, signal }).json(),
    {
      enabled: Boolean(tenantId),
      keepPreviousData: true,
      ...options,
    },
  );

  return ({
    jobExecutions: data?.jobExecutions || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  });
};
