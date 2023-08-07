import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { pcPublicationResults } from 'fixtures';
import { usePublishCoordinator } from '../usePublishCoordinator';
import {
  PC_SHARE_DETAILS_KEYS,
  useSettingSharing,
} from './useSettingSharing';
import {
  HTTP_METHODS,
  SETTINGS_SHARING_API,
} from '../../constants';

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

      const { result, waitFor } = renderHook(() => useSettingSharing({ path }), { wrapper });
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
  });
});