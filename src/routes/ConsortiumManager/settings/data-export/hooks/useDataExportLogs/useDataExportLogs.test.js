import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  ASC_DIRECTION,
  LIMIT_PARAMETER,
  OFFSET_PARAMETER,
} from '@folio/stripes-acq-components';

import { useTenantKy } from '../../../../../../hooks';
import { useDataExportLogs } from './useDataExportLogs';
import { DATA_EXPORT_API } from '../../../../../../constants';
import { EXPORT_JOB_LOG_COLUMNS } from '../../constants';
import { getExportJobLogsSortMap } from '../../utils';

jest.mock('../../../../../../hooks', () => ({
  ...jest.requireActual('../../../../../../hooks'),
  useTenantKy: jest.fn(),
}));

const jobExecutions = [
  { id: 'job-1' },
  { id: 'job-2' },
];

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({
      jobExecutions,
      totalRecords: jobExecutions.length,
    }),
  })),
};

describe('useDataExportLogs', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useTenantKy.mockClear().mockReturnValue(kyMock);
  });

  it('should fetch user\'s consortium affiliations by user\'s id', async () => {
    const tenantId = 'college';
    const { result } = renderHook(() => useDataExportLogs({ tenantId }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.jobExecutions).toEqual(jobExecutions);
    expect(kyMock.get).toHaveBeenCalledWith(`${DATA_EXPORT_API}/job-executions`, expect.objectContaining({}));
  });

  it('should apply pagination and sorting in the request', async () => {
    const tenantId = 'university';
    const pagination = { [LIMIT_PARAMETER]: 200, [OFFSET_PARAMETER]: 300 };
    const sorting = { sortingField: EXPORT_JOB_LOG_COLUMNS.status, sortingDirection: ASC_DIRECTION };
    const { result } = renderHook(() => useDataExportLogs({ tenantId, pagination, sorting }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    const {
      limit,
      offset,
      query,
    } = kyMock.get.mock.calls[0][kyMock.get.mock.calls[0].length - 1].searchParams;

    expect(result.current.jobExecutions).toEqual(jobExecutions);
    expect(limit).toBe(200);
    expect(offset).toBe(300);
    expect(query).toEqual(
      expect.stringMatching(
        new RegExp(`sortby ${getExportJobLogsSortMap({ sortingDirection: sorting.sortingDirection })[sorting.sortingField]}/sort.${sorting.sortingDirection}`),
      ),
    );
  });
});
