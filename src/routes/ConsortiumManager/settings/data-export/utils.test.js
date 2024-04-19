import {downloadFileByLink, getExportJobLogsListResultsFormatter, getFileLink} from './utils';
import { EXPORT_JOB_LOG_COLUMNS } from './constants';

describe('getExportJobLogsListResultsFormatter', () => {
  const intl = {
    formatNumber: jest.fn(arg => Number(arg)),
    formatMessage: jest.fn(({ id }) => id),
  };

  it('formats the errors correctly', () => {
    const formatter = getExportJobLogsListResultsFormatter({ intl });
    // Test cases for different error scenarios
    const record1 = { progress: { failed: 5, duplicatedSrs: 0 } };
    const record2 = { progress: { failed: 5, duplicatedSrs: 3 } };
    const record3 = { progress: { failed: 0, duplicatedSrs: 3 } };

    const result1 = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record1);
    const result2 = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record2);
    const result3 = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record3);

    // Assert based on the expected error messages for each scenario
    expect(result1).toBe(5);
    expect(result2).toBe('ui-consortia-settings.duplicatesWithOthers'); // Replace 'formattedError' with the expected error message
    expect(result3).toBe('ui-consortia-settings.duplicates'); // Replace 'formattedError' with the expected error message
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
      }

      ky.get.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ link: expectedLink }) });

      const link = await getFileLink(jobLog, ky);

      expect(link).toBe(expectedLink);
      expect(ky.get).toHaveBeenCalledWith('data-export/job-executions/123/download/456');
    });
  });
});
