import * as reactQuery from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useNamespace } from '@folio/stripes/core';
import { buildSortingQuery } from '@folio/stripes-acq-components';

import {
  useDataExportLogs,
} from './useDataExportLogs';
import {
  DEFAULT_PAGINATION,
  DEFAULT_SORTING,
} from '../../constants';

import { getExportJobLogsSortMap } from '../../utils';
import { useTenantKy } from '../../../../../../hooks';
import { useConsortiumManagerContext } from '../../../../../../contexts';

jest.mock('@folio/stripes-acq-components', () => ({
  buildSortingQuery: jest.fn(),
}));
jest.mock('../../utils', () => ({
  getExportJobLogsSortMap: jest.fn(),
}));
jest.mock('../../../../../../hooks', () => ({
  useTenantKy: jest.fn(),
}));
jest.mock('../../../../../../contexts', () => ({
  useConsortiumManagerContext: jest.fn(),
}));

describe('useDataExportLogs', () => {
  let capturedQueryKey;
  let capturedQueryFn;
  let capturedOptions;

  beforeEach(() => {
    useNamespace.mockReturnValue(['ns']);
    getExportJobLogsSortMap.mockReturnValue({ /* dummy sort map */ });
    buildSortingQuery.mockReturnValue('sortQuery');
    useConsortiumManagerContext.mockReturnValue({
      hasTenantPerm: () => true,
    });
    useTenantKy.mockReturnValue({
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockResolvedValue({ jobExecutions: ['X'], totalRecords: 42 }),
      }),
    });

    jest.spyOn(reactQuery, 'useQuery')
      .mockImplementation((queryKey, queryFn, options) => {
        capturedQueryKey = queryKey;
        capturedQueryFn = queryFn;
        capturedOptions = options;

        return {
          isLoading: false,
          isFetching: false,
          data: { jobExecutions: ['X'], totalRecords: 42 },
        };
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('builds the correct query key and disables query when no tenantId', () => {
    const { result } = renderHook(() => useDataExportLogs());

    expect(capturedQueryKey).toEqual([
      'ns',
      undefined,
      DEFAULT_PAGINATION.limit,
      DEFAULT_PAGINATION.offset,
      DEFAULT_SORTING.sortingField,
      DEFAULT_SORTING.sortingDirection,
    ]);

    expect(capturedOptions.enabled).toBe(false);
    expect(result.current.jobExecutions).toEqual(['X']);
    expect(result.current.totalRecords).toBe(42);
  });

  it('throws a 403 error when user lacks view permission', async () => {
    useConsortiumManagerContext.mockReturnValue({
      hasTenantPerm: () => false,
    });

    renderHook(() => useDataExportLogs({ tenantId: 'T1' }));

    expect(() => capturedQueryFn({ signal: undefined }))
      .toThrowError(Object.assign(new Error(), { response: { status: 403 } }));
  });

  it('calls ky.get with correct URL and searchParams', async () => {
    const mockGet = jest.fn().mockReturnValue({
      json: jest.fn().mockResolvedValue({ jobExecutions: [], totalRecords: 0 }),
    });

    useTenantKy.mockReturnValue({ get: mockGet });

    const params = {
      tenantId: 'T42',
      pagination: { limit: 5, offset: 10 },
      sorting: { sortingField: 'foo', sortingDirection: 'desc' },
    };

    renderHook(() => useDataExportLogs(params));

    await capturedQueryFn({ signal: 'SIG' });

    const callArgs = mockGet.mock.calls[0][1];
    const { searchParams } = callArgs;
    const { query } = searchParams;

    expect(query).toContain('status=(');
    expect(query).toContain('sortQuery');
    expect(query).toContain('total/number');
  });
});
