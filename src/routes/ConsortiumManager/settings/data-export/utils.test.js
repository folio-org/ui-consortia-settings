import {getExportJobLogsListResultsFormatter} from './utils'
import {EXPORT_JOB_LOG_COLUMNS} from "./constants";
import {useIntl} from "react-intl";

describe('getExportJobLogsListResultsFormatter', () => {
  const intl = useIntl()

  it('formats the errors correctly', () => {
    const formatter = getExportJobLogsListResultsFormatter({ intl });
    // Test cases for different error scenarios
    const record1 = { progress: { failed: { duplicatedSrs: 0, otherFailed: 5 } } };
    const record2 = { progress: { failed: { duplicatedSrs: 3, otherFailed: 5 } } };
    const record3 = { progress: { failed: { duplicatedSrs: 3, otherFailed: 0 } } };

    const result1 = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record1);
    const result2 = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record2);
    const result3 = formatter[EXPORT_JOB_LOG_COLUMNS.errors](record3);

    // Assert based on the expected error messages for each scenario
    expect(result1).toBe('5');
    expect(result2).toBe('ui-consortia-settings.duplicatesWithOthers'); // Replace 'formattedError' with the expected error message
    expect(result3).toBe('ui-consortia-settings.duplicates'); // Replace 'formattedError' with the expected error message
  });
});

