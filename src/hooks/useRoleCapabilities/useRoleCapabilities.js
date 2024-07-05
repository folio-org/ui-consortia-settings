import { useQuery } from 'react-query';
import {
  pick,
  mapValues,
  keyBy,
} from 'lodash';
import { useMemo } from 'react';

import {
  useNamespace, useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { CAPABILITIES_LIMIT } from '../../constants';
import { getCapabilitiesGroupedByTypeAndResource } from '../../utils';

export const useRoleCapabilities = (roleId, tenantId, expand = false, options = {}) => {
  const { enabled = true, ...otherOptions } = options;
  const stripes = useStripes();
  const installedApplications = Object?.keys(stripes.discovery.applications);
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'role-capabilities-list' });

  const { data, isSuccess } = useQuery({
    queryKey: [namespace, roleId],
    queryFn: () => ky.get(
      `roles/${roleId}/capabilities`,
      {
        searchParams: {
          limit: CAPABILITIES_LIMIT,
          query: 'cql.allRecords=1 sortby resource',
          expand: !!expand,
        },
      },
    ).json(),
    enabled: Boolean(enabled && !!roleId),
    placeholderData: {
      capabilities: [], totalRecords: 0,
    },
    ...otherOptions,
  });

  const initialRoleCapabilitiesSelectedMap = useMemo(() => {
    return data?.capabilities.reduce((acc, capability) => {
      acc[capability.id] = true;

      return acc;
    }, {}) || {};
  }, [data]);

  const groupedRoleCapabilitiesByType = useMemo(() => {
    return getCapabilitiesGroupedByTypeAndResource(data?.capabilities || []);
  }, [data]);

  const capabilitiesAppIds = useMemo(() => {
    const capabilitiesById = mapValues(keyBy(data?.capabilities, 'applicationId'), () => true) || {};
    const filteredByInstalledApplications = pick(capabilitiesById, installedApplications);

    return filteredByInstalledApplications;
    // stripes.discovery is configured during application initialization
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    initialRoleCapabilitiesSelectedMap,
    isSuccess,
    capabilitiesTotalCount: data?.totalRecords || 0,
    groupedRoleCapabilitiesByType,
    capabilitiesAppIds
  };
};
