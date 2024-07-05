import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  act,
  cleanup,
  renderHook,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { useRoleCapabilities } from './useRoleCapabilities';
import { capabilitiesData } from '../../../test/jest/fixtures';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
  useNamespace: jest.fn().mockReturnValue('roles'),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  get: jest.fn(() => ({
    json: async () => Promise.resolve(capabilitiesData),
  })),
};

const expectedInitialRoleCapabilitiesSelectedMap = {
  'data-capability-id': true,
  'settings-capability-id': true,
  'procedural-capability-id': true,
};

const expectedGroupedRoleCapabilitiesByType = {
  'data': [
    {
      'actions': {
        'manage': 'data-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'data-capability-id',
      'resource': 'Capability Roles',
    },
  ],
  'procedural': [
    {
      'actions': {
        'manage': 'procedural-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'procedural-capability-id',
      'resource': 'Capability Roles',
    },
  ],
  'settings': [
    {
      'actions': {
        'manage': 'settings-capability-id',
      },
      'applicationId': 'app-platform-minimal',
      'id': 'settings-capability-id',
      'resource': 'Capability Roles',
    },
  ],
};

describe('useRoleCapabilities', () => {
  beforeEach(() => {
    queryClient.clear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    useStripes.mockClear().mockReturnValue({
      discovery: {
        applications: {
          'app-platform-minimal-0.0.4': 'app-platform-minimal',
        },
      },
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('fetches role capabilities', async () => {
    const { result } = renderHook(() => useRoleCapabilities(1), { wrapper });

    await act(() => result.current.isSuccess);

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.initialRoleCapabilitiesSelectedMap).toEqual(expectedInitialRoleCapabilitiesSelectedMap);
    expect(result.current.capabilitiesTotalCount).toEqual(2);
    expect(result.current.groupedRoleCapabilitiesByType).toEqual(expectedGroupedRoleCapabilitiesByType);
    expect(result.current.capabilitiesAppIds).toEqual({ 'app-platform-minimal-0.0.4': true });
  });
});
