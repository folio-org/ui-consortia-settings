import identity from 'lodash/identity';
import mapValues from 'lodash/mapValues';
import { FormattedMessage } from 'react-intl';

import { DESC_DIRECTION } from '@folio/stripes-acq-components';
import {
  DEFAULT_JOB_LOGS_COLUMN_MAPPING,
  listTemplate,
} from '@folio/stripes-data-transfer-components';

import { FILE_STATUSES } from '../../../../constants';
import { IMPORT_JOB_LOG_COLUMNS } from './constants';

/**
 * @callback formatMessage
 */
/**
 * Returns a function that returns formatted message for the "Status" cell of a given record.
 * E.g. for record={status: 'COMMITTED', progress: {current: 1}}, returns "Completed".
 * @param {formatMessage} formatter - The callback that formats status message
 */
export function statusCellFormatter(formatter) {
  return record => {
    const {
      status,
      progress,
    } = record;

    if (status === FILE_STATUSES.ERROR) {
      if (progress && progress.current > 0) {
        return formatter({ id: 'ui-data-import.completedWithErrors' });
      }

      return formatter({ id: 'ui-data-import.failed' });
    }

    if (status === FILE_STATUSES.CANCELLED) {
      return formatter({ id: 'ui-data-import.stoppedByUser' });
    }

    return formatter({ id: 'ui-data-import.completed' });
  };
}

export const getImportJobLogsListColumnMapping = ({ intl }) => {
  return {
    ...mapValues(DEFAULT_JOB_LOGS_COLUMN_MAPPING, labelId => intl.formatMessage({ id: labelId })),
    [IMPORT_JOB_LOG_COLUMNS.status]: <FormattedMessage id="ui-data-import.status" />,
    [IMPORT_JOB_LOG_COLUMNS.startedDate]: <FormattedMessage id="ui-data-import.jobStartedDate" />,
  };
};

export const getImportJobLogsListResultsFormatter = ({ intl }) => {
  return {
    ...listTemplate({ entityKey: 'jobLogs', formatNumber: identity }),
    [IMPORT_JOB_LOG_COLUMNS.status]: statusCellFormatter(intl.formatMessage),
  };
};

export const getSortingParams = ({ sortingField, sortingDirection }, sortMap) => {
  if (!sortingField) return {};

  return {
    sortBy: (sortMap[sortingField] || sortingField).split(' ').map(v => `${v},${sortingDirection === DESC_DIRECTION ? 'desc' : 'asc'}`),
  };
};
