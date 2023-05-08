import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import orderBy from 'lodash/orderBy';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { tenants } from '../../../test/jest/fixtures';
import { useUserAffiliations } from './useUserAffiliations';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(() => ({})),
  useStripes: jest.fn(() => ({})),
}));

const consortium = { id: 'consortium-id' };
const affiliations = tenants.map(({ id, name }) => ({ tenantId: id, tenantName: name }));
const stripes = { consortium };

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useUserAffiliations', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({
      userTenants: affiliations,
      totalRecords: affiliations.length,
    }),
  }));
  const setHeaderMock = jest.fn();
  const kyMock = {
    extend: jest.fn(({ hooks: { beforeRequest } }) => {
      beforeRequest.forEach(handler => handler({ headers: { set: setHeaderMock } }));

      return {
        get: mockGet,
      };
    }),
  };

  beforeEach(() => {
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    useStripes.mockClear().mockReturnValue(stripes);
  });

  it('should fetch user\'s consortium affiliations by user\'s id', async () => {
    const userId = 'usedId';
    const { result, waitFor } = renderHook(() => useUserAffiliations({ userId }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(mockGet).toHaveBeenCalledWith(
      `consortia/${consortium.id}/user-tenants`,
      expect.objectContaining({ searchParams: { userId, limit: LIMIT_MAX } }),
    );
    expect(result.current.affiliations).toEqual(orderBy(affiliations, 'tenantName'));
  });
});