import camelCase from 'lodash/camelCase';

import { getFullName } from '@folio/stripes/util';

import { EXPORT_JOB_LOG_COLUMNS } from './constants';

export const getExportJobLogsListResultsFormatter = ({ intl }) => ({
  [EXPORT_JOB_LOG_COLUMNS.fileName]: record => record.exportedFiles?.[0]?.fileName,
  [EXPORT_JOB_LOG_COLUMNS.status]: record => intl.formatMessage({ id: `ui-data-export.jobStatus.${camelCase(record.status)}` }),
  [EXPORT_JOB_LOG_COLUMNS.runBy]: record => getFullName({ personal: record.runBy }).trim(),
  [EXPORT_JOB_LOG_COLUMNS.totalRecords]: record => record.progress?.total,
  [EXPORT_JOB_LOG_COLUMNS.errors]: record => record.progress?.failed || '',
  [EXPORT_JOB_LOG_COLUMNS.exported]: record => record.progress?.exported || '',
});

export const getExportJobLogsSortMap = ({ sortingDirection }) => ({
  [EXPORT_JOB_LOG_COLUMNS.status]: 'status',
  [EXPORT_JOB_LOG_COLUMNS.totalRecords]: 'progress.total/number',
  [EXPORT_JOB_LOG_COLUMNS.exported]: 'progress.exported/number',
  [EXPORT_JOB_LOG_COLUMNS.errors]: 'progress.failed/number',
  [EXPORT_JOB_LOG_COLUMNS.jobProfileName]: 'jobProfileName',
  [EXPORT_JOB_LOG_COLUMNS.completedDate]: 'completedDate',
  [EXPORT_JOB_LOG_COLUMNS.runBy]: `runBy.firstName/sort.${sortingDirection} runBy.lastName`,
  [EXPORT_JOB_LOG_COLUMNS.hrId]: 'hrId/number',
});
