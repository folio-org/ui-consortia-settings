import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { useShowCallout } from '@folio/stripes-acq-components';

import { jobExecutions } from 'fixtures';
import { ConsortiumManagerContextProviderMock } from 'helpers';
import { useDataImportLogs } from '../hooks';
import { DataImportLogs } from './DataImportLogs';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
}));

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useDataImportLogs: jest.fn(),
}));

const defaultProps = {};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ConsortiumManagerContextProviderMock>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </ConsortiumManagerContextProviderMock>
  </QueryClientProvider>
);

const renderDataImportLogs = (props = {}) => render(
  <DataImportLogs
    {...defaultProps}
    {...props}
  />,
  { wrapper },
);

describe('DataImportLogs', () => {
  const showCalloutMock = jest.fn();

  beforeEach(() => {
    showCalloutMock.mockClear();
    useShowCallout.mockClear().mockReturnValue(showCalloutMock);
    useDataImportLogs.mockClear().mockReturnValue({
      isFetching: false,
      isLoading: false,
      jobExecutions,
      totalRecords: jobExecutions.length,
    });
  });

  it('should render data import logs pane', async () => {
    renderDataImportLogs();

    expect(await screen.findByText('ui-data-import.meta.title')).toBeInTheDocument();
    expect(await screen.findByText('ui-consortia-settings.consortiumManager.members.selection.label')).toBeInTheDocument();
    jobExecutions.forEach(({ fileName }) => {
      expect(screen.getByText(fileName)).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should handle 403 error', async () => {
      renderDataImportLogs();

      useDataImportLogs.mock.calls[0][1].onError({
        response: { status: 403 },
      });

      expect(showCalloutMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'ui-consortia-settings.errors.jobs.load.common ui-consortia-settings.errors.permissionsRequired' }));
    });

    it('should handle other errors', async () => {
      renderDataImportLogs();

      useDataImportLogs.mock.calls[0][1].onError({ response: {} });

      expect(showCalloutMock).toHaveBeenCalledWith(expect.objectContaining({ message: 'ui-consortia-settings.errors.jobs.load.common' }));
    });
  });
});
