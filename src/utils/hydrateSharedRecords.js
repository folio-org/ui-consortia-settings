import groupBy from 'lodash/groupBy';
import omit from 'lodash/omit';
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
  const centralTenantRecord = sharedSettingRecords.find(({ pcTenantId }) => pcTenantId === consortium?.centralTenantId);

  return sharedSettingRecords.map(({ metadata, ...rest }) => ({
    metadata: centralTenantRecord?.metadata || metadata,
    ...omit(rest, ['pcTenantId']),
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
        tenantId: shared ? undefined : tenantId,
        pcTenantId: tenantId, // Tenant associated with the record in publication response
        shared,
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
