import groupBy from 'lodash/groupBy';

import { RECORD_SOURCE } from '../constants';

const squashSharedRecords = (records, sharedRecordIds) => {
  return Object.entries(groupBy(records, 'id')).flatMap(([recordId, items]) => {
    return sharedRecordIds.has(recordId)
      ? [items.reduce((acc, curr) => Object.assign(acc, curr), {})]
      : items;
  });
};

export const hydrateSharedRecords = (recordsField) => ({ publicationResults }) => {
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
