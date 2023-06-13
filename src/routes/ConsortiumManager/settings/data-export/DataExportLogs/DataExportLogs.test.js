import { render, screen } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useShowCallout } from '@folio/stripes-acq-components';

import { jobExecutions } from '../../../../../../test/jest/fixtures';
import { ConsortiumManagerContextProviderMock } from '../../../../../../test/jest/helpers';
import { useDataExportLogs } from '../hooks';
import { DataExportLogs } from './DataExportLogs';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useDataExportLogs: jest.fn(),
}));

const defaultProps = {};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ConsortiumManagerContextProviderMock>
      {children}
    </ConsortiumManagerContextProviderMock>
  </QueryClientProvider>
);

const renderDataExportLogs = (props = {}) => render(
  <DataExportLogs
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('DataExportLogs', () => {
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    showCalloutMock.mockClear();
    useShowCallout.mockClear().mockReturnValue(showCalloutMock);
    useDataExportLogs.mockClear().mockReturnValue({
      isFetching: false,
      isLoading: false,
      jobExecutions,
      totalRecords: jobExecutions.length,
    });
  });

  it('should render data import logs pane', async () => {
    renderDataExportLogs();

    expect(await screen.findByText('ui-data-import.meta.title')).toBeInTheDocument();
    expect(await screen.findByText('ui-consortia-settings.consortiumManager.members.selection.label')).toBeInTheDocument();
    jobExecutions.forEach(({ fileName }) => {
      expect(screen.getByText(fileName)).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should handle 403 error', async () => {
      renderDataExportLogs();

      useDataExportLogs.mock.calls[0][1].onError({
        response: { status: 403 },
      });

      expect(showCalloutMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'ui-consortia-settings.errors.jobs.load.common ui-consortia-settings.errors.permissionsRequired' }));
    });

    it('should handle other errors', async () => {
      renderDataExportLogs();

      useDataExportLogs.mock.calls[0][1].onError({ response: {} });

      expect(showCalloutMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'ui-consortia-settings.errors.jobs.load.common' }));
    });
  });
});
