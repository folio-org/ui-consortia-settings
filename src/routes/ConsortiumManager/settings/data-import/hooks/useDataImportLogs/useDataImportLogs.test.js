import { renderHook } from '@testing-library/react-hooks';
import { parse } from 'query-string';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  ASC_DIRECTION,
  LIMIT_PARAMETER,
  OFFSET_PARAMETER,
} from '@folio/stripes-acq-components';

import {
  FILE_STATUSES,
  METADATA_PROVIDER_API,
} from '../../../../../../constants';
import { useTenantKy } from '../../../../../../hooks';
import { useDataImportLogs } from './useDataImportLogs';

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

describe('useDataImportLogs', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useTenantKy.mockClear().mockReturnValue(kyMock);
  });

  it('should fetch user\'s consortium affiliations by user\'s id', async () => {
    const tenantId = 'college';
    const { result, waitFor } = renderHook(() => useDataImportLogs({ tenantId }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.jobExecutions).toEqual(jobExecutions);
    expect(kyMock.get).toHaveBeenCalledWith(`${METADATA_PROVIDER_API}/jobExecutions`, expect.objectContaining({}));
  });

  it('should apply pagination and sorting in the request', async () => {
    const tenantId = 'university';
    const pagination = { [LIMIT_PARAMETER]: 200, [OFFSET_PARAMETER]: 300 };
    const sorting = { sortingField: 'testField', sortingDirection: ASC_DIRECTION };
    const { result, waitFor } = renderHook(() => useDataImportLogs({ tenantId, pagination, sorting }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    const {
      limit,
      offset,
      sortBy,
      statusAny,
    } = parse(kyMock.get.mock.calls[0][kyMock.get.mock.calls[0].length - 1].searchParams);

    expect(result.current.jobExecutions).toEqual(jobExecutions);
    expect(Number(limit)).toBe(200);
    expect(Number(offset)).toBe(300);
    expect(sortBy).toBe('testField,asc');
    expect(statusAny).toEqual([
      FILE_STATUSES.COMMITTED,
      FILE_STATUSES.ERROR,
      FILE_STATUSES.CANCELLED,
    ]);
  });
});
