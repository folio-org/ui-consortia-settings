import { render } from '@folio/jest-config-stripes/testing-library/react';

import { EXPORT_JOB_LOG_COLUMNS } from './constants';
import {
  downloadFileByLink,
  getExportJobLogsListResultsFormatter,
  getFileLink,
  getFileNameField,
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

  it('formats the errors correctly when only failed records exist', () => {
    const formatter = getExportJobLogsListResultsFormatter({ intl });
    const record = { progress: { failed: 5, duplicatedSrs: 0 } };

    const result = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record);

    expect(result).toBe(5);
    expect(intl.formatNumber).toHaveBeenCalledWith(5);
  });

  it('formats the errors correctly when both failed and duplicatedSrs exist', () => {
    const formatter = getExportJobLogsListResultsFormatter({ intl });
    const record = { progress: { failed: 5, duplicatedSrs: 3 } };

    const result = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record);

    expect(result).toBe('ui-consortia-settings.duplicatesWithOthers:{"failedOther":5,"failedSrs":3}');
    expect(intl.formatMessage).toHaveBeenCalledWith(
      { id: 'ui-consortia-settings.duplicatesWithOthers' },
      { failedOther: 5, failedSrs: 3 },
    );
  });

  it('formats the errors correctly when only duplicatedSrs exist', () => {
    const formatter = getExportJobLogsListResultsFormatter({ intl });
    const record = { progress: { failed: 0, duplicatedSrs: 3 } };

    const result = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record);

    expect(result).toBe('ui-consortia-settings.duplicates:{"failedSrs":3}');
    expect(intl.formatMessage).toHaveBeenCalledWith(
      { id: 'ui-consortia-settings.duplicates' },
      { failedSrs: 3 },
    );
  });

  it('returns empty string when no errors exist', () => {
    const formatter = getExportJobLogsListResultsFormatter({ intl });
    const record = { progress: { failed: 0, duplicatedSrs: 0 } };

    const result = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record);

    expect(result).toBe('');
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
