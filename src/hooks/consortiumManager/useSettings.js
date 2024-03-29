import { flow, sortBy } from 'lodash/fp';
import { stringify } from 'query-string';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useStripes,
} from '@folio/stripes/core';
import {
  LIMIT_PARAMETER,
  OFFSET_PARAMETER,
} from '@folio/stripes-acq-components';

import { CONTROLLED_VOCAB_LIMIT } from '../../constants';
import { useConsortiumManagerContext } from '../../contexts';
import { hydrateSharedRecords, throwErrorResponse } from '../../utils';
import { usePublishCoordinator } from '../usePublishCoordinator';

const DEFAULT_DATA = [];

export const useSettings = (params = {}, options = {}) => {
  const stripes = useStripes();
  const [namespace] = useNamespace();
  const { selectedMembers } = useConsortiumManagerContext();
  const { initPublicationRequest } = usePublishCoordinator();

  const consortium = stripes.user?.user?.consortium;
  const {
    path,
    records,
    sortby,
    squashSharedSetting,
  } = params;

  const queryKey = [namespace, path, records, selectedMembers];
  const searchParams = {
    [LIMIT_PARAMETER]: CONTROLLED_VOCAB_LIMIT,
    [OFFSET_PARAMETER]: 0,
  };

  const enabled = Boolean(
    path
    && records
    && consortium?.id,
  );

  const {
    data,
    isFetching,
    refetch,
  } = useQuery(
    queryKey,
    async () => {
      if (!selectedMembers?.length) return {};

      const publication = {
        url: `${path}?${stringify(searchParams)}`,
        method: 'GET',
        tenants: selectedMembers.map(({ id }) => id),
      };

      try {
        const { publicationErrors, ...response } = await initPublicationRequest(publication);

        const entries = flow(
          hydrateSharedRecords(records, squashSharedSetting),
          sortBy([sortby || 'name', 'tenantId']),
        )(response);

        return {
          entries,
          errors: publicationErrors,
        };
      } catch (error) {
        return throwErrorResponse(error);
      }
    },
    {
      enabled,
      keepPreviousData: true,
      ...options,
    },
  );

  return {
    isFetching,
    entries: data?.entries || DEFAULT_DATA,
    refetch,
    totalRecords: data?.entries?.length,
  };
};
