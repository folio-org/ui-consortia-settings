import { clone, uniqBy } from 'lodash';

import {
  useShowCallout,
  useUsersBatch,
} from '@folio/stripes-acq-components';

import { pcPublicationResults } from 'fixtures';
import {
  useSettings,
  useSettingMutation,
  useSettingSharing,
} from '../../../src/hooks/consortiumManager';

jest.unmock('react-final-form-arrays');
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useShowCallout: jest.fn(),
  useUsersBatch: jest.fn(),
}));
jest.mock('../../../src/hooks/consortiumManager', () => ({
  useSettings: jest.fn(),
  useSettingMutation: jest.fn(),
  useSettingSharing: jest.fn(),
}));

export const wrapConsortiaControlledVocabularyDescribe = ({
  entries = [],
  isFetching = false,
} = {}) => (name, callback) => {
  const currentEntries = clone(entries);

  const entriesMock = {
    isFetching,
    entries: currentEntries,
    refetch: jest.fn(),
    totalRecords: currentEntries.length,
  };

  const mutationsMock = {
    createEntry: jest.fn(() => Promise.resolve()),
    updateEntry: jest.fn(() => Promise.resolve()),
    deleteEntry: jest.fn(() => Promise.resolve()),
    isLoading: false,
  };

  const sharingMock = {
    deleteSharedSetting: jest.fn(() => Promise.resolve()),
    upsertSharedSetting: jest.fn(() => Promise.resolve()),
  };

  const usersMock = {
    users: uniqBy(
      entries.filter(({ metadata }) => Boolean(metadata?.updatedByUserId)),
      'metadata.updatedByUserId',
    ).map(({ metadata }) => ({
      id: metadata.updatedByUserId,
      personal: {
        firstName: 'John',
        lastName: 'Galt',
      },
    })),
    isLoading: false,
  };

  const callout = jest.fn();

  describe(name, () => {
    beforeEach(() => {
      entriesMock.refetch.mockClear();
      mutationsMock.createEntry.mockClear();
      mutationsMock.updateEntry.mockClear();
      mutationsMock.deleteEntry.mockClear();
      sharingMock.deleteSharedSetting.mockClear().mockResolvedValue(pcPublicationResults);
      sharingMock.upsertSharedSetting.mockClear().mockResolvedValue(pcPublicationResults);
      useSettings.mockClear().mockReturnValue(entriesMock);
      useSettingMutation.mockClear().mockReturnValue(mutationsMock);
      useSettingSharing.mockClear().mockReturnValue(sharingMock);
      useShowCallout.mockClear().mockReturnValue(callout);
      useUsersBatch.mockClear().mockReturnValue(usersMock);
    });

    callback({
      entries: entriesMock,
      mutations: mutationsMock,
      sharing: sharingMock,
      callout,
    });
  });
};
