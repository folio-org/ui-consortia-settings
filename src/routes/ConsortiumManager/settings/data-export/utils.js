import camelCase from 'lodash/camelCase';
import { get } from 'lodash';

import { TextLink } from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

import { EXPORT_JOB_LOG_COLUMNS } from './constants';

import css from './DataExportLogs/DataExportLogs.css';

export const getStartedDateDateFormatter = format => {
  return record => {
    const { startedDate } = record;

    return format(
      startedDate,
      {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      },
    );
  };
};

export const downloadFileByLink = (fileName, downloadLink) => {
  if (!fileName || !downloadLink) return;

  const elem = window.document.createElement('a');

  elem.href = downloadLink;
  elem.download = fileName;
  elem.style.display = 'none';
  document.body.appendChild(elem);

  elem.click();

  document.body.removeChild(elem);
};

export const getFileLink = async (jobLog, ky) => {
  const response = await ky.get(`data-export/job-executions/${jobLog.id}/download/${jobLog.exportedFiles[0].fileId}`);

  if (!response.ok) {
    throw response;
  }

  const { link } = await response.json();

  return link;
};

const downloadExportFile = async (record, ky) => {
  try {
    const fileName = get(record.exportedFiles, '0.fileName');
    const downloadLink = await getFileLink(record, ky);

    downloadFileByLink(fileName, downloadLink);
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }
};

export const getFileNameField = (record, ky) => {
  const fileName = get(record.exportedFiles, '0.fileName');

  return (
    record.progress?.exported ? (
      <TextLink
        onClick={() => downloadExportFile(record, ky)}
        data-testid="text-link"
        className={css.pointer}
      >
        {fileName}
      </TextLink>
    ) : (
      <span>{fileName}</span>
    )
  );
};

export const getExportJobLogsListResultsFormatter = ({ intl, ky, formatTime }) => ({
  [EXPORT_JOB_LOG_COLUMNS.fileName]: record => getFileNameField(record, ky),
  [EXPORT_JOB_LOG_COLUMNS.status]: record => intl.formatMessage({ id: `ui-data-export.jobStatus.${camelCase(record.status)}` }),
  [EXPORT_JOB_LOG_COLUMNS.runBy]: record => getFullName({ personal: record.runBy }).trim(),
  [EXPORT_JOB_LOG_COLUMNS.totalRecords]: record => intl.formatNumber(record.progress?.total),
  [EXPORT_JOB_LOG_COLUMNS.errors]: record => {
    const failedSrs = record.progress?.duplicatedSrs;
    const failedOther = record.progress?.failed;

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
  [EXPORT_JOB_LOG_COLUMNS.startedDate]: getStartedDateDateFormatter(formatTime),
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
