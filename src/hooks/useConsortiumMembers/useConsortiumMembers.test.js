import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { tenants } from '../../../test/jest/fixtures';
import { fetchConsortiumMembers } from '../../services';
import { useConsortiumMembers } from './useConsortiumMembers';

jest.mock('../../services', () => ({
  ...jest.requireActual('../../services'),
  fetchConsortiumMembers: jest.fn(),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useConsortiumMembers', () => {
  beforeEach(() => {
    fetchConsortiumMembers.mockClear().mockResolvedValue(tenants);
  });

  it('should fetch consortium members (tenants)', async () => {
    const { result, waitFor } = renderHook(() => useConsortiumMembers(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.tenants).toEqual(tenants);
  });
});
