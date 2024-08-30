import { useQuery } from 'react-query';

import {useNamespace, useStripes} from '@folio/stripes/core';
import { buildSortingQuery } from '@folio/stripes-acq-components';

import {
  DATA_EXPORT_API,
  FILE_STATUSES,
} from '../../../../../../constants';
import { useTenantKy } from '../../../../../../hooks';
import {
  DEFAULT_PAGINATION,
  DEFAULT_SORTING,
  EXPORT_JOB_LOG_COLUMNS,
} from '../../constants';
import { getExportJobLogsSortMap } from '../../utils';

const DEFAULT_DATA = [];
const JOB_LOGS_QUERY_VALUE = [
  FILE_STATUSES.COMPLETED,
  FILE_STATUSES.COMPLETED_WITH_ERRORS,
  FILE_STATUSES.FAIL,
].join(' or ');

export const useDataExportLogs = (params = {}, options = {}) => {
  const {
    pagination = DEFAULT_PAGINATION,
    sorting = DEFAULT_SORTING,
    tenantId,
  } = params;

  const [namespace] = useNamespace({ key: 'data-export-logs' });
  const ky = useTenantKy({ tenantId });
  const stripes = useStripes();
  const settingsPerms  = stripes.hasPerm('ui-data-export.settings.view') && !stripes.hasPerm('ui-data-export.view');

  const sortingQuery = buildSortingQuery({
    sorting: sorting.sortingField || DEFAULT_SORTING.sortingField,
    sortingDirection: sorting.sortingDirection || DEFAULT_SORTING.sortingDirection,
  }, getExportJobLogsSortMap(sorting));

  const searchParams = {
    limit: pagination.limit || DEFAULT_PAGINATION.limit,
    offset: pagination.offset || DEFAULT_PAGINATION.offset,
    query: [
      `status=(${JOB_LOGS_QUERY_VALUE})`,
      sortingQuery,
      sorting.sortingField !== EXPORT_JOB_LOG_COLUMNS.totalRecords ? 'total/number' : '',
    ].filter(Boolean).join(' '),
  };

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
    ({ signal }) => {
      if (settingsPerms) {
        options.onError();
      }

      return ky.get(`${DATA_EXPORT_API}/job-executions`, { searchParams, signal }).json();
    },
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
