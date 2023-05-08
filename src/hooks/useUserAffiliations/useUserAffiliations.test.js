import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import orderBy from 'lodash/orderBy';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { useOkapiKy, useStripes } from '@folio/stripes/core';
import { LIMIT_MAX } from '@folio/stripes-acq-components';

import { tenants } from '../../../test/jest/fixtures';
import { useUserAffiliations } from './useUserAffiliations';

const consortium = {
  id: 'consortium-id',
  centralTenantId: 'mobius',
};
const affiliations = tenants.map(({ id, name }) => ({ tenantId: id, tenantName: name }));

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

  beforeAll(() => {
    const user = useStripes().user.user;

    user.consortium = consortium;
  });

  beforeEach(() => {
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  afterAll(() => {
    const user = useStripes().user.user;

    user.consortium = undefined;
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
