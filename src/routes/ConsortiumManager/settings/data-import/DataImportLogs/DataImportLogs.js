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

import { AppIcon } from '@folio/stripes/core';
import {
  Loading,
  MultiColumnList,
  Pane,
  PaneBackLink,
  Selection,
} from '@folio/stripes/components';
import {
  PrevNextPagination,
  useShowCallout,
  useSorting,
} from '@folio/stripes-acq-components';

import { MODULE_ROOT_ROUTE } from '../../../../../constants';
import { handleErrorMessages } from '../../../../../utils';
import { useMemberSelection } from '../../../hooks';
import {
  DEFAULT_PAGINATION,
  DEFAULT_SORTING,
  IMPORT_JOB_LOG_COLUMNS_WIDTHS,
  IMPORT_JOB_LOG_SORTABLE_COLUMNS,
  IMPORT_JOB_LOG_VISIBLE_COLUMNS,
} from '../constants';
import { useDataImportLogs } from '../hooks';
import {
  getImportJobLogsListColumnMapping,
  getImportJobLogsListResultsFormatter,
} from '../utils';

import css from './DataImportLogs.css';

export const DataImportLogs = () => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const {
    activeMember,
    membersOptions,
    setActiveMember,
  } = useMemberSelection();

  const [pagination, changePage] = useState(DEFAULT_PAGINATION);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useSorting(noop, IMPORT_JOB_LOG_SORTABLE_COLUMNS);

  useEffect(() => {
    changePage(DEFAULT_PAGINATION);
  }, [activeMember, sortingField, sortingDirection]);

  const {
    isFetching,
    isLoading,
    jobExecutions,
    totalRecords,
  } = useDataImportLogs(
    {
      pagination,
      sorting: { sortingField, sortingDirection },
      tenantId: activeMember,
    },
    {
      onError: ({ response }) => handleErrorMessages({ intl, response, showCallout }),
    },
  );

  const columnMapping = useMemo(() => getImportJobLogsListColumnMapping({ intl }), [intl]);
  const resultFormatter = useMemo(() => getImportJobLogsListResultsFormatter({ intl }), [intl]);

  return (
    <Pane
      appIcon={<AppIcon app="data-import" />}
      defaultWidth="fill"
      firstMenu={<PaneBackLink to={MODULE_ROOT_ROUTE} />}
      paneTitle={<FormattedMessage id="ui-data-import.meta.title" />}
      paneSub={!isNil(totalRecords) && intl.formatMessage(
        { id: 'ui-data-import.logsPaneSubtitle' },
        { count: totalRecords },
      )}
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
                columnMapping={columnMapping}
                columnWidths={IMPORT_JOB_LOG_COLUMNS_WIDTHS}
                formatter={resultFormatter}
                loading={isFetching}
                onHeaderClick={changeSorting}
                sortedColumn={sortingField || DEFAULT_SORTING.sortingField}
                sortDirection={sortingDirection || DEFAULT_SORTING.sortingDirection}
                visibleColumns={IMPORT_JOB_LOG_VISIBLE_COLUMNS}
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
