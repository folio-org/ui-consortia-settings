import camelCase from 'lodash/camelCase';

import { getFullName } from '@folio/stripes/util';

import { EXPORT_JOB_LOG_COLUMNS } from './constants';

export const getExportJobLogsListResultsFormatter = ({ intl }) => ({
  [EXPORT_JOB_LOG_COLUMNS.fileName]: record => record.exportedFiles?.[0]?.fileName,
  [EXPORT_JOB_LOG_COLUMNS.status]: record => intl.formatMessage({ id: `ui-data-export.jobStatus.${camelCase(record.status)}` }),
  [EXPORT_JOB_LOG_COLUMNS.runBy]: record => getFullName({ personal: record.runBy }).trim(),
  [EXPORT_JOB_LOG_COLUMNS.totalRecords]: record => intl.formatNumber(record.progress?.total),
  [EXPORT_JOB_LOG_COLUMNS.errors]: record => {
    const failedSrs = record.progress?.failed?.duplicatedSrs;
    const failedOther = record.progress?.failed?.otherFailed;

    switch (true) {
      case failedSrs === 0 && failedOther > 0:
        return intl.formatNumber(failedOther);
      case failedSrs > 0 && failedOther > 0:
        return intl.formatMessage({
          id: 'ui-consortia-settings.duplicatesWithOthers',
        }, {
          failedOther: intl.formatNumber(failedOther),
          failedSrs: intl.formatNumber(failedSrs),
        });
      case failedSrs > 0 && failedOther === 0:
        return intl.formatMessage({
          id: 'ui-consortia-settings.duplicates',
        }, {
          failedSrs: intl.formatNumber(failedSrs),
        });
      default:
        return '';
    }
  },
  [EXPORT_JOB_LOG_COLUMNS.exported]: record => intl.formatNumber(record.progress?.exported) || '',
});

export const getExportJobLogsSortMap = ({ sortingDirection }) => ({
  [EXPORT_JOB_LOG_COLUMNS.status]: 'status',
  [EXPORT_JOB_LOG_COLUMNS.totalRecords]: 'total/number',
  [EXPORT_JOB_LOG_COLUMNS.exported]: 'exported/number',
  [EXPORT_JOB_LOG_COLUMNS.errors]: 'failed/number',
  [EXPORT_JOB_LOG_COLUMNS.jobProfileName]: 'jobProfileName',
  [EXPORT_JOB_LOG_COLUMNS.completedDate]: 'completedDate',
  [EXPORT_JOB_LOG_COLUMNS.runBy]: `runByFirstName/sort.${sortingDirection} runByLastName`,
  [EXPORT_JOB_LOG_COLUMNS.hrId]: 'hrid/number',
});
