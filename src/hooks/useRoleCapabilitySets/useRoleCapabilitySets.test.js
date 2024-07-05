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

import { useRoleCapabilitySets } from './useRoleCapabilitySets';
import { capabilitiesSetsData } from "../../../test/jest/fixtures/capabilities";

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
  useNamespace: jest.fn().mockReturnValue('roles-sets'),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);


const expectedInitialRoleCapabilitySetsSelectedMap = {
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

const reqMock = {
  headers: {
    set: jest.fn(),
  },
};

const kyMock = {
  extend: jest.fn(({ hooks: { beforeRequest } }) => {
    beforeRequest[0](reqMock);

    return kyMock;
  }),
  get: jest.fn(() => ({
    json: async () => Promise.resolve(capabilitiesSetsData),
  })),
};

describe('useRoleCapabilitySets', () => {
  beforeAll(() => {
    cleanup();
    jest.clearAllMocks();
  });

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
    cleanup();
    jest.clearAllMocks();
  });

  it('fetches role capability sets', async () => {
    const { result } = renderHook(() => useRoleCapabilitySets(1, 1), { wrapper });

    await act(() => result.current.isSuccess);

    expect(result.current.isSuccess).toBe(true);
    expect(result.current.initialRoleCapabilitySetsSelectedMap).toBeDefined();
    expect(result.current.initialRoleCapabilitySetsSelectedMap)
      .toStrictEqual(expectedInitialRoleCapabilitySetsSelectedMap);
    expect(result.current.capabilitySetsTotalCount).toEqual(3);
    expect(result.current.groupedRoleCapabilitySetsByType).toEqual(expectedGroupedRoleCapabilitiesByType);
    expect(result.current.capabilitySetsAppIds).toEqual({ 'app-platform-minimal-0.0.4': true });
  });
});
