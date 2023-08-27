import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { useStripes } from '@folio/stripes/core';

import { tenants } from '../../../test/jest/fixtures';
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

// eslint-disable-next-line react/prop-types
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
    );
    expect(result.current.affiliations).toEqual(affiliations);
  });
});
