import { clone, uniqBy } from 'lodash';

import { useUsersBatch } from '@folio/stripes-acq-components';

import {
  useEntries,
  useEntryMutation,
} from '../../../src/components/ConsortiaControlledVocabulary/hooks';

jest.unmock('react-final-form-arrays');
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useUsersBatch: jest.fn(),
}));
jest.mock('../../../src/components/ConsortiaControlledVocabulary/hooks', () => ({
  useEntries: jest.fn(),
  useEntryMutation: jest.fn(),
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
    createEntry: jest.fn(),
    updateEntry: jest.fn(),
    deleteEntry: jest.fn(),
    isLoading: false,
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

  describe(name, () => {
    beforeEach(() => {
      entriesMock.refetch.mockClear();
      mutationsMock.createEntry.mockClear();
      mutationsMock.updateEntry.mockClear();
      mutationsMock.deleteEntry.mockClear();
      useEntries.mockClear().mockReturnValue(entriesMock);
      useEntryMutation.mockClear().mockReturnValue(mutationsMock);
      useUsersBatch.mockClear().mockReturnValue(usersMock);
    });

    callback({
      entries: entriesMock,
      mutations: mutationsMock,
    });
  });
};
