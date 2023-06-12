import { isNil, noop } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  AppIcon,
} from '@folio/stripes/core';
import {
  Loading,
  MultiColumnList,
  Pane,
  Selection,
} from '@folio/stripes/components';
import {
  PrevNextPagination,
  useShowCallout,
  useSorting,
} from '@folio/stripes-acq-components';

import { useConsortiumManagerContext } from '../../../../../contexts';
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

  const { selectedMembers } = useConsortiumManagerContext();
  const [activeMember, setActiveMember] = useState(selectedMembers[0]?.id);

  const [pagination, changePage] = useState(DEFAULT_PAGINATION);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useSorting(noop, IMPORT_JOB_LOG_SORTABLE_COLUMNS);

  useEffect(() => {
    if (!selectedMembers.find(({ id }) => id === activeMember)) {
      setActiveMember(selectedMembers[0]?.id);
    }
  }, [activeMember, selectedMembers]);

  useEffect(() => {
    changePage(DEFAULT_PAGINATION);
  }, [activeMember, sortingField, sortingDirection]);

  const dataOptions = useMemo(() => {
    return selectedMembers.map(({ id, name }) => {
      return {
        value: id,
        label: name,
      };
    });
  }, [selectedMembers]);

  const handleLogsLoadingError = useCallback(({ response }) => {
    const defaultMessage = intl.formatMessage({ id: 'ui-consortia-settings.errors.jobs.load.common' });

    if (response?.status === 403) {
      return showCallout({
        message: `${defaultMessage} ${intl.formatMessage({ id: 'ui-consortia-settings.errors.permissionsRequired' })}`,
        type: 'error',
      });
    }

    return showCallout({
      message: defaultMessage,
      type: 'error',
    });
  }, [intl, showCallout]);

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
      onError: handleLogsLoadingError,
    },
  );

  const columnMapping = useMemo(() => getImportJobLogsListColumnMapping({ intl }), [intl]);
  const resultFormatter = useMemo(() => getImportJobLogsListResultsFormatter({ intl }), [intl]);

  return (
    <Pane
      appIcon={<AppIcon app="data-import" />}
      defaultWidth="fill"
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
          dataOptions={dataOptions}
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
