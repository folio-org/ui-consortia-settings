import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { throwErrorResponse } from '../../../utils';

export const useEntryMutation = ({ path }) => {
  const ky = useOkapiKy();

  const {
    isLoading: isEntryCreating,
    mutateAsync: createEntry,
  } = useMutation({
    mutationFn: ({ entry }) => ky.post(path, { json: entry }).json().catch(throwErrorResponse),
  });

  const {
    isLoading: isEntryUpdating,
    mutateAsync: updateEntry,
  } = useMutation({
    mutationFn: ({ entry }) => ky.put(`${path}/${entry.id}`, { json: entry }).catch(throwErrorResponse),
  });

  const {
    isLoading: isEntryDeleting,
    mutateAsync: deleteEntry,
  } = useMutation({
    mutationFn: ({ entry }) => ky.delete(`${path}/${entry.id}`).catch(throwErrorResponse),
  });

  const isLoading = isEntryCreating || isEntryUpdating || isEntryDeleting;

  return {
    createEntry,
    updateEntry,
    deleteEntry,
    isLoading,
  };
};
