import isNil from 'lodash/isNil';
import noop from 'lodash/noop';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { useQueryClient } from 'react-query';

import {
  AppIcon,
  useNamespace,
} from '@folio/stripes/core';
import {
  Loading,
  MultiColumnList,
  Pane,
  PaneBackLink,
  Selection,
  useTimeFormatter,
} from '@folio/stripes/components';
import {
  PrevNextPagination,
  useShowCallout,
  useSorting,
} from '@folio/stripes-acq-components';
import {
  useJobLogsListFormatter,
  useJobLogsProperties,
} from '@folio/stripes-data-transfer-components';

import { MODULE_ROOT_ROUTE } from '../../../../../constants';
import { useTenantKy } from '../../../../../hooks';
import { useMemberSelection } from '../../../hooks';
import {
  DEFAULT_PAGINATION,
  DEFAULT_SORTING,
  EXPORT_JOB_LOG_COLUMNS_WIDTHS,
  EXPORT_JOB_LOG_COLUMN_MAPPING,
  EXPORT_JOB_LOG_NON_INTERACTIVE_HEADERS,
  EXPORT_JOB_LOG_SORTABLE_COLUMNS,
  EXPORT_JOB_LOG_VISIBLE_COLUMNS,
} from '../constants';
import { useDataExportLogs } from '../hooks';
import { getExportJobLogsListResultsFormatter } from '../utils';
import { DATA_EXPORT_LOGS_QUERY_KEY } from '../hooks/useDataExportLogs/useDataExportLogs';

import css from './DataExportLogs.css';

export const DataExportLogs = () => {
  const queryClient = useQueryClient();
  const formatTime = useTimeFormatter();
  const intl = useIntl();
  const showCallout = useShowCallout();
  const [dataExportLogsKey] = useNamespace({ key: DATA_EXPORT_LOGS_QUERY_KEY });

  const {
    activeMember,
    membersOptions,
    setActiveMember,
  } = useMemberSelection();
  const ky = useTenantKy({ tenantId: activeMember });

  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useSorting(noop, EXPORT_JOB_LOG_SORTABLE_COLUMNS);
  const [pagination, changePage] = useState(DEFAULT_PAGINATION);

  const handleLogsLoadingError = ((error) => {
    const response = error.response;
    const defaultMessage = intl.formatMessage({ id: 'ui-consortia-settings.errors.jobs.load.common' });
    const permissionMessage = intl.formatMessage({ id: 'ui-consortia-settings.errors.permissionsRequired' });

    if (response?.status === 403) {
      showCallout({
        message: `${defaultMessage} ${permissionMessage}`,
        type: 'error',
      });

      // Reset the query data to an empty if the user doesn't have permissions to view the logs
      queryClient.setQueryData([dataExportLogsKey], []);
    } else {
      showCallout({
        message: defaultMessage,
        type: 'error',
      });
    }
  });

  const {
    isFetching,
    isLoading,
    jobExecutions,
    totalRecords,
  } = useDataExportLogs(
    {
      pagination,
      sorting: { sortingField, sortingDirection },
      tenantId: activeMember,
    },
    {
      onError: handleLogsLoadingError,
    },
  );

  useEffect(() => {
    changePage(DEFAULT_PAGINATION);
  }, [activeMember, sortingField, sortingDirection]);

  const jobLogsProperties = useJobLogsProperties({
    visibleColumns: EXPORT_JOB_LOG_VISIBLE_COLUMNS,
    columnWidths: EXPORT_JOB_LOG_COLUMNS_WIDTHS,
    columnMapping: EXPORT_JOB_LOG_COLUMN_MAPPING,
  });
  const formatter = useJobLogsListFormatter(getExportJobLogsListResultsFormatter({ intl, ky, formatTime }));
  const listProps = useMemo(() => ({
    ...jobLogsProperties,
    formatter,
  }), [formatter, jobLogsProperties]);

  const paneSub = !isNil(totalRecords) && intl.formatMessage(
    { id: 'ui-data-export.searchResultsCountHeader' },
    { count: totalRecords },
  );

  return (
    <Pane
      appIcon={<AppIcon app="data-export" />}
      defaultWidth="fill"
      firstMenu={<PaneBackLink to={MODULE_ROOT_ROUTE} />}
      paneTitle={<FormattedMessage id="ui-data-export.meta.title" />}
      paneSub={paneSub}
      noOverflow
    >
      <div className={css.paneContent}>
        <Selection
          autoFocus
          dataOptions={membersOptions}
          disabled={isFetching}
          id="consortium-member-select"
          label={<FormattedMessage id="ui-consortia-settings.consortiumManager.members.selection.label" />}
          onChange={setActiveMember}
          value={activeMember}
        />

        {isLoading ? <Loading /> : (
          <>
            <div className={css.logsList}>
              <MultiColumnList
                autosize
                contentData={jobExecutions}
                loading={isFetching}
                nonInteractiveHeaders={EXPORT_JOB_LOG_NON_INTERACTIVE_HEADERS}
                onHeaderClick={changeSorting}
                sortedColumn={sortingField || DEFAULT_SORTING.sortingField}
                sortDirection={sortingDirection || DEFAULT_SORTING.sortingDirection}
                {...listProps}
              />
            </div>

            {jobExecutions.length > 0 && (
              <PrevNextPagination
                {...pagination}
                totalCount={totalRecords}
                disabled={isFetching}
                onChange={changePage}
              />
            )}
          </>
        )}
      </div>
    </Pane>
  );
};
