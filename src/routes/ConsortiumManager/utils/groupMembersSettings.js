import {
  flow,
  groupBy,
  mapValues,
  partition,
} from 'lodash/fp';

/**
 * Group the list of settings into local and shared. Local, in turn, are grouped by tenant ID.
 *
 * Shared settings are available in each of the tenants, so they are included in the local list.
 *
 * @template {{
 *  tenantId: string,
 *  shared: boolean,
 * }} HydratedSetting
 *
 * @param {HydratedSetting[]} hydratedSettings - settings hydrated with `shared` and `tenantId` values.
 * @returns {{
 *  shared: HydratedSetting[],
 *  local: {
 *    [tenantId: string]: HydratedSetting[]
 *  }
 * }}
 */
export const groupMembersSettings = (hydratedSettings) => {
  const [sharedSettings, memberSettings] = partition(({ shared }) => Boolean(shared), hydratedSettings);

  return {
    shared: sharedSettings,
    local: flow(
      groupBy('tenantId'),
      mapValues((items) => [...items, ...sharedSettings]),
    )(memberSettings),
  };
};
