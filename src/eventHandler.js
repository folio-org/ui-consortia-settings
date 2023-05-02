import { coreEvents } from '@folio/stripes/core';

import { SwitchActiveAffiliation } from './components';

/**
 * eventHandler
 * @param {string} event
 * @param {object} stripes
 * @param {object} data
 *
 * @returns null, or a Component in order to prevent the event from propagating
 */
export const eventHandler = (event) => {
  if (event === coreEvents.CHANGE_ACTIVE_AFFILIATION) {
    return SwitchActiveAffiliation;
  }

  return null;
};
