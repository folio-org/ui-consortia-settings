import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useTenantPermissions } from './useTenantPermissions';
import { useTenantKy } from '../useTenantKy';

jest.mock('../useTenantKy', () => ({
  ...jest.requireActual('../useTenantKy'),
  useTenantKy: jest.fn(),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const permissions = [
  { id: 'perm-id' },
];

const kyMock = {
  get: jest.fn(() => ({
    json: () => ({ permissions, totalRecords: permissions.length }),
  })),
};

describe('useTenantPermissions', () => {
  beforeEach(() => {
    useTenantKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should ', async () => {
    const tenantId = 'diku';
    const { result, waitFor } = renderHook(() => useTenantPermissions({ tenantId }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.permissions).toEqual(permissions);
  });
});
