import groupBy from 'lodash/groupBy';
import { v4 } from 'uuid';

import { UNIQUE_FIELD_KEY } from '../constants';
import { isSettingShared } from './isSettingShared';

const defaultSquashFn = (sharedSettingRecords) => {
  return sharedSettingRecords.reduce((acc, curr) => Object.assign(acc, curr), {});
};

/*
  Keycloak creates different IDs for a system user in different tenants,
  so we can't use user IDs to fetch users from the central tenant.
  As a workaround, we squash records metadata from different tenants.
 */
const squashRecordMetadata = (sharedSettingRecords, consortium) => {
  const centralTenantRecord = sharedSettingRecords.find(({ _pcTenantId }) => {
    return _pcTenantId === consortium?.centralTenantId;
  });

  return sharedSettingRecords.map(({ metadata, _pcTenantId, ...rest }) => ({
    metadata: centralTenantRecord?.metadata || metadata,
    ...rest,
  }));
};

export const hydrateSharedRecords = (
  recordsField,
  squashSharedSetting = defaultSquashFn,
  params = {},
) => ({ publicationResults }) => {
  const { consortium } = params;

  const sharedRecordIds = new Set();

  const flattenRecords = publicationResults.flatMap(({ tenantId, response }) => (
    response[recordsField]?.map((item) => {
      const shared = isSettingShared(item);

      if (shared) sharedRecordIds.add(item.id);

      const additive = {
        [UNIQUE_FIELD_KEY]: v4(),
        shared,
        tenantId: shared ? undefined : tenantId,
        // Tenant associated with the record in publication response. Used to squash records metadata.
        ...{ _pcTenantId: shared ? tenantId : undefined },
      };

      return { ...item, ...additive };
    })
  )).filter(Boolean);

  return Object.entries(groupBy(flattenRecords, 'id')).flatMap(([recordId, items]) => {
    return sharedRecordIds.has(recordId)
      ? [squashSharedSetting(squashRecordMetadata(items, consortium))]
      : items;
  });
};
