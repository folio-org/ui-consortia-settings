import { groupBy, sortBy } from 'lodash/fp';
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

import {
  CONTROLLED_VOCAB_LIMIT,
  RECORD_SOURCE,
} from '../../../constants';
import { useConsortiumManagerContext } from '../../../contexts';
import { throwErrorResponse } from '../../../utils';
import { usePublishCoordinator } from '../../../hooks';

const DEFAULT_DATA = [];

const squashSharedRecords = (records, sharedRecordIds) => {
  return Object.entries(groupBy('id', records)).flatMap(([recordId, items]) => {
    return sharedRecordIds.has(recordId)
      ? [items.reduce((acc, curr) => Object.assign(acc, curr), {})]
      : items;
  });
};

const hydrateResults = (recordsField) => ({ publicationResults }) => {
  const sharedRecordIds = new Set();

  const flattenRecords = publicationResults.flatMap(({ tenantId, response }) => (
    response[recordsField]?.map((item) => {
      const shared = item.source === RECORD_SOURCE.CONSORTIUM;

      if (shared) sharedRecordIds.add(item.id);

      const additive = {
        tenantId: shared ? undefined : tenantId,
        shared,
      };

      return { ...item, ...additive };
    })
  ));

  return squashSharedRecords(flattenRecords, sharedRecordIds);
};

export const useEntries = (params = {}, options = {}) => {
  const stripes = useStripes();
  const [namespace] = useNamespace();
  const { selectedMembers } = useConsortiumManagerContext();
  const { initPublicationRequest } = usePublishCoordinator();

  const consortium = stripes.user?.user?.consortium;
  const {
    path,
    records,
    sortby,
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
      if (!selectedMembers?.length) return DEFAULT_DATA;

      const publication = {
        url: `/${path}?${stringify(searchParams)}`,
        method: 'GET',
        // TODO: refine how to distinguish shared records
        tenants: selectedMembers.map(({ id }) => id),
      };

      return initPublicationRequest(publication)
        .then(hydrateResults(records))
        .then(sortBy([sortby || 'name', 'tenantId']));
    },
    {
      enabled,
      keepPreviousData: true,
      ...options,
    },
  );

  return {
    isFetching,
    entries: data || DEFAULT_DATA,
    refetch,
    totalRecords: data?.length,
  };
};
