import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import { tenants } from 'fixtures';
import { fetchConsortiumUserTenants } from '../../services';
import { useUserAffiliations } from './useUserAffiliations';

jest.mock('../../services', () => ({
  fetchConsortiumUserTenants: jest.fn(),
}));

const consortium = {
  id: 'consortium-id',
  centralTenantId: 'mobius',
};
const affiliations = tenants.map(({ id, name }) => ({ tenantId: id, tenantName: name }));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useUserAffiliations', () => {
  beforeAll(() => {
    const user = useStripes().user.user;

    user.consortium = consortium;
  });

  beforeEach(() => {
    fetchConsortiumUserTenants
      .mockClear()
      .mockReturnValue(affiliations);
  });

  afterAll(() => {
    const user = useStripes().user.user;

    user.consortium = undefined;
  });

  it('should fetch user\'s consortium affiliations by user\'s id', async () => {
    const userId = 'usedId';
    const stripes = useStripes();
    const { result } = renderHook(() => useUserAffiliations({ userId }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(fetchConsortiumUserTenants).toHaveBeenCalledWith(
      stripes,
      consortium.centralTenantId,
      { id: consortium.id },
      { signal: expect.any(AbortSignal) },
    );
    expect(result.current.affiliations).toEqual(affiliations);
  });
});
