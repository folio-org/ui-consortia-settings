import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';

import { useOkapiKy } from '@folio/stripes/core';

import { OKAPI_TENANT_HEADER } from '../../constants';
import { throwErrorResponse } from '../../utils';
import { usePublishCoordinator } from '../usePublishCoordinator';

const injectTenantHeader = (ky, tenantId) => ky.extend({
  hooks: {
    beforeRequest: [
      request => {
        request.headers.set(OKAPI_TENANT_HEADER, tenantId);
      },
    ],
  },
});

// TODO: handle PC result errors (UICONSET-112, UICONSET-113)
export const useSettingMutation = ({ path }) => {
  const ky = useOkapiKy();
  const { initPublicationRequest } = usePublishCoordinator();

  const {
    isLoading: isEntryCreating,
    mutateAsync: createEntry,
  } = useMutation({
    mutationFn: ({ entry, tenants }) => {
      const publication = {
        url: path,
        method: 'POST',
        tenants,
        payload: { id: uuidv4(), ...entry },
      };

      return initPublicationRequest(publication).catch(throwErrorResponse);
    },
  });

  const {
    isLoading: isEntryUpdating,
    mutateAsync: updateEntry,
  } = useMutation({
    mutationFn: ({ entry }) => {
      const { tenantId, ...json } = entry;

      return injectTenantHeader(ky, tenantId).put(`${path}/${entry.id}`, { json }).catch(throwErrorResponse);
    },
  });

  const {
    isLoading: isEntryDeleting,
    mutateAsync: deleteEntry,
  } = useMutation({
    mutationFn: ({ entry }) => {
      const { id, tenantId } = entry;

      return injectTenantHeader(ky, tenantId).delete(`${path}/${id}`).catch(throwErrorResponse);
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
