import { RECORD_SOURCE } from '../constants';

export const isSettingShared = (setting) => {
  return setting?.source === RECORD_SOURCE.CONSORTIUM;
};
