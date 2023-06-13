import difference from 'lodash/difference';

import {
  DESC_DIRECTION,
  LIMIT_PARAMETER,
  OFFSET_PARAMETER,
} from '@folio/stripes-acq-components';
import {
  DEFAULT_JOB_LOGS_COLUMNS,
  DEFAULT_JOB_LOGS_COLUMN_WIDTHS,
} from '@folio/stripes-data-transfer-components';

export const EXPORT_JOB_LOG_COLUMNS = {
  ...DEFAULT_JOB_LOGS_COLUMNS.reduce((acc, curr) => ({ ...acc, [curr]: curr }), {}),
  errors: 'errors',
  exported: 'exported',
  status: 'status',
};

export const EXPORT_JOB_LOG_VISIBLE_COLUMNS = [
  EXPORT_JOB_LOG_COLUMNS.fileName,
  EXPORT_JOB_LOG_COLUMNS.status,
  EXPORT_JOB_LOG_COLUMNS.totalRecords,
  EXPORT_JOB_LOG_COLUMNS.exported,
  EXPORT_JOB_LOG_COLUMNS.errors,
  EXPORT_JOB_LOG_COLUMNS.jobProfileName,
  EXPORT_JOB_LOG_COLUMNS.completedDate,
  EXPORT_JOB_LOG_COLUMNS.runBy,
  EXPORT_JOB_LOG_COLUMNS.hrId,
];

export const EXPORT_JOB_LOG_COLUMN_MAPPING = {
  [EXPORT_JOB_LOG_COLUMNS.status]: 'ui-data-export.status',
  [EXPORT_JOB_LOG_COLUMNS.totalRecords]: 'ui-data-export.total',
  [EXPORT_JOB_LOG_COLUMNS.errors]: 'ui-data-export.failed',
  [EXPORT_JOB_LOG_COLUMNS.exported]: 'ui-data-export.exported',
};

export const EXPORT_JOB_LOG_COLUMNS_WIDTHS = {
  ...DEFAULT_JOB_LOGS_COLUMN_WIDTHS,
  [EXPORT_JOB_LOG_COLUMNS.totalRecords]: '80px',
};

export const EXPORT_JOB_LOG_NON_INTERACTIVE_HEADERS = [
  EXPORT_JOB_LOG_COLUMNS.fileName,
];

export const EXPORT_JOB_LOG_SORTABLE_COLUMNS = difference(
  EXPORT_JOB_LOG_VISIBLE_COLUMNS,
  EXPORT_JOB_LOG_NON_INTERACTIVE_HEADERS,
);

export const DEFAULT_PAGINATION = {
  [LIMIT_PARAMETER]: 100,
  [OFFSET_PARAMETER]: 0,
};

export const DEFAULT_SORTING = {
  sortingField: EXPORT_JOB_LOG_COLUMNS.completedDate,
  sortingDirection: DESC_DIRECTION,
};
