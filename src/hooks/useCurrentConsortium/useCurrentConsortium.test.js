import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { consortium as consortiumMock } from '../../../test/jest/fixtures';
import { useCurrentConsortium } from './useCurrentConsortium';

const configs = [
  {
    id: '8628171f-292f-44d6-9cd1-1f254786c166',
    module: 'CONSORTIA',
    configName: 'centralTenantId',
    enabled: true,
    value: 'mobius',
  },
];
const consortium = {
  ...consortiumMock,
  centralTenant: 'mobius',
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCurrentConsortium', () => {
  const mockGet = (data) => jest.fn(() => ({
    json: () => Promise.resolve(data),
  }));

  const getConfigs = mockGet({ configs });
  const getConsortia = mockGet({ consortia: [consortium] });

  const setHeaderMock = jest.fn();
  const kyMock = {
    get: getConfigs,
    extend: jest.fn(({ hooks: { beforeRequest } }) => {
      beforeRequest.forEach(handler => handler({ headers: { set: setHeaderMock } }));

      return {
        get: getConsortia,
      };
    }),
  };

  beforeEach(() => {
    getConfigs.mockClear();
    getConsortia.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should ', async () => {
    const { result, waitFor } = renderHook(() => useCurrentConsortium(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(setHeaderMock).toHaveBeenCalled();
    expect(result.current.consortium).toEqual(consortium);
  });
});
