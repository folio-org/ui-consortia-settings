import {
  pick,
  mapValues,
  keyBy,
} from 'lodash';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useStripes,
} from '@folio/stripes/core';

import { CAPABILITIES_LIMIT } from '../../constants';
import { getCapabilitiesGroupedByTypeAndResource } from '../../utils';
import { useTenantKy } from '../useTenantKy';

export const useRoleCapabilitySets = (roleId, tenantId, options = {}) => {
  const { enabled = true, ...otherOptions } = options;
  const stripes = useStripes();
  const installedApplications = Object?.keys(stripes.discovery.applications);
  const ky = useTenantKy({ tenantId });
  const [namespace] = useNamespace({ key: 'role-capability-sets' });

  const { data, isSuccess } = useQuery({
    queryKey: [namespace, roleId],
    queryFn: () => ky.get(`roles/${roleId}/capability-sets?limit=${CAPABILITIES_LIMIT}`).json(),
    enabled: Boolean(enabled && !!roleId),
    ...otherOptions,
  });

  const initialRoleCapabilitySetsSelectedMap = useMemo(() => {
    return data?.capabilitySets.reduce((acc, capability) => {
      acc[capability.id] = true;

      return acc;
    }, {}) || {};
  }, [data]);

  const groupedRoleCapabilitySetsByType = useMemo(() => {
    return getCapabilitiesGroupedByTypeAndResource(data?.capabilitySets || []);
  }, [data]);

  const capabilitySetsCapabilities = useMemo(() => {
    return data?.capabilitySets
      .flatMap(capSet => capSet.capabilities)
      .reduce((obj, item) => {
        obj[item] = true;

        return obj;
      }, {});
  }, [data]);

  const capabilitySetsAppIds = useMemo(() => {
    const capabilitySetsById = mapValues(keyBy(data?.capabilitySets, 'applicationId'), () => true) || {};
    const filteredByInstalledApplications = pick(capabilitySetsById, installedApplications);

    return filteredByInstalledApplications;
    // stripes.discovery is configured during application initialization
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return {
    initialRoleCapabilitySetsSelectedMap,
    isSuccess,
    capabilitySetsTotalCount: data?.totalRecords || 0,
    groupedRoleCapabilitySetsByType,
    capabilitySetsCapabilities,
    capabilitySetsAppIds,
  };
};
