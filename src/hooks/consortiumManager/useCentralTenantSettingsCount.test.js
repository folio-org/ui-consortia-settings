import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { buildStripesObject } from 'helpers';
import { OKAPI_TENANT_HEADER } from '../../constants';
import { useCentralTenantSettingsCount } from './useCentralTenantSettingsCount';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const path = 'some-storage/entries';
const centralTenantId = 'mobius';
const totalRecords = 42;

const buildStripesWithConsortium = (consortium) => buildStripesObject({
  user: { user: { consortium } },
});

const kyMock = {
  extend: jest.fn(() => kyMock),
  get: jest.fn(() => ({
    json: () => Promise.resolve({ totalRecords }),
  })),
};

describe('useCentralTenantSettingsCount', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
    useStripes.mockReturnValue(buildStripesWithConsortium({ id: 'consortium-id', centralTenantId }));
  });

  afterEach(() => {
    queryClient.clear();
    jest.clearAllMocks();
  });

  it('should send a request to the central tenant to get settings count', async () => {
    const { result } = renderHook(() => useCentralTenantSettingsCount(path), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(`${path}?limit=0`, { signal: expect.anything() });
    expect(result.current.count).toEqual(totalRecords);
  });

  it('should refetch the count on demand', async () => {
    const { result } = renderHook(() => useCentralTenantSettingsCount(path), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());
    await result.current.refetch();

    expect(kyMock.get).toHaveBeenCalledTimes(2);
  });

  it('should set the central tenant ID in the request tenant header', async () => {
    const { result } = renderHook(() => useCentralTenantSettingsCount(path), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const [beforeRequestHook] = kyMock.extend.mock.calls[0][0].hooks.beforeRequest;
    const request = { headers: { set: jest.fn() } };

    beforeRequestHook(request);

    expect(request.headers.set).toHaveBeenCalledWith(OKAPI_TENANT_HEADER, centralTenantId);
  });

  it('should return zero count when response does not contain total records', async () => {
    kyMock.get.mockReturnValueOnce({ json: () => Promise.resolve({}) });

    const { result } = renderHook(() => useCentralTenantSettingsCount(path), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalled();
    expect(result.current.count).toEqual(0);
  });

  it.each([
    ['path is not provided', undefined, { id: 'consortium-id', centralTenantId }],
    ['central tenant ID is not defined', path, { id: 'consortium-id' }],
  ])('should not send a request when %s', async (_, hookPath, consortium) => {
    useStripes.mockReturnValue(buildStripesWithConsortium(consortium));

    const { result } = renderHook(() => useCentralTenantSettingsCount(hookPath), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(kyMock.get).not.toHaveBeenCalled();
    expect(result.current.count).toEqual(0);
  });

  it('should not send a request when disabled via options', async () => {
    const { result } = renderHook(() => useCentralTenantSettingsCount(path, { enabled: false }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(kyMock.get).not.toHaveBeenCalled();
    expect(result.current.count).toEqual(0);
  });
});
