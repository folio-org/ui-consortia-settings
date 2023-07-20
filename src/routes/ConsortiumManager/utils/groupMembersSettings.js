import {
  flow,
  groupBy,
  mapValues,
  partition,
} from 'lodash/fp';

// TODO: add docs
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
