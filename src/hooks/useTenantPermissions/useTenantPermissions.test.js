import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
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

  it('should fetch tenant-related permissions', async () => {
    const tenantId = 'diku';
    const { result } = renderHook(() => useTenantPermissions({ tenantId }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.permissions).toEqual(permissions);
  });
});
