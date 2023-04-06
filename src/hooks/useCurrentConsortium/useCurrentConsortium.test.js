import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { consortium } from '../../../test/jest/fixtures';
import { useCurrentConsortium } from './useCurrentConsortium';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  get: jest.fn(() => ({
    json: async () => Promise.resolve({ consortia: [consortium] }),
  })),
};

describe('useCurrentConsortium', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should ', async () => {
    const { result, waitFor } = renderHook(() => useCurrentConsortium(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.consortium).toEqual(consortium);
  });
});
