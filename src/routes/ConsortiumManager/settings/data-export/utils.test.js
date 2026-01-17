import { render } from '@folio/jest-config-stripes/testing-library/react';

import { EXPORT_JOB_LOG_COLUMNS } from './constants';
import {
  downloadFileByLink,
  getExportJobLogsListResultsFormatter,
  getFileLink,
  getFileNameField,
  getFormattedJobProfileName,
  getStartedDateDateFormatter,
} from './utils';

describe('getExportJobLogsListResultsFormatter', () => {
  const intl = {
    formatNumber: jest.fn(arg => Number(arg)),
    formatMessage: jest.fn(({ id }, values) => {
      if (values) {
        return `${id}:${JSON.stringify(values)}`;
      }

      return id;
    }),
  };

  const ky = jest.fn();
  const formatTime = jest.fn((date, options) => {
    return new Intl.DateTimeFormat('en-US', options).format(date);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fileName formatter', () => {
    it('formats fileName field correctly', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = {
        exportedFiles: [{ fileName: 'test.csv' }],
        progress: { exported: true },
        jobProfileId: 'profile-123',
        status: 'COMPLETED',
      };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.fileName](record);

      expect(result).toBeDefined();
    });
  });

  describe('status formatter', () => {
    it('formats status field correctly', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { status: 'COMPLETED' };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.status](record);

      expect(result).toBe('ui-data-export.jobStatus.completed');
      expect(intl.formatMessage).toHaveBeenCalledWith({ id: 'ui-data-export.jobStatus.completed' });
    });

    it('formats status field with IN_PROGRESS status', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { status: 'IN_PROGRESS' };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.status](record);

      expect(result).toBe('ui-data-export.jobStatus.inProgress');
      expect(intl.formatMessage).toHaveBeenCalledWith({ id: 'ui-data-export.jobStatus.inProgress' });
    });

    it('formats status field with FAIL status', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { status: 'FAIL' };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.status](record);

      expect(result).toBe('ui-data-export.jobStatus.fail');
      expect(intl.formatMessage).toHaveBeenCalledWith({ id: 'ui-data-export.jobStatus.fail' });
    });
  });

  describe('runBy formatter', () => {
    it('formats runBy field with full name', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = {
        runBy: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.runBy](record);

      expect(result).toBe('Doe, John');
    });

    it('formats runBy field with only last name', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = {
        runBy: {
          lastName: 'Doe',
        },
      };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.runBy](record);

      expect(result).toBe('Doe');
    });

    it('formats runBy field with empty personal data', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = {
        runBy: {},
      };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.runBy](record);

      expect(result).toBe('');
    });
  });

  describe('totalRecords formatter', () => {
    it('formats totalRecords field correctly', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { progress: { total: 1000 } };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.totalRecords](record);

      expect(result).toBe(1000);
      expect(intl.formatNumber).toHaveBeenCalledWith(1000);
    });

    it('handles undefined progress.total', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { progress: {} };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.totalRecords](record);

      expect(result).toBe(NaN);
      expect(intl.formatNumber).toHaveBeenCalledWith(undefined);
    });
  });

  describe('errors formatter', () => {
    it('formats the errors correctly when only failed records exist', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { progress: { failed: 5, duplicatedSrs: 0 } };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record);

      expect(result).toBe(5);
      expect(intl.formatNumber).toHaveBeenCalledWith(5);
    });

    it('formats the errors correctly when both failed and duplicatedSrs exist', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { progress: { failed: 5, duplicatedSrs: 3 } };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record);

      expect(result).toBe('ui-consortia-settings.duplicatesWithOthers:{"failedOther":5,"failedSrs":3}');
      expect(intl.formatMessage).toHaveBeenCalledWith(
        { id: 'ui-consortia-settings.duplicatesWithOthers' },
        { failedOther: 5, failedSrs: 3 },
      );
    });

    it('formats the errors correctly when only duplicatedSrs exist', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { progress: { failed: 0, duplicatedSrs: 3 } };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record);

      expect(result).toBe('ui-consortia-settings.duplicates:{"failedSrs":3}');
      expect(intl.formatMessage).toHaveBeenCalledWith(
        { id: 'ui-consortia-settings.duplicates' },
        { failedSrs: 3 },
      );
    });

    it('returns empty string when no errors exist', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { progress: { failed: 0, duplicatedSrs: 0 } };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record);

      expect(result).toBe('');
    });

    it('returns empty string when progress is undefined', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = {};

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record);

      expect(result).toBe('');
    });
  });

  describe('exported formatter', () => {
    it('formats exported field correctly', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { progress: { exported: 950 } };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.exported](record);

      expect(result).toBe(950);
      expect(intl.formatNumber).toHaveBeenCalledWith(950);
    });

    it('returns empty string when exported is 0', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { progress: { exported: 0 } };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.exported](record);

      expect(result).toBe('');
    });

    it('returns empty string when exported is undefined', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { progress: {} };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.exported](record);

      expect(result).toBe('');
    });

    it('returns empty string when progress is undefined', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = {};

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.exported](record);

      expect(result).toBe('');
    });
  });

  describe('startedDate formatter', () => {
    it('formats startedDate field correctly', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = { startedDate: new Date('2023-02-15') };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.startedDate](record);

      expect(result).toBe('2/15/2023');
      expect(formatTime).toHaveBeenCalledWith(
        new Date('2023-02-15'),
        {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        },
      );
    });
  });

  describe('jobProfileName formatter', () => {
    it('formats jobProfileName field correctly for active profile', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = {
        jobProfileName: 'Test Profile',
        jobProfileId: 'profile-123',
      };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.jobProfileName](record);

      expect(result).toBe('Test Profile');
    });

    it('formats jobProfileName field with deleted notation', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = {
        jobProfileName: 'Test Profile',
        jobProfileId: null,
      };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.jobProfileName](record);

      expect(result).toBe('Test Profile (ui-consortia-settings.deleted)');
      expect(intl.formatMessage).toHaveBeenCalledWith({ id: 'ui-consortia-settings.deleted' });
    });

    it('handles empty jobProfileName', () => {
      const formatter = getExportJobLogsListResultsFormatter({ intl, ky, formatTime });
      const record = {
        jobProfileName: '',
        jobProfileId: 'profile-123',
      };

      const result = formatter[EXPORT_JOB_LOG_COLUMNS.jobProfileName](record);

      expect(result).toBe('');
    });
  });
});

describe('fileUtils', () => {
  describe('downloadFileByLink', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('downloads a file given a valid fileName and downloadLink', () => {
      const fileName = 'example.txt';
      const downloadLink = 'https://example.com/download';

      const createElementMock = jest.spyOn(document, 'createElement');
      const appendChildMock = jest.spyOn(document.body, 'appendChild');
      const removeChildMock = jest.spyOn(document.body, 'removeChild');

      downloadFileByLink(fileName, downloadLink);

      expect(createElementMock).toHaveBeenCalledWith('a');
      expect(appendChildMock).toHaveBeenCalled();
      expect(removeChildMock).toHaveBeenCalled();
    });

    it('does not download if fileName or downloadLink is missing', () => {
      const fileName = '';
      const downloadLink = '';

      const createElementMock = jest.spyOn(document, 'createElement');
      const appendChildMock = jest.spyOn(document.body, 'appendChild');

      downloadFileByLink(fileName, downloadLink);

      expect(createElementMock).not.toHaveBeenCalled();
      expect(appendChildMock).not.toHaveBeenCalled();
    });
  });

  describe('getFileLink', () => {
    it('fetches the download link successfully', async () => {
      const jobLog = { id: '123', exportedFiles: [{ fileId: '456' }] };
      const expectedLink = 'https://example.com/download';

      const ky = {
        get: jest.fn(),
      };

      ky.get.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ link: expectedLink }) });

      const link = await getFileLink(jobLog, ky);

      expect(link).toBe(expectedLink);
      expect(ky.get).toHaveBeenCalledWith('data-export/job-executions/123/download/456');
    });
  });

  it('throws an error when response is not successful', async () => {
    const jobLog = { id: '123', exportedFiles: [{ fileId: '456' }] };

    const ky = {
      get: jest.fn(),
    };

    ky.get.mockResolvedValueOnce({ ok: false, statusText: 'Not Found' });

    try {
      await getFileLink(jobLog, ky);
      expect(true).toBe(false); // This line should not be reached
    } catch (error) {
      expect(error).toEqual({ ok: false, statusText: 'Not Found' });
    }
  });
});

describe('getFileNameField', () => {
  const recordWithExportedProgress = {
    exportedFiles: [{ fileName: 'example.txt' }],
    progress: { exported: true },
    jobProfileId: 'profile-123',
    status: 'COMPLETED',
  };

  const recordWithoutExportedProgress = {
    exportedFiles: [{ fileName: 'example.txt' }],
    progress: { exported: false },
    status: 'COMPLETED',
  };

  const recordWithFailStatus = {
    exportedFiles: [{ fileName: 'example.txt' }],
    progress: { exported: true },
    jobProfileId: 'profile-123',
    status: 'FAIL',
  };

  const recordWithInProgressStatus = {
    exportedFiles: [{ fileName: 'example.txt' }],
    progress: { exported: true },
    jobProfileId: 'profile-123',
    status: 'IN_PROGRESS',
  };

  const recordWithDeletedProfile = {
    exportedFiles: [{ fileName: 'example.txt' }],
    progress: { exported: true },
    jobProfileId: null,
    status: 'COMPLETED',
  };

  const kyMock = jest.fn(); // Mock the ky function if needed

  it('renders TextLink component when record is exported, completed, and not deleted', () => {
    const { getByTestId } = render(
      getFileNameField(recordWithExportedProgress, kyMock),
    );

    const textLinkElement = getByTestId('text-link');

    expect(textLinkElement).toBeInTheDocument();
    expect(textLinkElement).toHaveTextContent('example.txt');
  });

  it('renders span element when record.progress.exported is false', () => {
    const { getByText } = render(
      getFileNameField(recordWithoutExportedProgress, kyMock),
    );

    const spanElement = getByText('example.txt');

    expect(spanElement).toBeInTheDocument();
  });

  it('renders span element when record status is FAIL', () => {
    const { getByText } = render(
      getFileNameField(recordWithFailStatus, kyMock),
    );

    const spanElement = getByText('example.txt');

    expect(spanElement).toBeInTheDocument();
  });

  it('renders span element when record status is IN_PROGRESS', () => {
    const { getByText } = render(
      getFileNameField(recordWithInProgressStatus, kyMock),
    );

    const spanElement = getByText('example.txt');

    expect(spanElement).toBeInTheDocument();
  });

  it('renders span element when job profile is deleted', () => {
    const { getByText } = render(
      getFileNameField(recordWithDeletedProfile, kyMock),
    );

    const spanElement = getByText('example.txt');

    expect(spanElement).toBeInTheDocument();
  });
});

describe('getStartedDateDateFormatter', () => {
  const sampleRecord = {
    startedDate: new Date('2023-02-15'), // Assuming a Date object
  };

  const dateFormatter = getStartedDateDateFormatter((date, options) => {
    return new Intl.DateTimeFormat('en-US', options).format(date);
  });

  it('should format startedDate correctly', () => {
    const formattedDate = dateFormatter(sampleRecord);

    const expectedFormattedDate = '2/15/2023';

    expect(formattedDate).toEqual(expectedFormattedDate);
  });
});

describe('getFormattedJobProfileName', () => {
  const intl = {
    formatMessage: jest.fn(({ id }) => id),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns job profile name with deleted suffix when profile is deleted', () => {
    const record = {
      jobProfileName: 'Test Export Profile',
      jobProfileId: null,
    };

    const result = getFormattedJobProfileName(record, intl);

    expect(result).toBe('Test Export Profile (ui-consortia-settings.deleted)');
    expect(intl.formatMessage).toHaveBeenCalledWith({ id: 'ui-consortia-settings.deleted' });
  });

  it('returns job profile name with deleted suffix when jobProfileId is undefined', () => {
    const record = {
      jobProfileName: 'Test Export Profile',
    };

    const result = getFormattedJobProfileName(record, intl);

    expect(result).toBe('Test Export Profile (ui-consortia-settings.deleted)');
    expect(intl.formatMessage).toHaveBeenCalledWith({ id: 'ui-consortia-settings.deleted' });
  });

  it('handles empty job profile name with deleted suffix', () => {
    const record = {
      jobProfileName: '',
      jobProfileId: null,
    };

    const result = getFormattedJobProfileName(record, intl);

    expect(result).toBe(' (ui-consortia-settings.deleted)');
    expect(intl.formatMessage).toHaveBeenCalledWith({ id: 'ui-consortia-settings.deleted' });
  });

  it('handles missing job profile name with deleted suffix', () => {
    const record = {
      jobProfileId: null,
    };

    const result = getFormattedJobProfileName(record, intl);

    expect(result).toBe(' (ui-consortia-settings.deleted)');
    expect(intl.formatMessage).toHaveBeenCalledWith({ id: 'ui-consortia-settings.deleted' });
  });
});
