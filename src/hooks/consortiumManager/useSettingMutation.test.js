import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { tenants } from 'fixtures';
import { usePublishCoordinator } from '../usePublishCoordinator';
import { useSettingMutation } from './useSettingMutation';

jest.mock('../usePublishCoordinator', () => ({
  usePublishCoordinator: jest.fn(),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const path = 'some-storage/entries';
const setting = { id: 'test-id', name: 'foo' };
const localHydratedSetting = { ...setting, tenantId: 'tenantId' };

const kyMock = {
  extend: jest.fn(() => kyMock),
  post: jest.fn(() => ({
    json: () => Promise.resolve(localHydratedSetting),
  })),
  put: jest.fn(() => Promise.resolve()),
  delete: jest.fn(() => Promise.resolve()),
};
const initPublicationRequest = jest.fn(() => Promise.resolve());

describe('useSettingMutation', () => {
  beforeEach(() => {
    kyMock.post.mockClear();
    kyMock.put.mockClear();
    kyMock.delete.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
    usePublishCoordinator.mockClear().mockReturnValue(({ initPublicationRequest }));
  });

  describe('Members local settings', () => {
    it('should send POST request to create settings in the provided tenants', async () => {
      const { result } = renderHook(() => useSettingMutation({ path }), { wrapper });

      await result.current.createEntry({ entry: localHydratedSetting, tenants });
      await waitFor(() => !result.current.isLoading);

      expect(initPublicationRequest).toHaveBeenCalledWith({
        method: 'POST',
        payload: expect.objectContaining(setting),
        tenants,
        url: path,
      });
    });

    it.each([
      ['updateEntry', kyMock.put, [`${path}/${setting.id}`, { json: setting }]],
      ['deleteEntry', kyMock.delete, [`${path}/${setting.id}`]],
    ])('should handle \'%s\' mutation', async (fnName, mockedFn, args) => {
      const { result } = renderHook(() => useSettingMutation({ path }), { wrapper });

      const mutationFn = result.current[fnName];

      await mutationFn({ entry: localHydratedSetting });
      await waitFor(() => !result.current.isLoading);

      expect(mockedFn).toHaveBeenCalledWith(...args);
    });
  });
});
