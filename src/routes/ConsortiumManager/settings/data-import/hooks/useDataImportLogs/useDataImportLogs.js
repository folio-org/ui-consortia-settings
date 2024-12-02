import queryString from 'query-string';
import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import {
  FILE_STATUSES,
  METADATA_PROVIDER_API,
} from '../../../../../../constants';
import { useTenantKy } from '../../../../../../hooks';
import {
  BULK_EDIT_JOB_PROFILE_NAME,
  COMPOSITE_PARENT,
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
    statusAny: [
      FILE_STATUSES.COMMITTED,
      FILE_STATUSES.ERROR,
      FILE_STATUSES.CANCELLED,
    ],
    subordinationTypeNotAny: COMPOSITE_PARENT,
    excludeJobProfileName: BULK_EDIT_JOB_PROFILE_NAME,
    ...getSortingParams({
      sortingField: sorting.sortingField || DEFAULT_SORTING.sortingField,
      sortingDirection: sorting.sortingDirection || DEFAULT_SORTING.sortingDirection,
    }, IMPORT_JOB_LOG_SORT_MAP),
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
