import {
  DESC_DIRECTION,
  LIMIT_PARAMETER,
  OFFSET_PARAMETER,
} from '@folio/stripes-acq-components';
import {
  DEFAULT_JOB_LOGS_COLUMNS,
  DEFAULT_JOB_LOGS_COLUMN_WIDTHS,
} from '@folio/stripes-data-transfer-components';

export const IMPORT_JOB_LOG_COLUMNS = {
  ...DEFAULT_JOB_LOGS_COLUMNS.reduce((acc, curr) => ({ ...acc, [curr]: curr }), {}),
  status: 'status',
  startedDate: 'startedDate',
};

export const IMPORT_JOB_LOG_VISIBLE_COLUMNS = [
  IMPORT_JOB_LOG_COLUMNS.fileName,
  IMPORT_JOB_LOG_COLUMNS.status,
  IMPORT_JOB_LOG_COLUMNS.totalRecords,
  IMPORT_JOB_LOG_COLUMNS.jobProfileName,
  IMPORT_JOB_LOG_COLUMNS.startedDate,
  IMPORT_JOB_LOG_COLUMNS.completedDate,
  IMPORT_JOB_LOG_COLUMNS.runBy,
  IMPORT_JOB_LOG_COLUMNS.hrId,
];

export const IMPORT_JOB_LOG_COLUMNS_WIDTHS = {
  ...DEFAULT_JOB_LOGS_COLUMN_WIDTHS,
  [IMPORT_JOB_LOG_COLUMNS.totalRecords]: '80px',
};

export const IMPORT_JOB_LOG_SORTABLE_COLUMNS = [
  ...IMPORT_JOB_LOG_VISIBLE_COLUMNS,
];

export const IMPORT_JOB_LOG_SORT_MAP = {
  [IMPORT_JOB_LOG_COLUMNS.fileName]: 'file_name',
  [IMPORT_JOB_LOG_COLUMNS.status]: 'status',
  [IMPORT_JOB_LOG_COLUMNS.totalRecords]: 'progress_total',
  [IMPORT_JOB_LOG_COLUMNS.jobProfileName]: 'job_profile_name',
  [IMPORT_JOB_LOG_COLUMNS.startedDate]: 'started_date',
  [IMPORT_JOB_LOG_COLUMNS.completedDate]: 'completed_date',
  [IMPORT_JOB_LOG_COLUMNS.runBy]: 'job_user_first_name job_user_last_name',
  [IMPORT_JOB_LOG_COLUMNS.hrId]: 'hrid',
};

export const DEFAULT_PAGINATION = {
  [LIMIT_PARAMETER]: 100,
  [OFFSET_PARAMETER]: 0,
};

export const DEFAULT_SORTING = {
  sortingField: IMPORT_JOB_LOG_COLUMNS.completedDate,
  sortingDirection: DESC_DIRECTION,
};

export const COMPOSITE_PARENT = 'COMPOSITE_PARENT';
export const BULK_EDIT_JOB_PROFILE_NAME = 'Bulk operations data import job profile-*';
