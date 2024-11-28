import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';

import { tenants as tenantsMock } from 'fixtures';
import { ConsortiumManagerContextProviderMock } from 'helpers';
import { BL_USERS_API } from '../../constants';
import { usePublishCoordinator } from '../usePublishCoordinator';
import { useCurrentUserTenantsPermissions } from './useCurrentUserTenantsPermissions';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(() => ({ hasInterface: () => false,
    user: {
      user: {
        consortium: { id: 'consortium' },
      },
    } })),
  useNamespace: jest.fn(() => ['namespace']),
}));

jest.mock('../usePublishCoordinator', () => ({
  usePublishCoordinator: jest.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ConsortiumManagerContextProviderMock>
      {children}
    </ConsortiumManagerContextProviderMock>
  </QueryClientProvider>
);

const tenants = tenantsMock.slice(3).map(({ id }) => id);
const permissions = ['post', 'put', 'delete'];
const response = {
  publicationResults: tenantsMock.map(({ id }) => ({
    tenantId: id,
    response: { permissions: { permissions } },
    statusCode: 200,
  })),
};

const initPublicationRequest = jest.fn();

describe('useCurrentUserTenantsPermissions', () => {
  beforeEach(() => {
    initPublicationRequest.mockClear().mockResolvedValue(response);
    usePublishCoordinator.mockClear().mockReturnValue(({ initPublicationRequest }));
  });

  it('should send a publish coordinator request to get user permissions in the provided tenants', async () => {
    const { result } = renderHook(() => useCurrentUserTenantsPermissions({ tenants }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(initPublicationRequest).toHaveBeenCalledWith({
      method: 'GET',
      tenants,
      url: expect.stringContaining(`${BL_USERS_API}/_self`),
    });
    expect(result.current.tenantsPermissions).toEqual(expect.objectContaining(
      tenants.reduce((acc, tenantId) => ({ ...acc, [tenantId]: permissions }), {}),
    ));
  });
});
