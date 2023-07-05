import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useEntries } from './useEntries';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const path = 'some-storage/entries';
const records = 'items';
const response = {
  [records]: [
    { id: 'test-id-1', name: 'foo' },
    { id: 'test-id-2', name: 'bar' },
  ],
};

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve(response),
  })),
};

describe('useEntries', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should send a request to \'path\' and get entity records', async () => {
    const { result, waitFor } = renderHook(() => useEntries({ path, records }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(kyMock.get).toHaveBeenCalledWith(path, expect.objectContaining({
      searchParams: expect.objectContaining({
        query: 'cql.allRecords=1 sortby name',
      }),
    }));
    expect(result.current.entries).toEqual(response[records]);
  });

  it('should apply sorting in the request', async () => {
    const sortby = 'group/sort.descending';
    const { result, waitFor } = renderHook(() => useEntries({
      path,
      records,
      sortby,
    }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(kyMock.get).toHaveBeenCalledWith(path, expect.objectContaining({
      searchParams: expect.objectContaining({
        query: `cql.allRecords=1 sortby ${sortby}`,
      }),
    }));
  });
});
