import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { tenants as tenantsMock } from 'fixtures';
import { ConsortiumManagerContextProviderMock } from 'helpers';
import { PERMISSION_USERS_API } from '../../constants';
import { usePublishCoordinator } from '../usePublishCoordinator';
import { useUserTenantsPermissions } from './useUserTenantsPermissions';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
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

const userId = 'userId';
const tenants = tenantsMock.slice(3).map(({ id }) => id);
const permissionNames = ['post', 'put', 'delete'];
const response = {
  publicationResults: tenantsMock.map(({ id }) => ({
    tenantId: id,
    response: { permissionNames },
    statusCode: 200,
  })),
};

const initPublicationRequest = jest.fn();

describe('useUserTenantsPermissions', () => {
  beforeEach(() => {
    initPublicationRequest.mockClear().mockResolvedValue(response);
    usePublishCoordinator.mockClear().mockReturnValue(({ initPublicationRequest }));
  });

  it('should send a publish coordinator request to get user permissions in the provided tenants', async () => {
    const { result } = renderHook(() => useUserTenantsPermissions({ userId, tenants }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(initPublicationRequest).toHaveBeenCalledWith({
      method: 'GET',
      tenants,
      url: expect.stringContaining(`${PERMISSION_USERS_API}/${userId}/permissions`),
    });
    expect(result.current.permissionNames).toEqual(expect.objectContaining(
      tenants.reduce((acc, tenantId) => ({ ...acc, [tenantId]: permissionNames }), {}),
    ));
  });
});
