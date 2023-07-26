import groupBy from 'lodash/groupBy';

import { RECORD_SOURCE } from '../constants';

const defaultSquashFn = (sharedSettingRecords) => {
  return sharedSettingRecords.reduce((acc, curr) => Object.assign(acc, curr), {});
};

export const hydrateSharedRecords = (
  recordsField,
  squashSharedSetting = defaultSquashFn,
) => ({ publicationResults }) => {
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

  return Object.entries(groupBy(flattenRecords, 'id')).flatMap(([recordId, items]) => {
    return sharedRecordIds.has(recordId)
      ? [squashSharedSetting(items)]
      : items;
  });
};
