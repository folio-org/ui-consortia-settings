import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { pcPublicationResults } from 'fixtures';
import {
  HTTP_METHODS,
  SETTINGS_SHARING_API,
} from '../../constants';
import { usePublishCoordinator } from '../usePublishCoordinator';
import {
  PC_SHARE_DETAILS_KEYS,
  useSettingSharing,
} from './useSettingSharing';

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

const path = '/some-storage/entries';
const setting = { id: 'test-id', name: 'foo' };
const pcId = 'test-pc-id';

const getKyMock = (result) => jest.fn(() => ({
  json: () => Promise.resolve(result),
}));
const getPublicationDetails = jest.fn(() => Promise.resolve(pcPublicationResults));

describe('useSettingSharing', () => {
  beforeEach(() => {
    getPublicationDetails.mockClear();
    useOkapiKy.mockClear();
    usePublishCoordinator.mockClear().mockReturnValue(({ getPublicationDetails }));
  });

  describe('Upsert shared setting', () => {
    it('should send POST request to sharing settings API to initiate PC request', async () => {
      const kyMock = getKyMock({ [PC_SHARE_DETAILS_KEYS.create]: pcId });

      useOkapiKy.mockReturnValue(kyMock);

      const { result } = renderHook(() => useSettingSharing({ path }), { wrapper });
      const pcResults = await result.current.upsertSharedSetting({ entry: setting });

      await waitFor(() => !result.current.isLoading);

      expect(kyMock).toHaveBeenCalledWith(
        expect.stringContaining(SETTINGS_SHARING_API),
        expect.objectContaining({
          method: HTTP_METHODS.POST,
          json: expect.objectContaining({
            settingId: setting.id,
            url: path,
            payload: expect.objectContaining(setting),
          }),
        }),
      );
      expect(getPublicationDetails).toHaveBeenCalledWith(pcId, expect.objectContaining({}));
      expect(pcResults).toEqual(pcPublicationResults);
    });

    it('should send DELETE request to sharing settings API to initiate PC request', async () => {
      const kyMock = getKyMock({ [PC_SHARE_DETAILS_KEYS.delete]: pcId });

      useOkapiKy.mockReturnValue(kyMock);

      const { result, waitFor } = renderHook(() => useSettingSharing({ path }), { wrapper });
      const pcResults = await result.current.deleteSharedSetting({ entry: setting });

      await waitFor(() => !result.current.isLoading);

      expect(kyMock).toHaveBeenCalledWith(
        expect.stringContaining(SETTINGS_SHARING_API),
        expect.objectContaining({
          method: HTTP_METHODS.DELETE,
          json: expect.objectContaining({
            settingId: setting.id,
            url: path,
          }),
        }),
      );
      expect(getPublicationDetails).toHaveBeenCalledWith(pcId, expect.objectContaining({}));
      expect(pcResults).toEqual(pcPublicationResults);
    });
  });
});
