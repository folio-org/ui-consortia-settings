import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import { useOkapiKy } from '@folio/stripes/core';

import { OKAPI_TENANT_HEADER } from '../../../constants';
import { usePublishCoordinator } from '../../../hooks';
import { throwErrorResponse } from '../../../utils';

const injectTenantHeader = (ky, tenantId) => ky.extend({
  hooks: {
    beforeRequest: [
      request => {
        request.headers.set(OKAPI_TENANT_HEADER, tenantId);
      },
    ],
  },
});

export const useEntryMutation = ({ path }) => {
  const ky = useOkapiKy();
  const { initPublicationRequest } = usePublishCoordinator();

  // Publications API requires `url` value to start with slash (`/`)
  const url = path.startsWith('/') ? path : `/${path}`;

  const {
    isLoading: isEntryCreating,
    mutateAsync: createEntry,
  } = useMutation({
    mutationFn: ({ entry, tenants }) => {
      const { shared, ...json } = entry;

      if (shared) {
        // TODO: implement editing of a shared setting
        return Promise.reject(new Error('Not implemented yet'));
      }

      const publication = {
        url,
        method: 'POST',
        tenants,
        payload: { id: uuidv4(), ...json },
      };

      return initPublicationRequest(publication);
    },
  });

  const {
    isLoading: isEntryUpdating,
    mutateAsync: updateEntry,
  } = useMutation({
    mutationFn: ({ entry }) => {
      const { shared, tenantId, ...json } = entry;

      if (shared) {
        // TODO: implement editing of a shared setting
        return Promise.reject(new Error('Not implemented yet'));
      }

      return injectTenantHeader(ky, tenantId).put(`${path}/${entry.id}`, { json }).catch(throwErrorResponse);
    },
  });

  const {
    isLoading: isEntryDeleting,
    mutateAsync: deleteEntry,
  } = useMutation({
    mutationFn: ({ entry }) => {
      const { shared, tenantId } = entry;

      if (shared) {
        // TODO: implement deletion of a shared setting
        return Promise.reject(new Error('Not implemented yet'));
      }

      return injectTenantHeader(ky, tenantId).delete(`${path}/${entry.id}`).catch(throwErrorResponse);
    },
  });

  const isLoading = isEntryCreating || isEntryUpdating || isEntryDeleting;

  return {
    createEntry,
    updateEntry,
    deleteEntry,
    isLoading,
  };
};
