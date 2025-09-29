import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import {
  pcPublicationResults,
  tenants,
} from 'fixtures';
import {
  buildStripesObject,
  ConsortiumManagerContextProviderMock,
} from 'helpers';
import { RECORD_SOURCE } from '../../constants';
import { usePublishCoordinator } from '../usePublishCoordinator';
import { useSettings } from './useSettings';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: jest.fn(() => ['namespace']),
  useStripes: jest.fn(),
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

const path = 'some-storage/entries';
const records = 'items';
const publicationResults = pcPublicationResults.publicationResults.map(({ response, ...rest }) => ({
  response: JSON.parse(response),
  ...rest,
}));
const response = {
  publicationResults,
  totalRecords: pcPublicationResults.totalRecords,
};

const initPublicationRequest = jest.fn();

const publication = {
  url: `${path}?limit=2000&offset=0`,
  method: 'GET',
  tenants: tenants.slice(3).map(({ id }) => id),
};

describe('useSettings', () => {
  beforeEach(() => {
    initPublicationRequest.mockResolvedValue(response);
    usePublishCoordinator.mockReturnValue(({ initPublicationRequest }));
    useStripes.mockReturnValue(buildStripesObject());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a publish coordinator request to get settings', async () => {
    const { result } = renderHook(() => useSettings({ path, records }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(initPublicationRequest).toHaveBeenCalledWith(publication);
  });

  it('should hydrate settings with \'tenantId\' and \'shared\' values', async () => {
    const tenantsSet = new Set(publicationResults.map(({ tenantId }) => tenantId));

    const { result } = renderHook(() => useSettings({ path, records }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    result.current.entries.forEach((item) => {
      if (!item.shared) expect(tenantsSet.has(item.tenantId)).toBeTruthy();
      expect(item.shared).toEqual(item.source === RECORD_SOURCE.CONSORTIUM);
    });
  });
});
