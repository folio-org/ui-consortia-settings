import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useEntryMutation } from './useEntryMutation';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const path = 'some-storage/entries';
const entry = { id: 'test-id', name: 'foo' };

const kyMock = {
  post: jest.fn(() => ({
    json: () => Promise.resolve(entry),
  })),
  put: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
};

describe('useEntryMutation', () => {
  beforeEach(() => {
    kyMock.post.mockClear();
    kyMock.put.mockClear();
    kyMock.delete.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it.each([
    ['createEntry', kyMock.post, [path, { json: entry }]],
    ['updateEntry', kyMock.put, [`${path}/${entry.id}`, { json: entry }]],
    ['deleteEntry', kyMock.delete, [`${path}/${entry.id}`]],
  ])('should handle \'%s\' mutation', async (fnName, mockedFn, args) => {
    const { result, waitFor } = renderHook(() => useEntryMutation({ path }), { wrapper });

    const mutationFn = result.current[fnName];

    await mutationFn({ entry });
    await waitFor(() => !result.current.isLoading);

    expect(mockedFn).toHaveBeenCalledWith(...args);
  });
});
